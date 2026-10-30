import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import CategoryCarousel from './components/CategoryCarousel';
import RestaurantCard from './components/RestaurantCard';
import RestaurantDetail from './components/RestaurantDetail';
import CustomizationModal from './components/CustomizationModal';
import SpecialInstructionsModal from './components/SpecialInstructionsModal';
import CheckoutStepper from './components/CheckoutStepper';
import ThermalReceiptModal from './components/ThermalReceiptModal';
import DealsHub from './components/DealsHub';
import KitchenDashboard from './components/KitchenDashboard';
import OnboardingWizard from './components/OnboardingWizard';
import LockedAdminConsole from './components/LockedAdminConsole';
import AuthModal from './components/AuthModal';
import AuthScreen from './components/AuthScreen';
import LoyaltyTracker from './components/LoyaltyTracker';
import MultiStoreConflictModal from './components/MultiStoreConflictModal';
import CartDrawer from './components/CartDrawer';
import AddressModal from './components/AddressModal';
import { initialRestaurants } from './data/mockData';
import { calculateOrderFinancials, formatGBP } from './utils/currency';
import confetti from 'canvas-confetti';

// Default initial cart matching the Owen Hume Stoke-on-Trent live kitchen receipt
const INITIAL_CART = [
  {
    id: "gg-s3",
    restaurantId: "rest-go-grill",
    name: "Gailic Mayonnaise",
    quantity: 1,
    price: 1.00,
    selectedOptions: []
  },
  {
    id: "gg-p1",
    restaurantId: "rest-go-grill",
    name: "7inch The Classic Pizza",
    quantity: 1,
    price: 5.50,
    customizedPrice: 7.10,
    selectedOptions: [
      { name: "Tuna", priceDelta: 0.80 },
      { name: "Sweetcorn", priceDelta: 0.80 }
    ]
  },
  {
    id: "gg-s1",
    restaurantId: "rest-go-grill",
    name: "Cheesy Fries",
    quantity: 1,
    price: 3.60,
    selectedOptions: []
  },
  {
    id: "gg-s2",
    restaurantId: "rest-go-grill",
    name: "10pcs Onion Rings",
    quantity: 1,
    price: 3.50,
    selectedOptions: []
  },
  {
    id: "gg-m1",
    restaurantId: "rest-go-grill",
    name: "Sylheti Naga",
    quantity: 1,
    price: 11.95,
    selectedOptions: [
      { name: "1x 6oz Gourmet Black Angus Patty, With Peri Fries, Naga Donner Stir Fry", priceDelta: 0.00 }
    ]
  },
  {
    id: "gg-m2",
    restaurantId: "rest-go-grill",
    name: "Mixed Loaded Fries",
    quantity: 1,
    price: 11.00,
    selectedOptions: []
  }
];

export default function App() {
  // Navigation & Page State
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'browse' | 'offers' | 'takeaway_detail' | 'checkout' | 'kitchen'
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  
  // Geolocation & Fulfillment
  const [fulfillmentMode, setFulfillmentMode] = useState('delivery'); // 'delivery' | 'collection'
  const [selectedPostcode, setSelectedPostcode] = useState('ST1');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart State with LocalStorage persistence
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ae_cart_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback to initial
    }
    return INITIAL_CART;
  });

  const [specialNote, setSpecialNote] = useState(() => {
    try {
      const saved = localStorage.getItem('ae_special_note_v1');
      if (saved !== null) return saved;
    } catch (e) {
      // fallback
    }
    return "No Jalapeno on the loaded fries please";
  });

  // Sync cart & notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ae_cart_v1', JSON.stringify(cartItems));
    } catch (e) {
      // ignore
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('ae_special_note_v1', specialNote);
    } catch (e) {
      // ignore
    }
  }, [specialNote]);

  // Modals & Multi-Store Conflict State
  const [customizingItem, setCustomizingItem] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptOrderData, setReceiptOrderData] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAdminConsole, setShowAdminConsole] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [conflictPendingItem, setConflictPendingItem] = useState(null);

  // New Cart Drawer & Bounce State
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);

  // Foodpanda-inspired Dynamic Address State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [onboardingNotification, setOnboardingNotification] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    name: "John D.",
    initials: "JD",
    email: "john@example.com"
  });
  const [userAddress, setUserAddress] = useState(() => {
    try {
      const saved = localStorage.getItem('ae_user_address_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      label: "Home",
      name: "Owen Hume",
      phone: "07951 280623",
      line1: "55 Stanley Road",
      city: "Stoke-On-Trent",
      postcode: "ST4 7PW",
      notes: "No Jalapeno on the loaded fries please"
    };
  });

  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('ae_saved_addresses_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        label: "Home",
        name: "Owen Hume",
        phone: "07951 280623",
        line1: "55 Stanley Road",
        city: "Stoke-On-Trent",
        postcode: "ST4 7PW",
        notes: "No Jalapeno on the loaded fries please"
      },
      {
        label: "Work",
        name: "Owen Hume",
        phone: "07951 280623",
        line1: "College Road, University Quarter",
        city: "Stoke-on-Trent",
        postcode: "ST4 2DE",
        notes: "Meet outside Science Centre reception"
      }
    ];
  });

  // Save address state
  useEffect(() => {
    try {
      localStorage.setItem('ae_user_address_v1', JSON.stringify(userAddress));
    } catch (e) {}
  }, [userAddress]);

  useEffect(() => {
    try {
      localStorage.setItem('ae_saved_addresses_v1', JSON.stringify(savedAddresses));
    } catch (e) {}
  }, [savedAddresses]);

  // Chrome Browser Back and Forward Button (History & Hash Routing Engine)
  const navigate = (tab, restaurant = null, push = true) => {
    setActiveTab(tab);
    if (restaurant) setSelectedRestaurant(restaurant);

    // Close overlays
    setShowCartDrawer(false);
    setShowAddressModal(false);
    setCustomizingItem(null);

    let targetHash = '#/';
    if (tab === 'browse') targetHash = '#/browse';
    else if (tab === 'offers') targetHash = '#/offers';
    else if (tab === 'kitchen') targetHash = '#/kitchen';
    else if (tab === 'checkout') targetHash = '#/checkout';
    else if (tab === 'auth' || tab === 'login') targetHash = '#/login';
    else if (tab === 'signup') targetHash = '#/signup';
    else if (tab === 'takeaway_detail' && restaurant) targetHash = `#/restaurant/${restaurant.id}`;

    if (push && window.location.hash !== targetHash) {
      window.history.pushState({ tab, restaurantId: restaurant?.id }, '', targetHash);
    }
  };

  // Initialize view from hash on initial mount only
  useEffect(() => {
    const hash = window.location.hash || '#/';
    if (hash.startsWith('#/restaurant/')) {
      const restId = hash.replace('#/restaurant/', '');
      const found = initialRestaurants.find(r => r.id === restId) || initialRestaurants[0];
      setSelectedRestaurant(found);
      setActiveTab('takeaway_detail');
    } else if (hash === '#/checkout') {
      setActiveTab('checkout');
    } else if (hash === '#/offers') {
      setActiveTab('offers');
    } else if (hash === '#/browse') {
      setActiveTab('browse');
    } else if (hash === '#/kitchen') {
      setActiveTab('kitchen');
    } else if (hash === '#/login' || hash === '#/auth') {
      setActiveTab('auth');
    } else if (hash === '#/signup') {
      setActiveTab('signup');
    }
  }, []);

  // Browser Back and Forward Button navigation (popstate event listener only)
  useEffect(() => {
    const handlePopState = () => {
      // If an overlay or drawer is open when user clicks browser back, close the overlay
      if (showCartDrawer) {
        setShowCartDrawer(false);
        return;
      }
      if (showAddressModal) {
        setShowAddressModal(false);
        return;
      }
      if (customizingItem) {
        setCustomizingItem(null);
        return;
      }
      if (showNoteModal) {
        setShowNoteModal(false);
        return;
      }
      if (showReceiptModal) {
        setShowReceiptModal(false);
        return;
      }
      if (showAuthModal) {
        setShowAuthModal(false);
        return;
      }
      if (showOnboarding) {
        setShowOnboarding(false);
        return;
      }
      if (showAdminConsole) {
        setShowAdminConsole(false);
        return;
      }

      // Hash-based route restoration
      const hash = window.location.hash || '#/';
      if (hash.startsWith('#/restaurant/')) {
        const restId = hash.replace('#/restaurant/', '');
        const found = initialRestaurants.find(r => r.id === restId) || initialRestaurants[0];
        setSelectedRestaurant(found);
        setActiveTab('takeaway_detail');
      } else if (hash === '#/checkout') {
        setActiveTab('checkout');
      } else if (hash === '#/offers') {
        setActiveTab('offers');
      } else if (hash === '#/browse') {
        setActiveTab('browse');
      } else if (hash === '#/kitchen') {
        setActiveTab('kitchen');
      } else if (hash === '#/login' || hash === '#/auth') {
        setActiveTab('auth');
      } else if (hash === '#/signup') {
        setActiveTab('signup');
      } else {
        setActiveTab('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [showCartDrawer, showAddressModal, customizingItem, showNoteModal, showReceiptModal, showAuthModal, showOnboarding, showAdminConsole]);

  // Administrative Onboarding applications queue
  const [adminApplications, setAdminApplications] = useState([
    {
      id: "app-stk-101",
      name: "Potteries Balti House",
      cuisine: "Indian & Balti",
      address: "24 Snow Hill, Shelton, Stoke-on-Trent, ST1 4LY",
      phone: "01782 283921",
      status: "pending",
      fhrs: 5
    }
  ]);

  // Kitchen Orders Live State
  const [kitchenOrders, setKitchenOrders] = useState([
    {
      id: "ord_stk_001",
      orderNumber: "#1 Delivery",
      orderSequence: 1,
      customerName: "Owen Hume",
      customerPhone: "07951 280623",
      address: {
        line1: "55 Stanley Road",
        city: "Stoke-On-Trent",
        postcode: "ST4 7PW"
      },
      fulfillmentType: "delivery",
      dueTime: "06:53 PM",
      specialInstructions: "No Jalapeno on the loaded fries please",
      items: [
        { name: "Gailic Mayonnaise", quantity: 1, price: 1.00, selectedOptions: [] },
        {
          name: "7inch The Classic Pizza",
          quantity: 1,
          price: 5.50,
          customizedPrice: 7.10,
          selectedOptions: [
            { name: "Tuna", priceDelta: 0.80 },
            { name: "Sweetcorn", priceDelta: 0.80 }
          ]
        },
        { name: "Cheesy Fries", quantity: 1, price: 3.60, selectedOptions: [] },
        { name: "10pcs Onion Rings", quantity: 1, price: 3.50, selectedOptions: [] },
        {
          name: "Sylheti Naga",
          quantity: 1,
          price: 11.95,
          selectedOptions: [
            { name: "1x 6oz Gourmet Black Angus Patty, With Peri Fries, Naga Donner Stir Fry", priceDelta: 0.00 }
          ]
        },
        { name: "Mixed Loaded Fries", quantity: 1, price: 11.00, selectedOptions: [] }
      ],
      freeGift: "Free Gift Strawberry Cheesecake",
      subtotal: 38.15,
      deliveryCharge: 0.99,
      serviceCharge: 0.50,
      total: 39.64,
      paymentMethod: "card",
      orderStatus: "accepted"
    }
  ]);

  // Stealth Admin hotkey listener: Ctrl+Shift+A or Cmd+Shift+A
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setShowAdminConsole(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Also check query param `?admin=gate` or `?admin=true`
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'gate' || urlParams.get('admin') === 'true') {
      setShowAdminConsole(true);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Multi-store conflict validation helper
  const checkRestaurantConflict = (incomingItem) => {
    const incomingRestId = incomingItem.restaurantId || selectedRestaurant?.id || 'rest-go-grill';
    if (cartItems.length > 0) {
      const existingRestId = cartItems[0].restaurantId || 'rest-go-grill';
      if (existingRestId !== incomingRestId) {
        setConflictPendingItem({
          item: incomingItem,
          existingRestId,
          incomingRestId
        });
        return true;
      }
    }
    return false;
  };

  // Cart operations
  const triggerCartBounce = () => {
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 450);
  };

  const handleAddToCart = (item) => {
    const fullItem = {
      ...item,
      restaurantId: item.restaurantId || selectedRestaurant?.id || 'rest-go-grill'
    };

    if (checkRestaurantConflict(fullItem)) return false;

    setCartItems(prev => {
      const existing = prev.find(i => i.id === fullItem.id && (!i.selectedOptions || i.selectedOptions.length === 0));
      if (existing) {
        return prev.map(i => i.id === fullItem.id && (!i.selectedOptions || i.selectedOptions.length === 0) 
          ? { ...i, quantity: i.quantity + 1 } 
          : i
        );
      }
      return [...prev, { ...fullItem, quantity: 1 }];
    });
    triggerCartBounce();
    setShowCartDrawer(true);
    return true;
  };

  const handleCompleteCustomization = (customizedItem) => {
    const fullItem = {
      ...customizedItem,
      restaurantId: customizedItem.restaurantId || selectedRestaurant?.id || 'rest-go-grill'
    };

    if (checkRestaurantConflict(fullItem)) return;

    setCartItems(prev => [...prev, { ...fullItem, quantity: customizedItem.quantity || 1 }]);
    setCustomizingItem(null);
    triggerCartBounce();
    setShowCartDrawer(true);
  };

  const handleConfirmClearBasket = () => {
    if (conflictPendingItem) {
      setCartItems([{ ...conflictPendingItem.item, quantity: conflictPendingItem.item.quantity || 1 }]);
      setConflictPendingItem(null);
      if (customizingItem) setCustomizingItem(null);
      triggerCartBounce();
    }
  };

  const handleUpdateQty = (index, delta) => {
    setCartItems(prev => {
      const copy = [...prev];
      copy[index].quantity += delta;
      if (copy[index].quantity <= 0) {
        copy.splice(index, 1);
      }
      return copy;
    });
  };

  const handleRemoveCartItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleOrderSuccess = (orderData) => {
    const newKitchenOrder = {
      ...orderData,
      id: `ord_${Date.now()}`,
      orderStatus: 'placed',
      dueTime: new Date(Date.now() + 30 * 60000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
    setKitchenOrders(prev => [newKitchenOrder, ...prev]);
    setReceiptOrderData(newKitchenOrder);
    setCartItems([]);
    try {
      localStorage.removeItem('ae_cart_v1');
    } catch (e) {
      // ignore
    }
    setShowReceiptModal(true);
    setActiveTab('home');
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setKitchenOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
  };

  const handleApproveApplication = (appId) => {
    setAdminApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'approved' } : a));
  };

  const handleRejectApplication = (appId) => {
    setAdminApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'rejected' } : a));
  };

  // Filter restaurants
  const filteredRestaurants = initialRestaurants.filter(r => {
    if (selectedCategory && !r.cuisineTypes.some(c => c.toLowerCase().includes(selectedCategory.toLowerCase()))) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchCuisine = r.cuisineTypes.some(c => c.toLowerCase().includes(q));
      if (!matchName && !matchCuisine) return false;
    }
    return true;
  });

  const cartTotalAmount = cartItems.reduce((acc, item) => {
    return acc + (item.customizedPrice || item.price) * item.quantity;
  }, 0);

  // Dedicated Full-Screen Authentication Experience (Login & Sign-Up Screen)
  if (activeTab === 'auth' || activeTab === 'signup') {
    return (
      <AuthScreen
        initialMode={activeTab === 'signup' ? 'signup' : 'signin'}
        onBack={() => navigate('home')}
        onAuthSuccess={(u) => {
          const initials = (u.name || "Customer")
            .split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();

          setCurrentUser({
            name: u.name || "Owen Hume",
            initials: initials || "OH",
            email: u.email || "customer@example.com"
          });
          setOnboardingNotification(`Welcome back to Apple Eats, ${u.name || 'Owen'}! Exclusive Stoke vouchers applied.`);
          navigate('home');
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
          setTimeout(() => setOnboardingNotification(null), 5000);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F2]">
      {/* Top Header */}
      <Header
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        onOpenCart={() => setShowCartDrawer(true)}
        onOpenAuth={() => navigate('auth')}
        activeTab={activeTab}
        setActiveTab={(t) => navigate(t)}
        fulfillmentMode={fulfillmentMode}
        setFulfillmentMode={setFulfillmentMode}
        selectedPostcode={userAddress?.postcode || selectedPostcode}
        setSelectedPostcode={setSelectedPostcode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAdmin={() => setShowAdminConsole(true)}
        onOpenKitchen={() => navigate('kitchen')}
        currentAddress={userAddress}
        onOpenAddressModal={() => setShowAddressModal(true)}
        cartBounce={cartBounce}
        currentUser={currentUser}
      />

      {/* Main Content Area - Full width on Chrome up to 1840px */}
      <main className="flex-1 w-full max-w-[1720px] 2xl:max-w-[1840px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 transition-all">
        {/* VIEW 1: HOME DISCOVERY */}
        {activeTab === 'home' && (
          <div className="animate-page-view">
            <HeroBanner 
              onSelectDeal={() => navigate('offers')}
              onExploreAll={() => navigate('browse')}
            />

            {/* Category Filter Pills */}
            <CategoryCarousel
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Section: Popular Takeaways in Stoke-on-Trent */}
            <div className="my-6 sm:my-8">
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                    Popular Takeaways in Stoke-on-Trent
                  </h2>
                  <p className="text-xs text-neutral-600 font-medium mt-0.5">
                    Fast {fulfillmentMode === 'delivery' ? 'delivery (£0.99)' : 'collection (pickup)'} from your local favorite kitchens across ST1–ST12
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowOnboarding(true)}
                  className="px-4 py-2 rounded-full border border-brand-700 text-brand-700 hover:bg-brand-50 text-xs font-bold transition-colors shrink-0 min-h-[40px]"
                >
                  Register Takeaway
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 gap-5 sm:gap-6 lg:gap-8">
                {filteredRestaurants.map(r => (
                  <RestaurantCard
                    key={r.id}
                    restaurant={r}
                    onSelect={(selected) => {
                      navigate('takeaway_detail', selected);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Customer 5-Order Loyalty Tracker Banner */}
            <LoyaltyTracker completedOrders={3} />
          </div>
        )}

        {/* VIEW 2: BROWSE / SEARCH */}
        {activeTab === 'browse' && (
          <div className="animate-page-view py-8">
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-2">
              Browse All Stoke-on-Trent Takeaways
            </h1>
            <p className="text-xs text-neutral-600 mb-6 font-medium">
              Filter by cuisine, ratings, delivery speed, and Natasha's Law allergen safety across ST1–ST12
            </p>

            <CategoryCarousel
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 gap-5 sm:gap-6 lg:gap-8">
              {filteredRestaurants.map(r => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  onSelect={(selected) => {
                    navigate('takeaway_detail', selected);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: OFFERS & DEALS HUB (Screenshot 9) */}
        {activeTab === 'offers' && (
          <div className="animate-page-view">
            <DealsHub
              onSelectRestaurant={(r) => {
                navigate('takeaway_detail', r);
              }}
              onApplyCoupon={(code) => {
                navigate('checkout');
              }}
            />
          </div>
        )}

        {/* VIEW 4: TAKEAWAY DETAIL & MENU (Screenshots 4 & 5) */}
        {activeTab === 'takeaway_detail' && selectedRestaurant && (
          <div className="animate-page-view">
            <RestaurantDetail
              restaurant={selectedRestaurant}
              onBack={() => navigate('home')}
              onAddItem={handleAddToCart}
              onCustomizeItem={(item) => setCustomizingItem(item)}
              cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
              cartTotal={cartTotalAmount}
              onOpenCart={() => setShowCartDrawer(true)}
            />
          </div>
        )}

        {/* VIEW 5: CHECKOUT STEPPER (Screenshots 8 & 10) */}
        {activeTab === 'checkout' && (
          <div className="animate-page-view">
            <CheckoutStepper
              cartItems={cartItems}
              onUpdateQty={handleUpdateQty}
              onBackToMenu={() => navigate('home')}
              onOrderSuccess={handleOrderSuccess}
              specialNote={specialNote}
              onOpenNoteModal={() => setShowNoteModal(true)}
              fulfillmentMode={fulfillmentMode}
              setFulfillmentMode={setFulfillmentMode}
              onOpenAddressModal={() => setShowAddressModal(true)}
              userAddress={userAddress}
            />
          </div>
        )}

        {/* VIEW 6: KITCHEN OMS TABLET DASHBOARD */}
        {activeTab === 'kitchen' && (
          <div className="animate-page-view">
            <KitchenDashboard
              orders={kitchenOrders}
              onUpdateStatus={handleUpdateOrderStatus}
              onOpenReceipt={(order) => {
                setReceiptOrderData(order);
                setShowReceiptModal(true);
              }}
              onBack={() => navigate('home')}
            />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-neutral-100 py-10 mt-16 text-center text-xs text-neutral-600">
        <div className="w-full max-w-[1720px] 2xl:max-w-[1840px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/branding/main-logo.png" 
              alt="Apple Eats" 
              className="h-7 w-auto object-contain" 
            />
            <span className="text-neutral-400">•</span>
            <span>Stoke-on-Trent, Staffordshire (ST1–ST12)</span>
          </div>
          <div className="flex items-center gap-4 font-semibold text-neutral-700">
            <button type="button" onClick={() => setShowOnboarding(true)} className="hover:text-brand-700 min-h-[32px] transition-transform active:scale-95 cursor-pointer">
              Partner With Us
            </button>
            <button type="button" onClick={() => navigate('kitchen')} className="hover:text-brand-700 min-h-[32px] transition-transform active:scale-95 cursor-pointer">
              Kitchen Portal
            </button>
          </div>
          <div className="text-neutral-500">
            © 2026 Apple Eats Marketplace Ltd. All rights reserved.
          </div>
        </div>
      </footer>

      {/* MODALS & DRAWERS */}
      {/* 1. Animated Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={showCartDrawer}
        onClose={() => setShowCartDrawer(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQty}
        onRemoveItem={handleRemoveCartItem}
        onOpenCheckout={() => navigate('checkout')}
        specialNote={specialNote}
        onOpenNoteModal={() => setShowNoteModal(true)}
        financials={{ subtotal: cartTotalAmount }}
      />

      {/* 2. Foodpanda-inspired Dynamic Address Modal */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        currentAddress={userAddress}
        onSelectAddress={(addr) => {
          setUserAddress(addr);
          if (addr.postcode) setSelectedPostcode(addr.postcode);
        }}
        savedAddresses={savedAddresses}
        onSaveNewAddress={(newAddr) => {
          setSavedAddresses(prev => [newAddr, ...prev]);
          setUserAddress(newAddr);
          if (newAddr.postcode) setSelectedPostcode(newAddr.postcode);
        }}
      />

      {/* 3. GoGrill Meal Customization Engine Modal */}
      {customizingItem && (
        <CustomizationModal
          item={customizingItem}
          onClose={() => setCustomizingItem(null)}
          onComplete={handleCompleteCustomization}
        />
      )}

      {/* 4. Special Instructions Modal */}
      {showNoteModal && (
        <SpecialInstructionsModal
          initialNote={specialNote}
          onClose={() => setShowNoteModal(false)}
          onSave={(note) => {
            setSpecialNote(note);
            setShowNoteModal(false);
          }}
        />
      )}

      {/* 5. Real 80mm Kitchen Thermal Receipt Slip Modal */}
      {showReceiptModal && (
        <ThermalReceiptModal
          order={receiptOrderData || kitchenOrders[0]}
          onClose={() => setShowReceiptModal(false)}
        />
      )}

      {/* 6. Takeaway Self-Registration Wizard */}
      {showOnboarding && (
        <OnboardingWizard
          onClose={() => setShowOnboarding(false)}
          onSubmitSuccess={(appData) => {
            setAdminApplications(prev => [appData, ...prev]);
            setShowOnboarding(false);
            setOnboardingNotification(`Application for ${appData.name} received! Placed in verification queue.`);
            try {
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            } catch (e) {}
            setTimeout(() => setOnboardingNotification(null), 6000);
          }}
        />
      )}

      {/* Onboarding Success Animated Toast Banner */}
      {onboardingNotification && (
        <div 
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-neutral-700 flex items-center gap-3.5 animate-in slide-in-from-bottom duration-300 max-w-md"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black shrink-0 text-sm">
            ✓
          </div>
          <div className="flex-1">
            <div className="font-black text-xs text-emerald-400 uppercase tracking-wider">
              Takeaway Registered!
            </div>
            <div className="text-xs text-neutral-200 font-medium mt-0.5">
              {onboardingNotification}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOnboardingNotification(null)}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* 7. Stealth Locked Admin Console */}
      {showAdminConsole && (
        <LockedAdminConsole
          onClose={() => setShowAdminConsole(false)}
          applications={adminApplications}
          onApproveApplication={handleApproveApplication}
          onRejectApplication={handleRejectApplication}
        />
      )}

      {/* 8. Customer Authentication Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(u) => {
            const initials = (u.name || "Customer")
              .split(' ')
              .map(n => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase();

            setCurrentUser({
              name: u.name || "Owen Hume",
              initials: initials || "OH",
              email: u.email || "customer@example.com"
            });
            setOnboardingNotification(`Welcome back to Apple Eats, ${u.name || 'Owen'}! Exclusive Stoke vouchers applied.`);
            setShowAuthModal(false);
            confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
            setTimeout(() => setOnboardingNotification(null), 5000);
          }}
        />
      )}

      {/* 9. Multi-Store Basket Collision Modal */}
      {conflictPendingItem && (
        <MultiStoreConflictModal
          currentRestaurantName={
            initialRestaurants.find(r => r.id === conflictPendingItem.existingRestId)?.name || "Current Takeaway"
          }
          newRestaurantName={
            initialRestaurants.find(r => r.id === conflictPendingItem.incomingRestId)?.name || "New Takeaway"
          }
          onConfirmClear={handleConfirmClearBasket}
          onCancel={() => setConflictPendingItem(null)}
        />
      )}
    </div>
  );
}
