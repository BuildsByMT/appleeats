// backend/src/services/receiptService.js
// Production 80mm ESC/POS Thermal Receipt Service
// Implements PC437 code page mapping, paper cutting, hardware buzzer, and dynamic order binding

const { toPounds, toPence } = require('./financialEngine');

function generateReceiptData(order) {
  const isDelivery = order.fulfillmentType === 'delivery';
  const orderNumberDisplay = `#${order.orderSequence || 1} ${isDelivery ? 'Delivery' : 'Collection'}`;
  
  // Format target due time (e.g., '06:53 PM')
  const dueTime = order.dueTime || new Date(Date.now() + 30 * 60000).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const subtotal = order.subtotal !== undefined ? Number(order.subtotal).toFixed(2) : "0.00";
  // Fix falsy logic: if deliveryFee is explicitly 0 or 0.00, preserve 0.00 instead of falling back to 0.99
  const deliveryCharge = isDelivery
    ? (order.deliveryFee !== undefined ? Number(order.deliveryFee).toFixed(2) : "0.99")
    : "0.00";
  const serviceCharge = order.serviceFee !== undefined ? Number(order.serviceFee).toFixed(2) : "0.50";
  const discount = order.discount ? Number(order.discount).toFixed(2) : "0.00";
  const total = order.total !== undefined ? Number(order.total).toFixed(2) : "0.00";

  return {
    takeawayPhone: order.restaurantPhone || "01782698710",
    orderSequenceHeader: orderNumberDisplay,
    dueTime: `Due at ${dueTime}`,
    customer: {
      name: order.customerName || "Customer",
      addressLine1: order.deliveryAddress?.line1 || "Customer Address",
      city: order.deliveryAddress?.city || "Stoke-On-Trent",
      postcode: order.deliveryAddress?.postcode || "ST1 1AA",
      phone: order.customerPhone || "01782000000"
    },
    specialInstructions: order.specialInstructions || null,
    lines: (order.items || []).map(item => ({
      qty: item.quantity || 1,
      name: item.name || 'Dish Item',
      price: Number(item.price || item.basePrice || 0).toFixed(2),
      options: (item.selectedOptions || []).map(opt => ({
        name: opt.name,
        priceDelta: Number(opt.priceDelta || 0).toFixed(2)
      }))
    })),
    freeGift: order.freeGiftDescription || null,
    financials: {
      subtotal,
      deliveryCharge,
      serviceCharge,
      discount,
      total,
      paymentMethod: order.paymentMethod === 'cash_on_delivery' ? 'Cash' : 'Card',
      isPaid: order.paymentMethod !== 'cash_on_delivery'
    }
  };
}

/**
 * Generate ESC/POS raw bytes for 80mm thermal POS receipt printers
 * Uses standard Code Page 437 (PC437) where byte 0x9C represents the British Pound symbol (£)
 */
function generateEscPosBytes(receiptData) {
  const ESC = 0x1B;
  const GS = 0x1D;
  const chunks = [];

  function writeAscii(str) {
    // Convert string to bytes with PC437 pound sign mapping (0x9C)
    const buf = Buffer.alloc(str.length);
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code === 163 || str[i] === '£') {
        buf[i] = 0x9C; // PC437 British Pound symbol (£)
      } else if (code < 128) {
        buf[i] = code;
      } else {
        buf[i] = 0x20; // fallback space for unmapped characters
      }
    }
    chunks.push(buf);
  }

  function writeBytes(...bytes) {
    chunks.push(Buffer.from(bytes));
  }

  // 1. Initialize printer
  writeBytes(ESC, 0x40);

  // 2. Select Character Code Table 0 (PC437: Standard Europe)
  writeBytes(ESC, 0x74, 0x00);

  // 3. Sound buzzer for new incoming ticket (2 beeps, 100ms)
  writeBytes(ESC, 0x42, 0x02, 0x02);

  // 4. Center alignment
  writeBytes(ESC, 0x61, 0x01);

  // Header
  writeAscii(`tel: ${receiptData.takeawayPhone}\n`);
  writeAscii('------------------------------------------\n');

  // Double-height bold order number
  writeBytes(ESC, 0x21, 0x20); // Double height
  writeAscii(`${receiptData.orderSequenceHeader}\n`);
  writeBytes(ESC, 0x21, 0x00); // Reset font
  writeAscii(`${receiptData.dueTime}\n`);
  writeAscii('==========================================\n');

  // Left alignment for customer info
  writeBytes(ESC, 0x61, 0x00);
  writeAscii(`${receiptData.customer.name}\n`);
  writeAscii(`${receiptData.customer.addressLine1}\n`);
  writeAscii(`${receiptData.customer.city}\n`);
  writeAscii(`${receiptData.customer.postcode}\n`);
  writeAscii(`tel: ${receiptData.customer.phone}\n`);
  writeAscii('==========================================\n');

  if (receiptData.specialInstructions) {
    writeAscii(`Note:\n${receiptData.specialInstructions}\n`);
    writeAscii('------------------------------------------\n');
  }

  // Items (42 column width standard on 80mm printers)
  receiptData.lines.forEach(item => {
    const leftText = `[${item.qty}] ${item.name}`.slice(0, 30);
    const rightText = `£${item.price}`;
    const spaces = Math.max(1, 42 - leftText.length - rightText.length);
    writeAscii(`${leftText}${' '.repeat(spaces)}${rightText}\n`);

    if (item.options && item.options.length > 0) {
      item.options.forEach(opt => {
        const optLeft = `    ${opt.name}`.slice(0, 30);
        const optRight = Number(opt.priceDelta) > 0 ? `+£${opt.priceDelta}` : 'Free';
        const optSpaces = Math.max(1, 42 - optLeft.length - optRight.length);
        writeAscii(`${optLeft}${' '.repeat(optSpaces)}${optRight}\n`);
      });
    }
  });

  if (receiptData.freeGift) {
    writeAscii(`\n*** ${receiptData.freeGift} ***\n`);
  }

  writeAscii('==========================================\n');

  // Financial summary lines
  function printFinanceLine(label, value) {
    const spaces = Math.max(1, 42 - label.length - value.length);
    writeAscii(`${label}${' '.repeat(spaces)}${value}\n`);
  }

  printFinanceLine('Subtotal:', `£${receiptData.financials.subtotal}`);
  if (receiptData.financials.deliveryCharge !== "0.00") {
    printFinanceLine('Delivery Charge:', `£${receiptData.financials.deliveryCharge}`);
  }
  printFinanceLine('Service Charge:', `£${receiptData.financials.serviceCharge}`);
  if (receiptData.financials.discount !== "0.00") {
    printFinanceLine('Discount:', `-£${receiptData.financials.discount}`);
  }
  writeAscii('------------------------------------------\n');
  printFinanceLine('Total:', `£${receiptData.financials.total}`);
  printFinanceLine(receiptData.financials.paymentMethod, `£${receiptData.financials.total}`);
  writeAscii('\n');

  // Centered PAID status box
  writeBytes(ESC, 0x61, 0x01);
  writeBytes(ESC, 0x45, 0x01); // Bold on
  writeAscii(receiptData.financials.isPaid ? '  [ PAID ]  \n' : '  [ TO PAY ON DELIVERY ]  \n');
  writeBytes(ESC, 0x45, 0x00); // Bold off

  // Food safety allergen advisory statement per Natasha's Law
  writeAscii('\nNatasha\'s Law Notice: If you have an allergy,\nplease check ingredients or phone takeaway.\n');

  // Feed 4 lines and execute partial cut (GS V 66 0)
  writeAscii('\n\n\n\n');
  writeBytes(GS, 0x56, 0x42, 0x00);

  return Buffer.concat(chunks);
}

module.exports = {
  generateReceiptData,
  generateEscPosBytes
};
