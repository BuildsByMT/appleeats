// Apple Eats - Official Stoke-on-Trent Takeaway & Menu Dataset
// Matches all UI screenshots and the live thermal receipt (Owen Hume / 55 Stanley Road, ST47PW)

const restaurants = [
  {
    id: "rest-fish-lounge",
    name: "Fish Lounge",
    slug: "fish-lounge",
    tagline: "Finest Traditional Fish & Chips in Stoke-on-Trent",
    description: "Award-winning British seafood, sustainably sourced fresh cod, haddock, and artisan seafood platters prepared to order.",
    phone: "01782698710",
    isClientOwned: true,
    cuisineTypes: ["Seafood", "British", "Fish & Chips"],
    logoUrl: "/assets/branding/main-logo.png",
    coverImageUrl: "/assets/branding/4.jpg",
    address: {
      street: "123 High Street",
      town: "Hanley",
      city: "Stoke-on-Trent",
      postcode: "ST1 1AA"
    },
    fhrsRating: 5,
    rating: 4.8,
    reviewsCount: 240,
    operatingStatus: "open",
    supportsDelivery: true,
    supportsCollection: true,
    deliverySettings: {
      minOrderDelivery: 10.00,
      deliveryFee: 1.50,
      freeDeliveryThreshold: 25.00,
      estimatedDeliveryMins: "20-30 min",
      estimatedCollectionMins: "15-20 min",
      allowedPostcodes: ["ST1", "ST2", "ST3", "ST4", "ST5", "ST6"]
    },
    categories: [
      {
        id: "cat-fl-mains",
        name: "Mains",
        items: [
          {
            id: "fl-m1",
            name: "Traditional Fish & Chips",
            description: "Freshly battered cod served with chunky chips, mushy peas, and tartar sauce.",
            price: 14.95,
            image: "https://images.unsplash.com/photo-1579208030886-b937da0925dc?auto=format&fit=crop&w=600&q=80",
            allergens: ["Fish", "Gluten"],
            isCustomizable: false,
            isAvailable: true
          },
          {
            id: "fl-m2",
            name: "Pan-Seared Sea Bass",
            description: "Served with crushed new potatoes, asparagus, and a warm lemon butter sauce.",
            price: 17.50,
            image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
            allergens: ["Fish", "Milk"],
            isCustomizable: false,
            isAvailable: true
          },
          {
            id: "fl-m3",
            name: "Garlic Butter Seafood Platter",
            description: "Grilled prawns, squid, and mussels in garlic butter with rustic bread.",
            price: 21.95,
            image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
            allergens: ["Crustaceans", "Molluscs", "Milk", "Gluten"],
            isCustomizable: false,
            isAvailable: true
          },
          {
            id: "fl-m4",
            name: "Spiced Grilled Salmon",
            description: "Cajun-spiced salmon fillet served with Mediterranean roasted vegetables.",
            price: 16.00,
            image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80",
            allergens: ["Fish"],
            isCustomizable: false,
            isAvailable: true
          }
        ]
      },
      {
        id: "cat-fl-starters",
        name: "Starters",
        items: [
          {
            id: "fl-s1",
            name: "Crispy Calamari Rings",
            description: "Golden panko-crusted calamari with homemade garlic aioli.",
            price: 6.95,
            image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80",
            allergens: ["Molluscs", "Gluten"],
            isCustomizable: false,
            isAvailable: true
          }
        ]
      },
      {
        id: "cat-fl-sides",
        name: "Sides",
        items: [
          {
            id: "fl-side1",
            name: "Chunky British Chips",
            description: "Double-cooked Maris Piper chunky chips with sea salt.",
            price: 3.50,
            image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80",
            allergens: [],
            isCustomizable: false,
            isAvailable: true
          },
          {
            id: "fl-side2",
            name: "Mushy Peas & Tartar Pot",
            description: "Traditional marrowfat peas with fresh dill tartar.",
            price: 2.20,
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
            allergens: ["Eggs"],
            isCustomizable: false,
            isAvailable: true
          }
        ]
      }
    ]
  },
  {
    id: "rest-go-grill",
    name: "Go Grill",
    slug: "go-grill",
    tagline: "Gourmet Burgers, Fresh Bowls & Artisan Stonebaked Pizzas",
    description: "Build your own custom meal bowls, gourmet Black Angus burgers, and artisan pizzas with premium toppings.",
    phone: "01782698710",
    isClientOwned: true,
    cuisineTypes: ["Grill", "Burgers", "Pizza", "BBQ"],
    logoUrl: "/assets/branding/main-logo.png",
    coverImageUrl: "/assets/branding/2.jpg",
    address: {
      street: "45 Stafford Street",
      town: "Hanley",
      city: "Stoke-on-Trent",
      postcode: "ST1 1SA"
    },
    fhrsRating: 5,
    rating: 4.7,
    reviewsCount: 240,
    operatingStatus: "open",
    supportsDelivery: true,
    supportsCollection: true,
    deliverySettings: {
      minOrderDelivery: 10.00,
      deliveryFee: 1.49,
      freeDeliveryThreshold: 20.00,
      estimatedDeliveryMins: "15-25 min",
      estimatedCollectionMins: "10-15 min",
      allowedPostcodes: ["ST1", "ST2", "ST3", "ST4", "ST5", "ST6", "ST7"]
    },
    categories: [
      {
        id: "cat-gg-pizzas",
        name: "Artisan Pizzas (Customizable)",
        items: [
          {
            id: "gg-p1",
            name: "7inch The Classic Pizza",
            description: "Our freshly baked dough with signature marinara, mozzarella, and optional toppings.",
            price: 4.50,
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
            allergens: ["Gluten", "Milk"],
            isCustomizable: true,
            isAvailable: true,
            customizationGroups: [
              {
                id: "grp-size",
                name: "Size",
                type: "single",
                isRequired: true,
                minSelections: 1,
                maxSelections: 1,
                options: [
                  { id: "opt-sz-7", name: "7 Inch", priceDelta: 0.00, isAvailable: true },
                  { id: "opt-sz-12", name: "12 Inch", priceDelta: 4.50, isAvailable: true }
                ]
              },
              {
                id: "grp-toppings",
                name: "Add Extra Toppings",
                type: "multiple",
                isRequired: false,
                minSelections: 0,
                maxSelections: 6,
                options: [
                  { id: "opt-top-tuna", name: "Tuna", priceDelta: 0.80, isAvailable: true },
                  { id: "opt-top-corn", name: "Sweetcorn", priceDelta: 0.80, isAvailable: true },
                  { id: "opt-top-cheese", name: "Extra Cheese", priceDelta: 1.20, isAvailable: true },
                  { id: "opt-top-jalapeno", name: "Jalapenos", priceDelta: 0.50, isAvailable: true },
                  { id: "opt-top-pepp", name: "Extra Pepperoni", priceDelta: 1.30, isAvailable: true },
                  { id: "opt-top-mush", name: "Mushrooms", priceDelta: 0.80, isAvailable: true }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "cat-gg-gourmet",
        name: "Gourmet Specialties",
        items: [
          {
            id: "gg-m1",
            name: "Sylheti Naga",
            description: "Super hot spicy specialty dish: 1x 6oz Gourmet Black Angus Patty, with Peri Fries and Naga Donner Stir Fry.",
            price: 11.95,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
            allergens: ["Gluten", "Sesame", "Mustard"],
            isCustomizable: true,
            isAvailable: true,
            customizationGroups: [
              {
                id: "grp-sn-spice",
                name: "Spice Heat Level",
                type: "single",
                isRequired: true,
                minSelections: 1,
                maxSelections: 1,
                options: [
                  { id: "opt-sn-mild", name: "Medium Hot", priceDelta: 0.00, isAvailable: true },
                  { id: "opt-sn-ext", name: "Extreme Naga Blast", priceDelta: 0.00, isAvailable: true }
                ]
              }
            ]
          },
          {
            id: "gg-m2",
            name: "Mixed Loaded Fries",
            description: "Crispy seasoned fries layered with melted Monterey Jack cheese, chicken tikka chunks, donner stir fry, and garlic herb sauce.",
            price: 11.00,
            image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80",
            allergens: ["Milk"],
            isCustomizable: false,
            isAvailable: true
          }
        ]
      },
      {
        id: "cat-gg-sides",
        name: "Sides & Dips",
        items: [
          {
            id: "gg-s1",
            name: "Cheesy Fries",
            description: "Skin-on fries drenched in rich hot melted cheddar.",
            price: 3.60,
            image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80",
            allergens: ["Milk"],
            isCustomizable: false,
            isAvailable: true
          },
          {
            id: "gg-s2",
            name: "10pcs Onion Rings",
            description: "Crispy beer-battered golden onion rings.",
            price: 3.50,
            image: "https://images.unsplash.com/photo-1639024471287-032f66ab750d?auto=format&fit=crop&w=600&q=80",
            allergens: ["Gluten"],
            isCustomizable: false,
            isAvailable: true
          },
          {
            id: "gg-s3",
            name: "Garlic Mayonnaise Dip",
            description: "Creamy Turkish style roasted garlic and herb mayo.",
            price: 1.00,
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
            allergens: ["Eggs"],
            isCustomizable: false,
            isAvailable: true
          }
        ]
      }
    ]
  },
  {
    id: "rest-crispy-chicken",
    name: "Crispy Chicken",
    slug: "crispy-chicken",
    tagline: "Crunchiest Southern Fried Chicken & Peri Wings in Stoke",
    description: "Original recipe fried chicken, spicy wings, crunch burgers, and family variety buckets.",
    phone: "01782698710",
    isClientOwned: true,
    cuisineTypes: ["Fried Chicken", "Fast Food", "Burgers"],
    logoUrl: "/assets/branding/main-logo.png",
    coverImageUrl: "/assets/branding/5.jpg",
    address: {
      street: "88 Broad Street",
      town: "Hanley",
      city: "Stoke-on-Trent",
      postcode: "ST1 4EU"
    },
    fhrsRating: 5,
    rating: 4.5,
    reviewsCount: 310,
    operatingStatus: "open",
    supportsDelivery: true,
    supportsCollection: true,
    deliverySettings: {
      minOrderDelivery: 10.00,
      deliveryFee: 1.50,
      freeDeliveryThreshold: 20.00,
      estimatedDeliveryMins: "20-30 min",
      estimatedCollectionMins: "10-15 min",
      allowedPostcodes: ["ST1", "ST2", "ST3", "ST4", "ST5", "ST6"]
    },
    categories: [
      {
        id: "cat-cc-buckets",
        name: "Fried Chicken Buckets",
        items: [
          {
            id: "cc-b1",
            name: "Family Variety Bucket",
            description: "10 pieces of original recipe chicken, 4 regular fries, 2 sides, and a large 1.5L drink.",
            price: 18.95,
            image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80",
            allergens: ["Gluten", "Celery"],
            isCustomizable: false,
            isAvailable: true
          },
          {
            id: "cc-b2",
            name: "10pc Spicy Wings Bucket",
            description: "Ten fiery, crispy chicken wings tossed in our signature spice blend.",
            price: 8.50,
            image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80",
            allergens: ["Gluten"],
            isCustomizable: false,
            isAvailable: true
          }
        ]
      },
      {
        id: "cat-cc-wraps",
        name: "Chicken Wraps & Burgers",
        items: [
          {
            id: "cc-w1",
            name: "Spicy Chicken Wrap",
            description: "Crispy chicken tenders, lettuce, spicy salsa, and mayo in a toasted tortilla, served with fries.",
            price: 7.95,
            image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80",
            allergens: ["Gluten", "Eggs"],
            isCustomizable: false,
            isAvailable: true
          },
          {
            id: "cc-w2",
            name: "Crispy Burger Deluxe",
            description: "A premium crispy chicken breast fillet, lettuce, melted cheese, and signature mayo on a brioche bun.",
            price: 6.50,
            image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
            allergens: ["Gluten", "Milk", "Eggs"],
            isCustomizable: false,
            isAvailable: true
          },
          {
            id: "cc-w3",
            name: "The Big Crunch Burger",
            description: "Double stacked crispy chicken fillets, hash brown, cheese, and spicy mayo.",
            price: 9.25,
            image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80",
            allergens: ["Gluten", "Milk", "Eggs"],
            isCustomizable: false,
            isAvailable: true
          },
          {
            id: "cc-w4",
            name: "Chicken Tenders Meal",
            description: "6 pieces of 100% crispy chicken breast tenders with dipping sauce and fries.",
            price: 8.25,
            image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80",
            allergens: ["Gluten"],
            isCustomizable: false,
            isAvailable: true
          }
        ]
      }
    ]
  },
  {
    id: "rest-bella-italia",
    name: "Bella Italia",
    slug: "bella-italia",
    tagline: "Authentic Stonebaked Italian Pizzas & Fresh Pastas",
    description: "Classic Italian pastas, slow-cooked ragus, stonebaked pizzas, and artisanal desserts in Stoke.",
    phone: "01782698710",
    isClientOwned: true,
    cuisineTypes: ["Italian", "Pasta", "Pizza"],
    logoUrl: "/assets/branding/main-logo.png",
    coverImageUrl: "/assets/branding/1.jpg",
    address: {
      street: "12 Piccadilly",
      town: "Hanley",
      city: "Stoke-on-Trent",
      postcode: "ST1 1DH"
    },
    fhrsRating: 5,
    rating: 4.6,
    reviewsCount: 120,
    operatingStatus: "open",
    supportsDelivery: true,
    supportsCollection: true,
    deliverySettings: {
      minOrderDelivery: 10.00,
      deliveryFee: 1.50,
      freeDeliveryThreshold: 25.00,
      estimatedDeliveryMins: "25-35 min",
      estimatedCollectionMins: "15-20 min",
      allowedPostcodes: ["ST1", "ST2", "ST3", "ST4", "ST5"]
    },
    categories: [
      {
        id: "cat-bi-pasta",
        name: "Classic Pastas",
        items: [
          {
            id: "bi-p1",
            name: "Spaghetti Bolognese",
            description: "Slow-braised British beef ragu with vine-ripened tomatoes and freshly grated Parmesan.",
            price: 12.95,
            image: "https://images.unsplash.com/photo-1621996346565-e3d5d628169e?auto=format&fit=crop&w=600&q=80",
            allergens: ["Gluten", "Milk"],
            isCustomizable: false,
            isAvailable: true
          }
        ]
      }
    ]
  }
];

const promoDeals = [
  {
    id: "deal-treats",
    code: "TREATS",
    title: "Feast on Favorites, Save Big!",
    subtitle: "Up to 30% Off on selected restaurants in Stoke-on-Trent",
    discountPercent: 30,
    endsInHours: 3,
    endsInMins: 14,
    badgeText: "30% OFF"
  },
  {
    id: "deal-first-order",
    code: "EATS50",
    title: "50% Off First Order",
    subtitle: "Exclusive welcome discount on Apple Eats (Capped at £15.00)",
    discountPercent: 50,
    maxDiscount: 15.00,
    isFirstOrderOnly: true,
    badgeText: "50% OFF"
  },
  {
    id: "deal-free-gift",
    code: "FREESWEET",
    title: "Free Strawberry Cheesecake",
    subtitle: "Spend £30.00 or more and get a FREE gourmet Strawberry Cheesecake injected into your order!",
    minSpend: 30.00,
    freeItemName: "Strawberry Cheesecake",
    badgeText: "FREE GIFT"
  }
];

module.exports = {
  restaurants,
  promoDeals
};
