import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import {
  mockOccasions,
  mockServices,
  mockCategories,
  mockMenuItems,
  mockOrders,
  mockBlogs,
  mockPopularItems,
  mockRangeMenus,
  mockYoutubeLinks,
} from "../utils/mockData";

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // All state declarations MUST come before useEffect hooks
  const [blogs, setBlogs] = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState(mockOrders);
  const [popularItems, setPopularItems] = useState([]);
  const [rangeMenus, setRangeMenus] = useState([]);
  const [youtubeLinks, setYoutubeLinks] = useState([]);
  const [packages, setPackages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [events, setEvents] = useState([]);
  const [serviceConfigs, setServiceConfigs] = useState({});
  const [serviceSelections, setServiceSelections] = useState({});

  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingPopularItems, setLoadingPopularItems] = useState(true);
  const [loadingOccasions, setLoadingOccasions] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingYoutubeLinks, setLoadingYoutubeLinks] = useState(true);
  const [loadingRangeMenus, setLoadingRangeMenus] = useState(true);
  const [loadingMenuItems, setLoadingMenuItems] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [progress, setProgress] = useState(0);

  // Fetch Blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingBlogs(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/blogs/getblogs`,
        );
        if (Array.isArray(response.data)) {
          setBlogs(response.data);
        } else {
          console.error("Fetch blogs response is not an array:", response.data);
          setBlogs([]);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        setLoadingPopularItems(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/food`,
        );
        if (Array.isArray(response.data)) {
          setPopularItems(response.data);
        } else {
          console.error(
            "Fetch popular items response is not an array:",
            response.data,
          );
          setPopularItems([]);
        }
      } catch (error) {
        console.error("Error fetching popular items:", error);
      } finally {
        setLoadingPopularItems(false);
      }
    };
    fetchPopularItems();
  }, []);

  useEffect(() => {
    const fetchOccasions = async () => {
      try {
        setLoadingOccasions(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/occasions`,
        );
        if (Array.isArray(response.data)) {
          setOccasions(response.data);
        } else {
          console.error(
            "Fetch occasions response is not an array:",
            response.data,
          );
          setOccasions([]);
        }
      } catch (error) {
        console.error("Error fetching occasions:", error);
      } finally {
        setLoadingOccasions(false);
      }
    };
    fetchOccasions();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/services`,
        );
        if (Array.isArray(response.data)) {
          setServices(response.data);
        } else {
          console.error(
            "Fetch services response is not an array:",
            response.data,
          );
          setServices([]);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/categories`,
        );
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error(
            "Fetch categories response is not an array:",
            response.data,
          );
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/categories`,
        );
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error(
            "Fetch categories response is not an array:",
            response.data,
          );
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchYoutubeLinks = async () => {
      try {
        setLoadingYoutubeLinks(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/youtube`,
        );
        if (Array.isArray(response.data)) {
          setYoutubeLinks(response.data);
        } else {
          console.error(
            "Fetch youtube links response is not an array:",
            response.data,
          );
          setYoutubeLinks([]);
        }
      } catch (error) {
        console.error("Error fetching YouTube links:", error);
      } finally {
        setLoadingYoutubeLinks(false);
      }
    };
    fetchYoutubeLinks();
    fetchYoutubeLinks();
  }, []);

  useEffect(() => {
    const fetchRangeMenus = async () => {
      try {
        setLoadingRangeMenus(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/range-menus`,
        );
        if (Array.isArray(response.data)) {
          setRangeMenus(response.data);
        } else {
          console.error(
            "Fetch range menus response is not an array:",
            response.data,
          );
          setRangeMenus([]);
        }
      } catch (error) {
        console.error("Error fetching range menus:", error);
      } finally {
        setLoadingRangeMenus(false);
      }
    };
    fetchRangeMenus();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setProgress(30);
      setLoadingMenuItems(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/menu-items`,
      );
      console.log("Menu Items API Response:", response);
      console.log("Menu Items Data:", response.data);
      if (response.data && Array.isArray(response.data.data)) {
        setMenuItems(response.data.data);
      } else if (Array.isArray(response.data)) {
        setMenuItems(response.data);
      } else {
        console.error(
          "Fetch menu items response is not an array:",
          response.data,
        );
        setMenuItems([]);
      }
      setProgress(100);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      setProgress(100);
    } finally {
      setLoadingMenuItems(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoadingPackages(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/packages`,
        );
        if (Array.isArray(response.data)) {
          setPackages(response.data);
        } else {
          console.error(
            "Fetch packages response is not an array:",
            response.data,
          );
          setPackages([]);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      } finally {
        setLoadingPackages(false);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoadingTestimonials(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/testimonials`,
        );
        if (Array.isArray(response.data)) {
          setTestimonials(response.data);
        } else {
          console.error(
            "Fetch testimonials response is not an array:",
            response.data,
          );
          setTestimonials([]);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoadingTestimonials(false);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/events`,
        );
        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          console.error(
            "Fetch events response is not an array:",
            response.data,
          );
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);
  // State declarations moved to top of component (before useEffect hooks)

  const addMenuItem = async (menuItem) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticItem = { ...menuItem, _id: tempId, createdAt: new Date() };

    setMenuItems([optimisticItem, ...menuItems]);

    try {
      const imageUrl = await handleImageUpload(menuItem.image);
      const itemWithUrl = { ...menuItem, image: imageUrl };
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/menu-items`,
        itemWithUrl,
      );

      setMenuItems((prev) =>
        prev.map((item) => (item._id === tempId ? response.data : item)),
      );
    } catch (error) {
      setMenuItems((prev) => prev.filter((item) => item._id !== tempId));
      console.error("Error adding menu item:", error);
      alert("Failed to add menu item. Please try again.");
    }
  };

  const addTestimonial = async (testimonial) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticTestimonial = {
      ...testimonial,
      _id: tempId,
      createdAt: new Date(),
    };

    setTestimonials([optimisticTestimonial, ...testimonials]);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/testimonials`,
        testimonial,
      );
      setTestimonials((prev) =>
        prev.map((t) => (t._id === tempId ? response.data : t)),
      );
    } catch (error) {
      setTestimonials((prev) => prev.filter((t) => t._id !== tempId));
      console.error("Error adding testimonial:", error);
      alert("Failed to add testimonial. Please try again.");
    }
  };

  const updateTestimonial = async (id, updatedData) => {
    const originalTestimonials = [...testimonials];

    setTestimonials(
      testimonials.map((t) => (t._id === id ? { ...t, ...updatedData } : t)),
    );

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/testimonials/${id}`,
        updatedData,
      );
      setTestimonials((prev) =>
        prev.map((t) => (t._id === id ? response.data : t)),
      );
    } catch (error) {
      setTestimonials(originalTestimonials);
      console.error("Error updating testimonial:", error);
      alert("Failed to update testimonial. Please try again.");
    }
  };

  const deleteTestimonial = async (id) => {
    try {
      setProgress(30);
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/testimonials/${id}`,
      );
      setTestimonials(testimonials.filter((t) => t._id !== id));
      setProgress(100);
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      setProgress(100);
    }
  };

  const addEvent = async (event) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticEvent = { ...event, _id: tempId, createdAt: new Date() };

    setEvents([optimisticEvent, ...events]);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/events`,
        event,
      );
      setEvents((prev) =>
        prev.map((e) => (e._id === tempId ? response.data : e)),
      );
    } catch (error) {
      setEvents((prev) => prev.filter((e) => e._id !== tempId));
      console.error("Error adding event:", error);
      alert("Failed to add event. Please try again.");
    }
  };

  const updateEvent = async (id, updatedData) => {
    const originalEvents = [...events];

    setEvents(events.map((e) => (e._id === id ? { ...e, ...updatedData } : e)));

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/events/${id}`,
        updatedData,
      );
      setEvents((prev) => prev.map((e) => (e._id === id ? response.data : e)));
    } catch (error) {
      setEvents(originalEvents);
      console.error("Error updating event:", error);
      alert("Failed to update event. Please try again.");
    }
  };

  const deleteEvent = async (id) => {
    try {
      setProgress(30);
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/events/${id}`,
      );
      setEvents(events.filter((e) => e._id !== id));
      setProgress(100);
    } catch (error) {
      console.error("Error deleting event:", error);
      setProgress(100);
    }
  };

  const addBulkMenuItems = async (items) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/menu-items/bulk`,
        items,
      );
      setMenuItems([...response.data, ...menuItems]);
    } catch (error) {
      console.error("Error adding bulk menu items:", error);
    }
  };

  const updateMenuItem = async (id, updatedMenuItem) => {
    const originalItems = [...menuItems];

    setMenuItems(
      menuItems.map((mi) =>
        mi._id === id ? { ...mi, ...updatedMenuItem } : mi,
      ),
    );

    try {
      let imageUrl = updatedMenuItem.image;
      if (
        updatedMenuItem.image &&
        updatedMenuItem.image.startsWith("data:image")
      ) {
        imageUrl = await handleImageUpload(updatedMenuItem.image);
      }
      const itemWithUrl = { ...updatedMenuItem, image: imageUrl };
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/menu-items/${id}`,
        itemWithUrl,
      );
      setMenuItems((prev) =>
        prev.map((mi) => (mi._id === id ? response.data : mi)),
      );
    } catch (error) {
      setMenuItems(originalItems);
      console.error("Error updating menu item:", error);
      alert("Failed to update menu item. Please try again.");
    }
  };

  const deleteMenuItem = async (id) => {
    const originalItems = [...menuItems];
    setMenuItems(menuItems.filter((mi) => mi._id !== id));
    try {
      setProgress(30);
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/menu-items/${id}`,
      );
      setProgress(100);
    } catch (error) {
      setMenuItems(originalItems);
      setProgress(100);
    }
  };

  const toggleMenuItemActive = async (id) => {
    const item = menuItems.find((mi) => mi._id === id);
    if (item) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/menu-items/${id}`,
          { ...item, active: !item.active },
        );
        setMenuItems(
          menuItems.map((mi) => (mi._id === id ? response.data : mi)),
        );
      } catch (error) {
        console.error("Error toggling menu item status:", error);
      }
    }
  };

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: Math.max(...orders.map((o) => o.id), 0) + 1,
    };
    setOrders([...orders, newOrder]);
  };

  const updateOrder = (id, updatedOrder) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, ...updatedOrder } : o)));
  };

  const updateOrderStatus = (id, status) => {
    setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const deleteOrder = (id) => {
    setOrders(orders.filter((o) => o.id !== id));
  };

  const getMenuItemById = (id) => {
    return menuItems.find((item) => item.id === id);
  };

  const getOrderById = (id) => {
    return orders.find((order) => order.id === parseInt(id));
  };

  const getMenuCategoryById = (categoryId) => {
    const categoriesMap = {
      1: { id: 1, name: "Starter" },
      2: { id: 2, name: "Main Course" },
      3: { id: 3, name: "Bread & Rice" },
      4: { id: 4, name: "Dessert" },
      5: { id: 5, name: "Live Stations" },
    };
    return categoriesMap[categoryId] || null;
  };

  const handleImageUpload = async (image) => {
    if (!image || !image.startsWith("data:image")) return image;
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        { image },
      );
      return response.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return image;
    }
  };

  const value = {
    occasions,
    services,
    categories,
    menuItems,
    loadingMenuItems,
    refreshMenuItems: fetchMenuItems,
    orders,

    // Occasions
    loadingOccasions,
    addOccasion: async (occasion) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticOccasion = {
        ...occasion,
        _id: tempId,
        createdAt: new Date(),
      };

      setOccasions([optimisticOccasion, ...occasions]);

      try {
        const imageUrl = await handleImageUpload(occasion.image);
        const occasionWithUrl = { ...occasion, image: imageUrl };
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/occasions`,
          occasionWithUrl,
        );
        setOccasions((prev) =>
          prev.map((o) => (o._id === tempId ? response.data : o)),
        );
        return response.data;
      } catch (error) {
        setOccasions((prev) => prev.filter((o) => o._id !== tempId));
        console.error("Error adding occasion:", error);
        alert("Failed to add occasion. Please try again.");
      }
    },
    updateOccasion: async (id, updatedData) => {
      const originalOccasions = [...occasions];

      setOccasions(
        occasions.map((o) => (o._id === id ? { ...o, ...updatedData } : o)),
      );

      try {
        let imageUrl = updatedData.image;
        if (updatedData.image && updatedData.image.startsWith("data:image")) {
          imageUrl = await handleImageUpload(updatedData.image);
        }
        const dataWithUrl = { ...updatedData, image: imageUrl };
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/occasions/${id}`,
          dataWithUrl,
        );
        setOccasions((prev) =>
          prev.map((o) => (o._id === id ? response.data : o)),
        );
        return response.data;
      } catch (error) {
        setOccasions(originalOccasions);
        console.error("Error updating occasion:", error);
        alert("Failed to update occasion. Please try again.");
      }
    },
    deleteOccasion: async (id) => {
      try {
        setProgress(30);
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/occasions/${id}`,
        );
        setOccasions(occasions.filter((o) => o._id !== id));
        setProgress(100);
      } catch (error) {
        console.error("Error deleting occasion:", error);
        setProgress(100);
      }
    },
    toggleOccasionActive: async (id) => {
      const occasion = occasions.find((o) => o._id === id);
      if (occasion) {
        try {
          const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/occasions/${id}`,
            { ...occasion, active: !occasion.active },
          );
          setOccasions(
            occasions.map((o) => (o._id === id ? response.data : o)),
          );
        } catch (error) {
          console.error("Error toggling occasion status:", error);
        }
      }
    },

    // Services
    loadingServices,
    addService: async (service) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticService = {
        ...service,
        _id: tempId,
        createdAt: new Date(),
      };

      setServices([optimisticService, ...services]);

      try {
        const imageUrl = await handleImageUpload(service.image);
        const serviceWithUrl = { ...service, image: imageUrl };
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/services`,
          serviceWithUrl,
        );
        setServices((prev) =>
          prev.map((s) => (s._id === tempId ? response.data : s)),
        );
        return response.data;
      } catch (error) {
        setServices((prev) => prev.filter((s) => s._id !== tempId));
        console.error("Error adding service:", error);
        alert("Failed to add service. Please try again.");
      }
    },
    updateService: async (id, updatedData) => {
      const originalServices = [...services];

      setServices(
        services.map((s) => (s._id === id ? { ...s, ...updatedData } : s)),
      );

      try {
        let imageUrl = updatedData.image;
        if (updatedData.image && updatedData.image.startsWith("data:image")) {
          imageUrl = await handleImageUpload(updatedData.image);
        }
        const dataWithUrl = { ...updatedData, image: imageUrl };
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/services/${id}`,
          dataWithUrl,
        );
        setServices((prev) =>
          prev.map((s) => (s._id === id ? response.data : s)),
        );
        return response.data;
      } catch (error) {
        setServices(originalServices);
        console.error("Error updating service:", error);
        alert("Failed to update service. Please try again.");
      }
    },
    deleteService: async (id) => {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/services/${id}`,
        );
        setServices(services.filter((s) => s._id !== id));
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    },
    toggleServiceActive: async (id) => {
      const service = services.find((s) => s._id === id);
      if (service) {
        try {
          const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/services/${id}`,
            { ...service, active: !service.active },
          );
          setServices(services.map((s) => (s._id === id ? response.data : s)));
        } catch (error) {
          console.error("Error toggling service status:", error);
        }
      }
    },

    // Categories
    loadingCategories,
    addCategory: async (category) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticCategory = {
        ...category,
        _id: tempId,
        createdAt: new Date(),
      };

      setCategories([optimisticCategory, ...categories]);

      try {
        const imageUrl = await handleImageUpload(category.image);
        const categoryWithUrl = { ...category, image: imageUrl };
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/categories`,
          categoryWithUrl,
        );
        setCategories((prev) =>
          prev.map((c) => (c._id === tempId ? response.data : c)),
        );
        return response.data;
      } catch (error) {
        setCategories((prev) => prev.filter((c) => c._id !== tempId));
        console.error("Error adding category:", error);
        alert("Failed to add category. Please try again.");
      }
    },
    updateCategory: async (id, updatedData) => {
      const originalCategories = [...categories];

      setCategories(
        categories.map((c) => (c._id === id ? { ...c, ...updatedData } : c)),
      );

      try {
        let imageUrl = updatedData.image;
        if (updatedData.image && updatedData.image.startsWith("data:image")) {
          imageUrl = await handleImageUpload(updatedData.image);
        }
        const dataWithUrl = { ...updatedData, image: imageUrl };
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/categories/${id}`,
          dataWithUrl,
        );
        setCategories((prev) =>
          prev.map((c) => (c._id === id ? response.data : c)),
        );
        return response.data;
      } catch (error) {
        setCategories(originalCategories);
        console.error("Error updating category:", error);
        alert("Failed to update category. Please try again.");
      }
    },
    deleteCategory: async (id) => {
      try {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/categories/${id}`,
        );
        setCategories(categories.filter((c) => c._id !== id));
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    },
    toggleCategoryActive: async (id) => {
      const category = categories.find((c) => c._id === id);
      if (category) {
        try {
          const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/categories/${id}`,
            { ...category, active: !category.active },
          );
          setCategories(
            categories.map((c) => (c._id === id ? response.data : c)),
          );
        } catch (error) {
          console.error("Error toggling category status:", error);
        }
      }
    },

    addMenuItem,
    addBulkMenuItems,
    updateMenuItem,
    deleteMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemActive,

    testimonials,
    loadingTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,

    events,
    loadingEvents,
    addEvent,
    updateEvent,
    deleteEvent,

    addOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,

    blogs,
    loadingBlogs,
    addBlog: async (blog) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticBlog = { ...blog, _id: tempId, createdAt: new Date() };

      setBlogs([optimisticBlog, ...blogs]);

      try {
        const imageUrl = await handleImageUpload(blog.image);
        const blogWithUrl = { ...blog, image: imageUrl };
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/blogs/addblog`,
          blogWithUrl,
        );
        setBlogs((prev) =>
          prev.map((b) => (b._id === tempId ? response.data : b)),
        );
      } catch (error) {
        setBlogs((prev) => prev.filter((b) => b._id !== tempId));
        console.error("Error adding blog:", error);
        alert("Failed to add blog. Please try again.");
      }
    },
    updateBlog: async (id, updatedData) => {
      const originalBlogs = [...blogs];

      setBlogs(
        blogs.map((blog) =>
          blog._id === id ? { ...blog, ...updatedData } : blog,
        ),
      );

      try {
        let imageUrl = updatedData.image;
        if (updatedData.image && updatedData.image.startsWith("data:image")) {
          imageUrl = await handleImageUpload(updatedData.image);
        }
        const dataWithUrl = { ...updatedData, image: imageUrl };
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/blogs/editblog/${id}`,
          dataWithUrl,
        );
        setBlogs((prev) =>
          prev.map((blog) => (blog._id === id ? response.data : blog)),
        );
      } catch (error) {
        setBlogs(originalBlogs);
        console.error("Error updating blog:", error);
        alert("Failed to update blog. Please try again.");
      }
    },
    deleteBlog: async (id) => {
      try {
        setProgress(30);
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/blogs/deleteblog/${id}`,
        );
        setBlogs(blogs.filter((blog) => blog._id !== id));
        setProgress(100);
      } catch (error) {
        console.error("Error deleting blog:", error);
        setProgress(100);
      }
    },

    popularItems,
    loadingPopularItems,
    addPopularItem: async (item) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticItem = { ...item, _id: tempId, createdAt: new Date() };

      setPopularItems([optimisticItem, ...popularItems]);

      try {
        const imageUrl = await handleImageUpload(item.image);
        const itemWithUrl = { ...item, image: imageUrl };
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/food`,
          itemWithUrl,
        );
        setPopularItems((prev) =>
          prev.map((i) => (i._id === tempId ? response.data : i)),
        );
      } catch (error) {
        setPopularItems((prev) => prev.filter((i) => i._id !== tempId));
        console.error("Error adding popular item:", error);
        alert("Failed to add popular item. Please try again.");
      }
    },
    updatePopularItem: async (id, updatedData) => {
      const originalItems = [...popularItems];

      setPopularItems(
        popularItems.map((item) =>
          item._id === id ? { ...item, ...updatedData } : item,
        ),
      );

      try {
        let imageUrl = updatedData.image;
        if (updatedData.image && updatedData.image.startsWith("data:image")) {
          imageUrl = await handleImageUpload(updatedData.image);
        }
        const dataWithUrl = { ...updatedData, image: imageUrl };
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/food/${id}`,
          dataWithUrl,
        );
        setPopularItems((prev) =>
          prev.map((item) => (item._id === id ? response.data : item)),
        );
      } catch (error) {
        setPopularItems(originalItems);
        console.error("Error updating popular item:", error);
        alert("Failed to update popular item. Please try again.");
      }
    },
    deletePopularItem: async (id) => {
      try {
        setProgress(30);
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/food/${id}`,
        );
        setPopularItems(popularItems.filter((item) => item._id !== id));
        setProgress(100);
      } catch (error) {
        console.error("Error deleting popular item:", error);
        setProgress(100);
      }
    },

    rangeMenus,
    loadingRangeMenus,
    addRangeMenu: async (menu) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticMenu = { ...menu, _id: tempId, createdAt: new Date() };

      setRangeMenus([optimisticMenu, ...rangeMenus]);

      try {
        const imageUrl = await handleImageUpload(menu.image);
        const menuWithUrl = { ...menu, image: imageUrl };
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/range-menus`,
          menuWithUrl,
        );
        setRangeMenus((prev) =>
          prev.map((m) => (m._id === tempId ? response.data : m)),
        );
      } catch (error) {
        setRangeMenus((prev) => prev.filter((m) => m._id !== tempId));
        console.error("Error adding range menu:", error);
        alert("Failed to add range menu. Please try again.");
      }
    },
    updateRangeMenu: async (id, updatedData) => {
      const originalMenus = [...rangeMenus];

      setRangeMenus(
        rangeMenus.map((m) => (m._id === id ? { ...m, ...updatedData } : m)),
      );

      try {
        let imageUrl = updatedData.image;
        if (updatedData.image && updatedData.image.startsWith("data:image")) {
          imageUrl = await handleImageUpload(updatedData.image);
        }
        const dataWithUrl = { ...updatedData, image: imageUrl };
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/range-menus/${id}`,
          dataWithUrl,
        );
        setRangeMenus((prev) =>
          prev.map((m) => (m._id === id ? response.data : m)),
        );
      } catch (error) {
        setRangeMenus(originalMenus);
        console.error("Error updating range menu:", error);
        alert("Failed to update range menu. Please try again.");
      }
    },
    deleteRangeMenu: async (id) => {
      const originalItems = [...rangeMenus];
      setRangeMenus(rangeMenus.filter((m) => m._id !== id));
      try {
        setProgress(30);
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/range-menus/${id}`,
        );
        setProgress(100);
      } catch (error) {
        setRangeMenus(originalItems);
        setProgress(100);
      }
    },

    youtubeLinks,
    loadingYoutubeLinks,
    addYoutubeLink: async (link) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticLink = { ...link, _id: tempId, createdAt: new Date() };

      setYoutubeLinks([optimisticLink, ...youtubeLinks]);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/youtube`,
          link,
        );
        setYoutubeLinks((prev) =>
          prev.map((l) => (l._id === tempId ? response.data : l)),
        );
      } catch (error) {
        setYoutubeLinks((prev) => prev.filter((l) => l._id !== tempId));
        console.error("Error adding YouTube link:", error);
        alert("Failed to add YouTube link. Please try again.");
      }
    },
    deleteYoutubeLink: async (id) => {
      try {
        setProgress(30);
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/youtube/${id}`,
        );
        setYoutubeLinks(youtubeLinks.filter((link) => link._id !== id));
        setProgress(100);
      } catch (error) {
        console.error("Error deleting YouTube link:", error);
        setProgress(100);
      }
    },

    packages,
    loadingPackages,
    addPackage: async (pkg) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticPkg = { ...pkg, _id: tempId, createdAt: new Date() };

      setPackages([optimisticPkg, ...packages]);

      try {
        const imageUrl = await handleImageUpload(pkg.image);
        const pkgWithUrl = { ...pkg, image: imageUrl };
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/packages`,
          pkgWithUrl,
        );
        setPackages((prev) =>
          prev.map((p) => (p._id === tempId ? response.data : p)),
        );
      } catch (error) {
        setPackages((prev) => prev.filter((p) => p._id !== tempId));
        console.error("Error adding package:", error);
        alert("Failed to add package. Please try again.");
      }
    },
    deletePackage: async (id) => {
      try {
        setProgress(30);
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/packages/${id}`,
        );
        setPackages(packages.filter((p) => p._id !== id));
        setProgress(100);
      } catch (error) {
        console.error("Error deleting package:", error);
        setProgress(100);
      }
    },
    updatePackage: async (id, updatedData) => {
      const originalPackages = [...packages];

      setPackages(
        packages.map((p) => (p._id === id ? { ...p, ...updatedData } : p)),
      );

      try {
        const imageUrl = await handleImageUpload(updatedData.image);
        const pkgWithUrl = { ...updatedData, image: imageUrl };
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/packages/${id}`,
          pkgWithUrl,
        );
        setPackages((prev) =>
          prev.map((p) => (p._id === id ? response.data : p)),
        );
      } catch (error) {
        setPackages(originalPackages);
        console.error("Error updating package:", error);
        alert("Failed to update package. Please try again.");
      }
    },

    // Occasion Menu Selections
    getOccasionMenuSelection: async (occasionId) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/menu-selection/occasion/${occasionId}`,
        );
        console.log("Fetched occasion menu:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching occasion menu selection:", error);
        return { starters: [], mainCourses: [], desserts: [], breadRice: [] };
      }
    },

    saveOccasionMenuSelection: async (occasionId, selection) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/menu-selection/occasion/${occasionId}`,
          selection,
        );
        console.log(
          `Menu selection saved for occasion ${occasionId}:`,
          response.data,
        );
        return response.data;
      } catch (error) {
        console.error("Error saving occasion menu selection:", error);
        throw error;
      }
    },

    // Service Menu Selections
    // Service Menu Selections
    getServiceMenuSelection: async (serviceId) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/menu-selection/service/${serviceId}`,
        );
        console.log("Fetched service menu:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching service menu selection:", error);
        return { starters: [], mainCourses: [], desserts: [], breadRice: [] };
      }
    },

    saveServiceMenuSelection: async (serviceId, selection) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/menu-selection/service/${serviceId}`,
          selection,
        );
        console.log(
          `Menu selection saved for service ${serviceId}:`,
          response.data,
        );
        return response.data;
      } catch (error) {
        console.error("Error saving service menu selection:", error);
        throw error;
      }
    },

    // Category Menu Selections
    // Category Menu Selections
    getCategoryMenuSelection: async (categoryId) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/menu-selection/category/${categoryId}`,
        );
        console.log("Fetched category menu:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching category menu selection:", error);
        return { starters: [], mainCourses: [], desserts: [], breadRice: [] };
      }
    },

    saveCategoryMenuSelection: async (categoryId, selection) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/menu-selection/category/${categoryId}`,
          selection,
        );
        console.log(
          `Menu selection saved for category ${categoryId}:`,
          response.data,
        );
        return response.data;
      } catch (error) {
        console.error("Error saving category menu selection:", error);
        throw error;
      }
    },

    // Package Menu Selections (API based)
    getPackageMenuSelection: async (packageId) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/package-menu/${packageId}/menu-selection`,
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching package menu selection:", error);
        return { starters: [], mainCourses: [], desserts: [], breadRice: [] };
      }
    },

    savePackageMenuSelection: async (packageId, selection) => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/package-menu/${packageId}/menu-selection`,
          selection,
        );
        return response.data;
      } catch (error) {
        console.error("Error saving package menu selection:", error);
        throw error;
      }
    },

    getMenuItemById,
    getOrderById,
    getMenuCategoryById,
    progress,
    setProgress,

    // Categories
    categories,
    loadingCategories,
    addCategory: async (category) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticCategory = { ...category, _id: tempId, createdAt: new Date() };
      setCategories([optimisticCategory, ...categories]);

      try {
        const imageUrl = await handleImageUpload(category.image);
        const categoryWithUrl = { ...category, image: imageUrl };
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/categories`,
          categoryWithUrl,
        );
        setCategories((prev) => prev.map((c) => (c._id === tempId ? response.data : c)));
        return response.data;
      } catch (error) {
        setCategories((prev) => prev.filter((c) => c._id !== tempId));
        console.error("Error adding category:", error);
        alert("Failed to add category.");
      }
    },
    updateCategory: async (id, updatedData) => {
      const originalCategories = [...categories];
      setCategories(categories.map((c) => (c._id === id ? { ...c, ...updatedData } : c)));

      try {
        let imageUrl = updatedData.image;
        if (updatedData.image && updatedData.image.startsWith("data:image")) {
          imageUrl = await handleImageUpload(updatedData.image);
        }
        const dataWithUrl = { ...updatedData, image: imageUrl };
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/categories/${id}`,
          dataWithUrl,
        );
        setCategories((prev) => prev.map((c) => (c._id === id ? response.data : c)));
        return response.data;
      } catch (error) {
        setCategories(originalCategories);
        console.error("Error updating category:", error);
        alert("Failed to update category.");
      }
    },
    deleteCategory: async (id) => {
      try {
        setProgress(30);
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/categories/${id}`);
        setCategories(categories.filter((c) => c._id !== id));
        setProgress(100);
      } catch (error) {
        console.error("Error deleting category:", error);
        setProgress(100);
        if (error.response?.data?.activeServices > 0) {
          alert(`Cannot delete category with ${error.response.data.activeServices} active services`);
        } else {
          alert("Failed to delete category.");
        }
      }
    },
    toggleCategoryActive: async (id) => {
      const category = categories.find((c) => c._id === id);
      if (category) {
        try {
          const response = await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/api/categories/${id}/toggle-active`,
          );
          setCategories(categories.map((c) => (c._id === id ? response.data : c)));
        } catch (error) {
          console.error("Error toggling category status:", error);
        }
      }
    },

    // Services
    services,
    loadingServices,
    serviceConfigs,
    serviceSelections,
    addService: async (service, initialConfig) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticService = { ...service, _id: tempId, createdAt: new Date() };
      setServices([optimisticService, ...services]);

      try {
        const uploadedImages = await Promise.all(
          (service.images || []).map(async (img) => {
            if (img.url && img.url.startsWith('data:image')) {
              const uploadedUrl = await handleImageUpload(img.url);
              return { ...img, url: uploadedUrl };
            }
            return img;
          })
        );

        const serviceWithImages = { ...service, images: uploadedImages };
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/services`,
          serviceWithImages,
        );

        setServices((prev) => prev.map((s) => (s._id === tempId ? response.data : s)));

        if (initialConfig) {
          await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/service-config/${response.data._id}`,
            initialConfig,
          );
        }

        return response.data;
      } catch (error) {
        setServices((prev) => prev.filter((s) => s._id !== tempId));
        console.error("Error adding service:", error);
        alert("Failed to add service.");
      }
    },
    updateService: async (id, updatedData) => {
      const originalServices = [...services];
      setServices(services.map((s) => (s._id === id ? { ...s, ...updatedData } : s)));

      try {
        let updatedImages = updatedData.images;
        if (updatedData.images) {
          updatedImages = await Promise.all(
            updatedData.images.map(async (img) => {
              if (img.url && img.url.startsWith('data:image')) {
                const uploadedUrl = await handleImageUpload(img.url);
                return { ...img, url: uploadedUrl };
              }
              return img;
            })
          );
        }

        const dataWithImages = { ...updatedData, images: updatedImages };
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/services/${id}`,
          dataWithImages,
        );
        setServices((prev) => prev.map((s) => (s._id === id ? response.data : s)));
        return response.data;
      } catch (error) {
        setServices(originalServices);
        console.error("Error updating service:", error);
        alert("Failed to update service.");
      }
    },
    deleteService: async (id) => {
      try {
        setProgress(30);
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/services/${id}`);
        setServices(services.filter((s) => s._id !== id));
        setProgress(100);
      } catch (error) {
        console.error("Error deleting service:", error);
        setProgress(100);
        alert("Failed to delete service.");
      }
    },
    toggleServiceActive: async (id) => {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/services/${id}/toggle-active`,
        );
        setServices(services.map((s) => (s._id === id ? response.data : s)));
      } catch (error) {
        console.error("Error toggling service status:", error);
      }
    },
    toggleServiceFeatured: async (id) => {
      try {
        const response = await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/services/${id}/toggle-featured`,
        );
        setServices(services.map((s) => (s._id === id ? response.data : s)));
      } catch (error) {
        console.error("Error toggling featured status:", error);
      }
    },
    getServiceConfig: async (serviceId) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/service-config/${serviceId}`,
        );
        setServiceConfigs(prev => ({ ...prev, [serviceId]: response.data }));
        return response.data;
      } catch (error) {
        console.error("Error fetching service config:", error);
        return null;
      }
    },
    updateServiceConfig: async (serviceId, config) => {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/service-config/${serviceId}`,
          config,
        );
        setServiceConfigs(prev => ({ ...prev, [serviceId]: response.data }));
        return response.data;
      } catch (error) {
        console.error("Error updating service config:", error);
        alert("Failed to update configuration.");
      }
    },
    getServiceSelection: async (serviceId) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/service-selection/${serviceId}`,
        );
        setServiceSelections(prev => ({ ...prev, [serviceId]: response.data }));
        return response.data;
      } catch (error) {
        console.error("Error fetching service selection:", error);
        return null;
      }
    },
    saveServiceSelection: async (serviceId, selection) => {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/service-selection/${serviceId}`,
          selection,
        );
        setServiceSelections(prev => ({ ...prev, [serviceId]: response.data }));
        return response.data;
      } catch (error) {
        console.error("Error saving service selection:", error);
        alert("Failed to save selection.");
      }
    },
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
