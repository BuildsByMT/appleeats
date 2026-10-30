// Apple Eats Frontend Mock & Seed Data (Stoke-on-Trent, UK)
// Full UK Compliance: Natasha's Law (FIR 2019), BS 7666 UK Spatial Addressing, FSA FHRS Ratings

export const initialRestaurants = [
  {
    id: "rest-fish-lounge",
    name: "Fish Lounge",
    slug: "fish-lounge",
    tagline: "Finest Traditional Fish & Chips in Stoke-on-Trent",
    description: "Award-winning British seafood, sustainably sourced fresh cod, haddock, and artisan seafood platters prepared fresh to order.",
    phone: "01782 698710",
    isClientOwned: true,
    cuisineTypes: ["Seafood", "British", "Fish & Chips"],
    logoUrl: "/assets/branding/main-logo.png",
    coverImageUrl: "https://images.unsplash.com/photo-1579208030886-b937da0925dc?auto=format&fit=crop&w=1200&q=80",
    address: {
      street: "123 High Street",
      town: "Hanley",
      city: "Stoke-on-Trent",
      postcode: "ST1 1AA"
    },
    fhrsRating: 5,
    fhrsInspectionDate: "14 October 2024",
    fhrsLocalAuthority: "Stoke-on-Trent City Council",
    fhrsId: "1598421",
    fhrsUrl: "https://ratings.food.gov.uk",
    rating: 4.8,
    reviewsCount: 240,
    operatingStatus: "open",
    supportsDelivery: true,
    supportsCollection: true,
    deliverySettings: {
      minOrderDelivery: 10.00,
      deliveryFee: 1.50,
      estimatedDeliveryMins: "20–30 mins",
      estimatedCollectionMins: "15–20 mins",
      isFreeDelivery: true
    },
    categories: [
      {
        id: "cat-fl-mains",
        name: "Mains",
        items: [
          {
            id: "fl-m1",
            name: "Traditional Fish & Chips",
            description: "Freshly battered cod served with chunky chips, mushy peas, and homemade tartar sauce.",
            price: 14.95,
            image: "https://images.unsplash.com/photo-1579208030886-b937da0925dc?auto=format&fit=crop&w=600&q=80",
            allergens: ["Fish", "Cereals containing gluten"],
            mayContain: ["Milk", "Mustard"],
            foodPrepType: "made-to-order",
            isCustomizable: false,
            isAvailable: true,
            isBestSeller: true
          },
          {
            id: "fl-m2",
            name: "Pan-Seared Sea Bass",
            description: "Served with crushed new potatoes, asparagus, and a warm lemon butter sauce.",
            price: 17.50,
            image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
            allergens: ["Fish", "Milk"],
            mayContain: [],
            foodPrepType: "made-to-order",
            isCustomizable: false,
            isAvailable: true
          },
          {
            id: "fl-m3",
            name: "Garlic Butter Seafood Platter",
            description: "Grilled prawns, squid, and mussels in garlic butter with rustic artisan bread.",
            price: 21.95,
            image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
            allergens: ["Crustaceans", "Molluscs", "Milk", "Cereals containing gluten"],
            mayContain: ["Fish"],
            foodPrepType: "made-to-order",
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
            mayContain: ["Mustard"],
            foodPrepType: "made-to-order",
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
            allergens: ["Molluscs", "Cereals containing gluten", "Eggs"],
            mayContain: ["Fish"],
            foodPrepType: "made-to-order",
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
            description: "Double-cooked Maris Piper chunky chips with Cornish sea salt.",
            price: 3.50,
            image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80",
            allergens: [],
            mayContain: ["Fish", "Cereals containing gluten"],
            foodPrepType: "made-to-order",
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
    description: "Build your own custom meal bowls, gourmet Black Angus burgers, and artisan stonebaked pizzas with premium toppings.",
    phone: "01782 698710",
    isClientOwned: true,
    cuisineTypes: ["Grill", "Burgers", "Pizza", "BBQ"],
    logoUrl: "/assets/branding/main-logo.png",
    coverImageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
    address: {
      street: "45 Stafford Street",
      town: "Hanley",
      city: "Stoke-on-Trent",
      postcode: "ST1 1SA"
    },
    fhrsRating: 5,
    fhrsInspectionDate: "18 September 2024",
    fhrsLocalAuthority: "Stoke-on-Trent City Council",
    fhrsId: "1589104",
    fhrsUrl: "https://ratings.food.gov.uk",
    rating: 4.7,
    reviewsCount: 240,
    operatingStatus: "open",
    supportsDelivery: true,
    supportsCollection: true,
    deliverySettings: {
      minOrderDelivery: 10.00,
      deliveryFee: 0.99,
      estimatedDeliveryMins: "15–25 mins",
      estimatedCollectionMins: "10–15 mins",
      isFreeDelivery: false
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
            price: 5.50, // Updated to 5.50 matching specs.md physical receipt baseline (5.50 + 0.80 + 0.80 = 7.10)
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
            allergens: ["Cereals containing gluten", "Milk"],
            mayContain: ["Fish", "Soybeans"],
            foodPrepType: "made-to-order",
            isCustomizable: true,
            isAvailable: true,
            isBestSeller: true,
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
                  { id: "opt-top-tuna", name: "Tuna", priceDelta: 0.80, allergens: ["Fish"], isAvailable: true },
                  { id: "opt-top-corn", name: "Sweetcorn", priceDelta: 0.80, allergens: [], isAvailable: true },
                  { id: "opt-top-cheese", name: "Extra Cheese", priceDelta: 1.20, allergens: ["Milk"], isAvailable: true },
                  { id: "opt-top-jalapeno", name: "Jalapenos", priceDelta: 0.50, allergens: [], isAvailable: true },
                  { id: "opt-top-pepp", name: "Extra Pepperoni", priceDelta: 1.30, allergens: ["Mustard"], isAvailable: true },
                  { id: "opt-top-mush", name: "Mushrooms", priceDelta: 0.80, allergens: [], isAvailable: true }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "cat-gg-gourmet",
        name: "Gourmet Burgers & Specialties",
        items: [
          {
            id: "gg-m1",
            name: "Sylheti Naga",
            description: "Super hot spicy specialty dish: 1x 6oz Gourmet Black Angus Patty, with Peri Fries and Naga Donner Stir Fry.",
            price: 11.95,
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
            allergens: ["Cereals containing gluten", "Sesame", "Mustard"],
            mayContain: ["Soybeans"],
            foodPrepType: "made-to-order",
            isCustomizable: false,
            isAvailable: true,
            isBestSeller: true
          },
          {
            id: "gg-m2",
            name: "Mixed Loaded Fries",
            description: "Fries with cheese, meats, and signature sauces.",
            price: 11.00,
            image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80",
            allergens: ["Milk", "Mustard", "Cereals containing gluten"],
            mayContain: ["Celery"],
            foodPrepType: "made-to-order",
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
            description: "Fries topped with rich hot melted British cheddar.",
            price: 3.60,
            image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80",
            allergens: ["Milk"],
            mayContain: ["Cereals containing gluten"],
            foodPrepType: "made-to-order",
            isCustomizable: false,
            isAvailable: true
          },
          {
            id: "gg-s2",
            name: "10pcs Onion Rings",
            description: "Crispy golden beer-battered onion rings.",
            price: 3.50,
            image: "https://images.unsplash.com/photo-1639024471287-032f66ab750d?auto=format&fit=crop&w=600&q=80",
            allergens: ["Cereals containing gluten"],
            mayContain: [],
            foodPrepType: "made-to-order",
            isCustomizable: false,
            isAvailable: true
          },
          {
            id: "gg-s3",
            name: "Gailic Mayonnaise",
            description: "Creamy roasted garlic mayonnaise dip.",
            price: 1.00,
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
            allergens: ["Eggs", "Mustard"],
            mayContain: [],
            foodPrepType: "made-to-order",
            isCustomizable: false,
            isAvailable: true
          }
        ]
      },
      {
        id: "cat-gg-desserts",
        name: "Desserts (PPDS)",
        items: [
          {
            id: "gg-d1",
            name: "Free Gift Strawberry Cheesecake",
            description: "Prepacked for Direct Sale: Creamy Madagascan vanilla cheesecake with British strawberry compote on a digestive biscuit crust.",
            price: 0.00,
            image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
            allergens: ["Milk", "Cereals containing gluten"],
            mayContain: ["Tree nuts", "Eggs", "Soybeans"],
            foodPrepType: "prepacked-ppds",
            ingredients: "Full Fat Soft Cheese (MILK) (32%), Whipping Cream (MILK), Wheat Flour (CEREALS CONTAINING GLUTEN), Sugar, Strawberry Compote (12%) (Strawberries, Glucose Syrup, Pectin), Palm Oil, Rapeseed Oil, Invert Sugar Syrup.",
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
    phone: "01782 698710",
    isClientOwned: true,
    cuisineTypes: ["Fried Chicken", "Fast Food"],
    logoUrl: "/assets/branding/main-logo.png",
    coverImageUrl: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=80",
    address: {
      street: "88 Broad Street",
      town: "Hanley",
      city: "Stoke-on-Trent",
      postcode: "ST1 4EU"
    },
    fhrsRating: 5,
    fhrsInspectionDate: "22 November 2024",
    fhrsLocalAuthority: "Stoke-on-Trent City Council",
    fhrsId: "1602341",
    fhrsUrl: "https://ratings.food.gov.uk",
    rating: 4.5,
    reviewsCount: 310,
    operatingStatus: "open",
    supportsDelivery: true,
    supportsCollection: true,
    deliverySettings: {
      minOrderDelivery: 10.00,
      deliveryFee: 1.50,
      estimatedDeliveryMins: "20–30 mins",
      estimatedCollectionMins: "10–15 mins",
      isFreeDelivery: true
    },
    categories: [
      {
        id: "cat-cc-buckets",
        name: "Fried Chicken Buckets",
        items: [
          {
            id: "cc-b1",
            name: "Family Variety Bucket",
            description: "10 pieces of original recipe chicken, 4 regular fries, 2 sides, and a large drink.",
            price: 18.95,
            image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80",
            allergens: ["Cereals containing gluten", "Celery", "Mustard"],
            mayContain: ["Milk", "Eggs"],
            foodPrepType: "made-to-order",
            isCustomizable: false,
            isAvailable: true,
            isBestSeller: true
          },
          {
            id: "cc-b2",
            name: "10pc Spicy Wings Bucket",
            description: "Ten fiery, crispy chicken wings tossed in our signature Stoke spice blend.",
            price: 8.50,
            image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80",
            allergens: ["Cereals containing gluten", "Mustard"],
            mayContain: ["Celery"],
            foodPrepType: "made-to-order",
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
            allergens: ["Cereals containing gluten", "Eggs", "Mustard"],
            mayContain: ["Milk"],
            foodPrepType: "made-to-order",
            isCustomizable: false,
            isAvailable: true
          },
          {
            id: "cc-w2",
            name: "Crispy Burger Deluxe",
            description: "A premium crispy chicken breast fillet, lettuce, melted cheese, and signature mayo on a toasted brioche bun.",
            price: 6.50,
            image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
            allergens: ["Cereals containing gluten", "Milk", "Eggs", "Sesame"],
            mayContain: ["Mustard"],
            foodPrepType: "made-to-order",
            isCustomizable: false,
            isAvailable: true,
            isBestSeller: true
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
    description: "Classic Italian pastas, slow-cooked beef ragus, stonebaked pizzas, and artisanal desserts in Stoke.",
    phone: "01782 698710",
    isClientOwned: true,
    cuisineTypes: ["Italian", "Pasta", "Pizza"],
    logoUrl: "/assets/branding/main-logo.png",
    coverImageUrl: "https://images.unsplash.com/photo-1621996346565-e3d5d628169e?auto=format&fit=crop&w=1200&q=80",
    address: {
      street: "12 Piccadilly",
      town: "Hanley",
      city: "Stoke-on-Trent",
      postcode: "ST1 1DH"
    },
    fhrsRating: 5,
    fhrsInspectionDate: "05 August 2024",
    fhrsLocalAuthority: "Stoke-on-Trent City Council",
    fhrsId: "1576298",
    fhrsUrl: "https://ratings.food.gov.uk",
    rating: 4.6,
    reviewsCount: 120,
    operatingStatus: "open",
    supportsDelivery: true,
    supportsCollection: true,
    deliverySettings: {
      minOrderDelivery: 10.00,
      deliveryFee: 1.50,
      estimatedDeliveryMins: "25–35 mins",
      estimatedCollectionMins: "15–20 mins",
      isFreeDelivery: true
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
            allergens: ["Cereals containing gluten", "Milk", "Celery"],
            mayContain: ["Eggs"],
            foodPrepType: "made-to-order",
            isCustomizable: false,
            isAvailable: true
          }
        ]
      }
    ]
  }
];

export const dealsList = [
  {
    id: "deal-1",
    restaurant: "Fish Lounge",
    restaurantId: "rest-fish-lounge",
    category: "Seafood",
    offer: "Spend £30, get a FREE Strawberry Cheesecake!",
    code: "FREESWEET",
    tag: "FREE GIFT",
    delivery: "20–30 mins • Free delivery",
    rating: "4.8 (120+)"
  },
  {
    id: "deal-2",
    restaurant: "Go Grill",
    restaurantId: "rest-go-grill",
    category: "Fast Food",
    offer: "30% OFF on all burgers & meals",
    code: "GOGRILL30",
    tag: "30% OFF",
    delivery: "15–25 mins • £0.99 delivery",
    rating: "4.7 (240+)"
  },
  {
    id: "deal-3",
    restaurant: "Crispy Chicken",
    restaurantId: "rest-crispy-chicken",
    category: "Fast Food",
    offer: "Buy 1 Get 1 Free on 10pc Spicy Wings Bucket",
    code: "CRISPYBOGO",
    tag: "BOGO DEAL",
    delivery: "20–30 mins • Free delivery",
    rating: "4.5 (310+)"
  },
  {
    id: "deal-4",
    restaurant: "Bella Italia",
    restaurantId: "rest-bella-italia",
    category: "Italian",
    offer: "20% OFF all artisan pasta dishes",
    code: "ITALIA20",
    tag: "20% OFF",
    delivery: "25–35 mins • Free delivery",
    rating: "4.6 (120+)"
  }
];
