// Mock Data for WTF Admin Panel
// This file contains all mock data for development
// Can be easily replaced with API calls later

export const mockOccasions = [
  { id: 1, title: 'Birthday', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400', active: true },
  { id: 2, title: 'Wedding', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400', active: true },
  { id: 3, title: 'Anniversary', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400', active: true },
  { id: 4, title: 'Corporate Event', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400', active: true },
  { id: 5, title: 'Baby Shower', image: 'https://images.unsplash.com/photo-1515869210328-d0f62abe0bbd?w=400', active: true },
  { id: 6, title: 'Engagement', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400', active: true },
  { id: 7, title: 'Retirement Party', image: 'https://images.unsplash.com/photo-1527589820976-7b4a323b99b3?w=400', active: false },
  { id: 8, title: 'Festival Celebration', image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?w=400', active: true },
  { id: 9, title: 'Graduation Party', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400', active: true },
  { id: 10, title: 'Housewarming', image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=400', active: true }
];

export const mockServices = [
  { id: 1, title: 'Buffet Service', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' },
  { id: 2, title: 'Full Service Catering', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400' },
  { id: 3, title: 'Cocktail Service', image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400' },
  { id: 4, title: 'Plated Service', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400' },
  { id: 5, title: 'Family Style', image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400' },
  { id: 6, title: 'Live Station', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400' }
];

export const mockCategories = [
  { id: 1, title: 'Buffet Only', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400' },
  { id: 2, title: 'Live Service', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400' },
  { id: 3, title: 'Delivery Only', image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400' },
  { id: 4, title: 'Delivery + Setup', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400' },
  { id: 5, title: 'Premium Package', image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400' },
  { id: 6, title: 'Budget Friendly', image: 'https://images.unsplash.com/photo-1606787365722-4b0b3ab1e9ca?w=400' },
  { id: 7, title: 'Corporate Package', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400' },
  { id: 8, title: 'Wedding Special', image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400' }
];


export const mockMenuItems = [
  // Starters
  { id: 1, name: 'Paneer Tikka', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', type: 'Veg', price: 120, category: 1, active: true, people: 20, portionSize: '120g' },
  { id: 2, name: 'Hara Bhara Kebab', image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400', type: 'Veg', price: 100, category: 1, active: true, people: 20, portionSize: '100g' },
  { id: 3, name: 'Dahi Ke Kebab', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', type: 'Veg', price: 110, category: 1, active: true, people: 20, portionSize: '110g' },
  { id: 4, name: 'Corn Cheese Balls', image: 'https://images.unsplash.com/photo-1562158147-f7da04385684?w=400', type: 'Veg', price: 95, category: 1, active: true, people: 20, portionSize: '100g' },
  { id: 5, name: 'Tandoori Chicken', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400', type: 'Non-Veg', price: 180, category: 1, active: true, people: 20, portionSize: '150g' },
  { id: 6, name: 'Fish Tikka', image: 'https://images.unsplash.com/photo-1580959375944-0b0d7682d93b?w=400', type: 'Non-Veg', price: 220, category: 1, active: true, people: 20, portionSize: '140g' },
  { id: 7, name: 'Mutton Seekh Kebab', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400', type: 'Non-Veg', price: 240, category: 1, active: true, people: 20, portionSize: '130g' },
  { id: 8, name: 'Spring Rolls', image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', type: 'Veg', price: 90, category: 1, active: true, people: 20, portionSize: '6 pcs' },

  // Main Course
  { id: 9, name: 'Dal Makhani', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', type: 'Veg', price: 140, category: 2, active: true, people: 20, portionSize: '200g' },
  { id: 10, name: 'Paneer Butter Masala', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', type: 'Veg', price: 180, category: 2, active: true, people: 20, portionSize: '190g' },
  { id: 11, name: 'Mix Veg Sabzi', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', type: 'Veg', price: 130, category: 2, active: true, people: 20, portionSize: '180g' },
  { id: 12, name: 'Malai Kofta', image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400', type: 'Veg', price: 170, category: 2, active: true, people: 20, portionSize: '185g' },
  { id: 13, name: 'Kadhai Paneer', image: 'https://images.unsplash.com/photo-1645177628172-a94c997d77a2?w=400', type: 'Veg', price: 175, category: 2, active: true, people: 20, portionSize: '190g' },
  { id: 14, name: 'Butter Chicken', image: 'https://images.unsplash.com/photo-1603729362753-f8162ac1c6c9?w=400', type: 'Non-Veg', price: 230, category: 2, active: true, people: 20, portionSize: '200g' },
  { id: 15, name: 'Chicken Tikka Masala', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', type: 'Non-Veg', price: 220, category: 2, active: true, people: 20, portionSize: '200g' },
  { id: 16, name: 'Mutton Rogan Josh', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400', type: 'Non-Veg', price: 280, category: 2, active: true, people: 20, portionSize: '190g' },
  { id: 17, name: 'Fish Curry', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54be6b94?w=400', type: 'Non-Veg', price: 260, category: 2, active: true, people: 20, portionSize: '195g' },

  // Bread, Rice & Noodles
  { id: 18, name: 'Butter Naan', image: 'https://images.unsplash.com/photo-1619888308411-f0cce7d6e5e0?w=400', type: 'Veg', price: 30, category: 3, active: true, people: 20, portionSize: '1 pc' },
  { id: 19, name: 'Garlic Naan', image: 'https://images.unsplash.com/photo-1628344537564-7e18b80295c1?w=400', type: 'Veg', price: 40, category: 3, active: true, people: 20, portionSize: '1 pc' },
  { id: 20, name: 'Laccha Paratha', image: 'https://images.unsplash.com/photo-1630409346312-c9aa749b8001?w=400', type: 'Veg', price: 35, category: 3, active: true, people: 20, portionSize: '1 pc' },
  { id: 21, name: 'Jeera Rice', image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400', type: 'Veg', price: 80, category: 3, active: true, people: 20, portionSize: '200g' },
  { id: 22, name: 'Veg Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', type: 'Veg', price: 160, category: 3, active: true, people: 20, portionSize: '250g' },
  { id: 23, name: 'Chicken Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', type: 'Non-Veg', price: 200, category: 3, active: true, people: 20, portionSize: '260g' },
  { id: 24, name: 'Veg Fried Rice', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', type: 'Veg', price: 120, category: 3, active: true, people: 20, portionSize: '220g' },
  { id: 25, name: 'Hakka Noodles', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', type: 'Veg', price: 130, category: 3, active: true, people: 20, portionSize: '230g' },

  // Desserts
  { id: 26, name: 'Gulab Jamun', image: 'https://images.unsplash.com/photo-1571935944326-2ec0dcc7c1d0?w=400', type: 'Veg', price: 60, category: 4, active: true, people: 20, portionSize: '2 pcs' },
  { id: 27, name: 'Rasmalai', image: 'https://images.unsplash.com/photo-1627308595171-d1b5d67129c4?w=400', type: 'Veg', price: 80, category: 4, active: true, people: 20, portionSize: '2 pcs' },
  { id: 28, name: 'Gajar Halwa', image: 'https://images.unsplash.com/photo-1606312618829-e7ae29e10e7d?w=400', type: 'Veg', price: 70, category: 4, active: true, people: 20, portionSize: '100g' },
  { id: 29, name: 'Moong Dal Halwa', image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7b29?w=400', type: 'Veg', price: 90, category: 4, active: true, people: 20, portionSize: '110g' },
  { id: 30, name: 'Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', type: 'Veg', price: 50, category: 4, active: true, people: 20, portionSize: '100g' },
  { id: 31, name: 'Fruit Custard', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', type: 'Veg', price: 65, category: 4, active: true, people: 20, portionSize: '120g' },

  // Live Services
  { id: 32, name: 'Live Pasta Counter', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', type: 'Veg', price: 250, category: 5, active: true, people: 50, portionSize: 'Per counter' },
  { id: 33, name: 'Live Dosa Counter', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400', type: 'Veg', price: 200, category: 5, active: true, people: 50, portionSize: 'Per counter' },
  { id: 34, name: 'Live Chaat Counter', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400', type: 'Veg', price: 220, category: 5, active: true, people: 50, portionSize: 'Per counter' },
  { id: 35, name: 'Live BBQ Counter', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400', type: 'Non-Veg', price: 350, category: 5, active: true, people: 50, portionSize: 'Per counter' }
];

export const mockOrders = [
  {
    id: 1021,
    customer: { name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh@example.com', address: '123, MG Road, Bangalore - 560001' },
    eventDate: '2026-02-15',
    occasion: 'Birthday',
    service: 'Buffet Service',
    guests: 25,
    status: 'Pending',
    orderDate: '2026-01-20',
    items: [
      { id: 1, quantity: 25 },
      { id: 2, quantity: 25 },
      { id: 9, quantity: 25 },
      { id: 10, quantity: 25 },
      { id: 22, quantity: 25 },
      { id: 27, quantity: 25 }
    ],
    subtotal: 16250,
    serviceCharges: 1625,
    gst: 1418.75,
    total: 18500
  },
  {
    id: 1022,
    customer: { name: 'Priya Sharma', phone: '+91 98123 45678', email: 'priya@example.com', address: '456, Residency Road, Mumbai - 400001' },
    eventDate: '2026-02-20',
    occasion: 'Wedding',
    service: 'Full Service Catering',
    guests: 150,
    status: 'Confirmed',
    orderDate: '2026-01-22',
    items: [
      { id: 1, quantity: 150 },
      { id: 3, quantity: 150 },
      { id: 5, quantity: 150 },
      { id: 9, quantity: 150 },
      { id: 11, quantity: 150 },
      { id: 14, quantity: 150 },
      { id: 19, quantity: 300 },
      { id: 23, quantity: 150 },
      { id: 24, quantity: 150 },
      { id: 27, quantity: 150 },
      { id: 28, quantity: 150 },
      { id: 33, quantity: 3 }
    ],
    subtotal: 285000,
    serviceCharges: 28500,
    gst: 24837.50,
    total: 325000
  },
  {
    id: 1023,
    customer: { name: 'Amit Patel', phone: '+91 99887 76655', email: 'amit@example.com', address: '789, Park Street, Delhi - 110001' },
    eventDate: '2026-02-10',
    occasion: 'Corporate Event',
    service: 'Plated Service',
    guests: 80,
    status: 'In Preparation',
    orderDate: '2026-01-25',
    items: [
      { id: 1, quantity: 80 },
      { id: 4, quantity: 80 },
      { id: 11, quantity: 80 },
      { id: 14, quantity: 80 },
      { id: 22, quantity: 80 },
      { id: 29, quantity: 80 }
    ],
    subtotal: 64000,
    serviceCharges: 6400,
    gst: 5564,
    total: 72800
  },
  {
    id: 1024,
    customer: { name: 'Sneha Reddy', phone: '+91 97665 54433', email: 'sneha@example.com', address: '321, Brigade Road, Hyderabad - 500001' },
    eventDate: '2026-02-05',
    occasion: 'Anniversary',
    service: 'Cocktail Service',
    guests: 40,
    status: 'Delivered',
    orderDate: '2026-01-18',
    items: [
      { id: 1, quantity: 40 },
      { id: 2, quantity: 40 },
      { id: 8, quantity: 40 },
      { id: 11, quantity: 40 },
      { id: 19, quantity: 80 },
      { id: 27, quantity: 40 }
    ],
    subtotal: 28000,
    serviceCharges: 2800,
    gst: 2430,
    total: 31800
  },
  {
    id: 1025,
    customer: { name: 'Vikram Singh', phone: '+91 96554 43322', email: 'vikram@example.com', address: '654, Mall Road, Chandigarh - 160001' },
    eventDate: '2026-02-28',
    occasion: 'Engagement',
    service: 'Full Service Catering',
    guests: 100,
    status: 'Confirmed',
    orderDate: '2026-01-27',
    items: [
      { id: 1, quantity: 100 },
      { id: 3, quantity: 100 },
      { id: 5, quantity: 100 },
      { id: 11, quantity: 100 },
      { id: 14, quantity: 100 },
      { id: 16, quantity: 100 },
      { id: 19, quantity: 200 },
      { id: 23, quantity: 100 },
      { id: 27, quantity: 100 },
      { id: 34, quantity: 2 }
    ],
    subtotal: 145000,
    serviceCharges: 14500,
    gst: 12607.50,
    total: 165000
  }
];

// Helper function to get order statistics
export const getOrderStats = () => {
  const totalOrders = mockOrders.length;
  const todayOrders = mockOrders.filter(order => order.orderDate === '2026-01-28').length;
  const pendingOrders = mockOrders.filter(order => order.status === 'Pending').length;
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
  const activeItems = mockMenuItems.filter(item => item.active).length;
  const activeOccasions = mockOccasions.filter(occ => occ.active).length;

  return {
    totalOrders,
    todayOrders,
    pendingOrders,
    totalRevenue,
    activeItems,
    activeOccasions
  };
};

// Helper function to get popular menu items
export const getPopularItems = () => {
  const itemCounts = {};

  mockOrders.forEach(order => {
    order.items.forEach(orderItem => {
      if (itemCounts[orderItem.id]) {
        itemCounts[orderItem.id] += orderItem.quantity;
      } else {
        itemCounts[orderItem.id] = orderItem.quantity;
      }
    });
  });

  const popularItems = Object.entries(itemCounts)
    .map(([itemId, count]) => {
      const item = mockMenuItems.find(i => i.id === parseInt(itemId));
      return { ...item, orderCount: count };
    })
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 5);

  return popularItems;
};

// Helper function to get orders chart data (last 7 days)
export const getOrdersChartData = () => {
  const dates = [];
  const counts = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    dates.push(dateStr);

    const count = Math.floor(Math.random() * 10) + 1; // Random data for demo
    counts.push(count);
  }

  return { dates, counts };
};

// Blogs
export const mockBlogs = [
  {
    id: 1,
    title: "10 Essential Spices for Indian Cooking",
    description: "Discover the must-have spices that form the foundation of authentic Indian cuisine. From aromatic cardamom to earthy turmeric, learn how to use these key ingredients to transform your cooking.",
    image: "https://images.unsplash.com/photo-1596040033229-a0b13b1ab442?w=400",
    blogType: "Ingredient Guide",
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "Perfect Butter Chicken Recipe",
    description: "Master the art of making restaurant-quality butter chicken at home. This step-by-step guide will help you create the creamy, flavorful dish that's beloved worldwide.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400",
    blogType: "Recipe",
    date: "2024-01-20"
  },
  {
    id: 3,
    title: "Mumbai's Best Street Food Spots",
    description: "Explore the vibrant street food culture of Mumbai. From vada pav to pav bhaji, discover the iconic eateries that have been serving authentic flavors for generations.",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400",
    blogType: "Restaurant Review",
    date: "2024-01-25"
  },
  {
    id: 4,
    title: "The Art of Making Perfect Biryani",
    description: "Learn the secrets behind creating the perfect biryani. From selecting the right rice to layering techniques, this comprehensive guide covers everything you need to know.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
    blogType: "Cooking Tips",
    date: "2024-02-01"
  },
  {
    id: 5,
    title: "Interview with Chef Vikas Khanna",
    description: "An exclusive conversation with Michelin-starred Chef Vikas Khanna about his culinary journey, inspirations, and the evolution of modern Indian cuisine.",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400",
    blogType: "Chef Interview",
    date: "2024-02-05"
  },
  {
    id: 6,
    title: "Regional Flavors of South India",
    description: "Dive deep into the diverse culinary traditions of South India. Explore how geography, climate, and culture have shaped the unique flavors of this vibrant region.",
    image: "https://images.unsplash.com/photo-1589301773859-34dddf0ad07c?w=400",
    blogType: "Food Culture",
    date: "2024-02-10"
  }
];

// Popular Items
export const mockPopularItems = [
  {
    id: 1,
    name: "Butter Chicken",
    description: "Tender chicken pieces in a rich, creamy tomato-based gravy with aromatic spices",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400",
    price: 350,
    rating: 5
  },
  {
    id: 2,
    name: "Paneer Tikka Masala",
    description: "Grilled cottage cheese cubes in a spicy and tangy masala gravy",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400",
    price: 280,
    rating: 5
  },
  {
    id: 3,
    name: "Chicken Biryani",
    description: "Fragrant basmati rice layered with marinated chicken and aromatic spices",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
    price: 320,
    rating: 5
  },
  {
    id: 4,
    name: "Malai Kofta",
    description: "Deep-fried paneer and potato dumplings in a creamy cashew gravy",
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400",
    price: 260,
    rating: 4
  },
  {
    id: 5,
    name: "Dal Makhani",
    description: "Slow-cooked black lentils in a buttery tomato cream sauce",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
    price: 220,
    rating: 5
  },
  {
    id: 6,
    name: "Gulab Jamun",
    description: "Soft milk-solid dumplings soaked in rose-flavored sugar syrup",
    image: "https://images.unsplash.com/photo-1589301773859-34dddf0ad07c?w=400",
    price: 120,
    rating: 5
  }
];

// Range Menus
export const mockRangeMenus = [
  {
    id: 1,
    name: "Paneer Butter Masala",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400",
    price: 280,
    rating: 4.8,
    range: "Paneer Range"
  },
  {
    id: 2,
    name: "Shahi Paneer",
    image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400",
    price: 290,
    rating: 4.7,
    range: "Paneer Range"
  },
  {
    id: 3,
    name: "Paneer Tikka",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400",
    price: 260,
    rating: 4.9,
    range: "Paneer Range"
  },
  {
    id: 4,
    name: "Veg Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    price: 120,
    rating: 4.5,
    range: "Fast Food Range"
  },
  {
    id: 5,
    name: "French Fries",
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400",
    price: 80,
    rating: 4.3,
    range: "Fast Food Range"
  },

];

// YouTube Links
export const mockYoutubeLinks = [
  {
    id: 1,
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: 2,
    url: "https://www.youtube.com/watch?v=jNQXAC9IVRw"
  },
  {
    id: 3,
    url: "https://youtu.be/9bZkp7q19f0"
  },
  {
    id: 4,
    url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk"
  }
];
