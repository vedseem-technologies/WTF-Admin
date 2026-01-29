import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {
    mockOccasions,
    mockServices,
    mockCategories,
    mockMenuItems,
    mockOrders,
    mockBlogs,
    mockPopularItems,
    mockRangeMenus,
    mockYoutubeLinks
} from '../utils/mockData';

const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [loadingBlogs, setLoadingBlogs] = useState(true);

    const [loadingPopularItems, setLoadingPopularItems] = useState(true);
    const [loadingOccasions, setLoadingOccasions] = useState(true);
    const [loadingServices, setLoadingServices] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Fetch Blogs
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoadingBlogs(true);
                const response = await axios.get('http://localhost:5000/api/blogs/getblogs');
                setBlogs(response.data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoadingBlogs(false);
            }
        };

        fetchBlogs();
    }, []);

    // Fetch Popular Items
    useEffect(() => {
        const fetchPopularItems = async () => {
            try {
                setLoadingPopularItems(true);
                const response = await axios.get('http://localhost:5000/api/food');
                setPopularItems(response.data);
            } catch (error) {
                console.error("Error fetching popular items:", error);
            } finally {
                setLoadingPopularItems(false);
            }
        };
        fetchPopularItems();
    }, []);

    // Fetch Occasions
    useEffect(() => {
        const fetchOccasions = async () => {
            try {
                setLoadingOccasions(true);
                const response = await axios.get('http://localhost:5000/api/occasions');
                setOccasions(response.data);
            } catch (error) {
                console.error("Error fetching occasions:", error);
            } finally {
                setLoadingOccasions(false);
            }
        };
        fetchOccasions();
    }, []);

    // Fetch Services
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoadingServices(true);
                const response = await axios.get('http://localhost:5000/api/services');
                setServices(response.data);
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoadingServices(false);
            }
        };
        fetchServices();
    }, []);
    const [occasions, setOccasions] = useState([]);
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState(mockMenuItems);
    const [orders, setOrders] = useState(mockOrders);

    const [popularItems, setPopularItems] = useState([]);
    const [rangeMenus, setRangeMenus] = useState(mockRangeMenus);
    const [youtubeLinks, setYoutubeLinks] = useState(mockYoutubeLinks);









    // MENU ITEMS CRUD
    const addMenuItem = (menuItem) => {
        const newMenuItem = {
            ...menuItem,
            id: Math.max(...menuItems.map(mi => mi.id), 0) + 1
        };
        setMenuItems([...menuItems, newMenuItem]);
    };

    const addBulkMenuItems = (items) => {
        const startId = Math.max(...menuItems.map(mi => mi.id), 0) + 1;
        const newItems = items.map((item, index) => ({
            ...item,
            id: startId + index
        }));
        setMenuItems([...menuItems, ...newItems]);
    };

    const updateMenuItem = (id, updatedMenuItem) => {
        setMenuItems(menuItems.map(mi => mi.id === id ? { ...mi, ...updatedMenuItem } : mi));
    };

    const deleteMenuItem = (id) => {
        setMenuItems(menuItems.filter(mi => mi.id !== id));
    };

    const toggleMenuItemActive = (id) => {
        setMenuItems(menuItems.map(mi => mi.id === id ? { ...mi, active: !mi.active } : mi));
    };

    // ORDERS CRUD
    const addOrder = (order) => {
        const newOrder = {
            ...order,
            id: Math.max(...orders.map(o => o.id), 0) + 1
        };
        setOrders([...orders, newOrder]);
    };

    const updateOrder = (id, updatedOrder) => {
        setOrders(orders.map(o => o.id === id ? { ...o, ...updatedOrder } : o));
    };

    const updateOrderStatus = (id, status) => {
        setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    };

    const deleteOrder = (id) => {
        setOrders(orders.filter(o => o.id !== id));
    };

    // HELPER FUNCTIONS
    const getMenuItemById = (id) => {
        return menuItems.find(item => item.id === id);
    };



    const getOrderById = (id) => {
        return orders.find(order => order.id === parseInt(id));
    };

    const getMenuCategoryById = (categoryId) => {
        const categoriesMap = {
            1: { id: 1, name: 'Starter' },
            2: { id: 2, name: 'Main Course' },
            3: { id: 3, name: 'Bread & Rice' },
            4: { id: 4, name: 'Dessert' },
            5: { id: 5, name: 'Live Stations' }
        };
        return categoriesMap[categoryId] || null;
    };


    const handleImageUpload = async (image) => {
        if (!image || !image.startsWith('data:image')) return image;
        try {
            const response = await axios.post('http://localhost:5000/api/upload', { image });
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
        orders,

        // Occasions
        occasions,
        loadingOccasions,
        addOccasion: async (occasion) => {
            try {
                const imageUrl = await handleImageUpload(occasion.image);
                const occasionWithUrl = { ...occasion, image: imageUrl };
                const response = await axios.post('http://localhost:5000/api/occasions', occasionWithUrl);
                setOccasions([...occasions, response.data]);
            } catch (error) {
                console.error("Error adding occasion:", error);
            }
        },
        updateOccasion: async (id, updatedData) => {
            try {
                let imageUrl = updatedData.image;
                if (updatedData.image && updatedData.image.startsWith('data:image')) {
                    imageUrl = await handleImageUpload(updatedData.image);
                }
                const dataWithUrl = { ...updatedData, image: imageUrl };
                const response = await axios.put(`http://localhost:5000/api/occasions/${id}`, dataWithUrl);
                setOccasions(occasions.map(o => o._id === id ? response.data : o));
            } catch (error) {
                console.error("Error updating occasion:", error);
            }
        },
        deleteOccasion: async (id) => {
            try {
                await axios.delete(`http://localhost:5000/api/occasions/${id}`);
                setOccasions(occasions.filter(o => o._id !== id));
            } catch (error) {
                console.error("Error deleting occasion:", error);
            }
        },
        toggleOccasionActive: async (id) => {
            const occasion = occasions.find(o => o._id === id);
            if (occasion) {
                try {
                    const response = await axios.put(`http://localhost:5000/api/occasions/${id}`, { ...occasion, active: !occasion.active });
                    setOccasions(occasions.map(o => o._id === id ? response.data : o));
                } catch (error) {
                    console.error("Error toggling occasion status:", error);
                }
            }
        },

        // Services
        services,
        loadingServices,
        addService: async (service) => {
            try {
                const imageUrl = await handleImageUpload(service.image);
                const serviceWithUrl = { ...service, image: imageUrl };
                const response = await axios.post('http://localhost:5000/api/services', serviceWithUrl);
                setServices([...services, response.data]);
            } catch (error) {
                console.error("Error adding service:", error);
            }
        },
        updateService: async (id, updatedData) => {
            try {
                let imageUrl = updatedData.image;
                if (updatedData.image && updatedData.image.startsWith('data:image')) {
                    imageUrl = await handleImageUpload(updatedData.image);
                }
                const dataWithUrl = { ...updatedData, image: imageUrl };
                const response = await axios.put(`http://localhost:5000/api/services/${id}`, dataWithUrl);
                setServices(services.map(s => s._id === id ? response.data : s));
            } catch (error) {
                console.error("Error updating service:", error);
            }
        },
        deleteService: async (id) => {
            try {
                await axios.delete(`http://localhost:5000/api/services/${id}`);
                setServices(services.filter(s => s._id !== id));
            } catch (error) {
                console.error("Error deleting service:", error);
            }
        },
        toggleServiceActive: async (id) => {
            const service = services.find(s => s._id === id);
            if (service) {
                try {
                    const response = await axios.put(`http://localhost:5000/api/services/${id}`, { ...service, active: !service.active });
                    setServices(services.map(s => s._id === id ? response.data : s));
                } catch (error) {
                    console.error("Error toggling service status:", error);
                }
            }
        },

        addCategory: async (category) => {
            try {
                const imageUrl = await handleImageUpload(category.image);
                const categoryWithUrl = { ...category, image: imageUrl };
                const response = await axios.post('http://localhost:5000/api/categories', categoryWithUrl);
                setCategories([...categories, response.data]);
            } catch (error) {
                console.error("Error adding category:", error);
            }
        },
        updateCategory: async (id, updatedData) => {
            try {
                let imageUrl = updatedData.image;
                if (updatedData.image && updatedData.image.startsWith('data:image')) {
                    imageUrl = await handleImageUpload(updatedData.image);
                }
                const dataWithUrl = { ...updatedData, image: imageUrl };
                const response = await axios.put(`http://localhost:5000/api/categories/${id}`, dataWithUrl);
                setCategories(categories.map(c => c._id === id ? response.data : c));
            } catch (error) {
                console.error("Error updating category:", error);
            }
        },
        deleteCategory: async (id) => {
            try {
                await axios.delete(`http://localhost:5000/api/categories/${id}`);
                setCategories(categories.filter(c => c._id !== id));
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        },
        toggleCategoryActive: async (id) => {
            const category = categories.find(c => c._id === id);
            if (category) {
                try {
                    const response = await axios.put(`http://localhost:5000/api/categories/${id}`, { ...category, active: !category.active });
                    setCategories(categories.map(c => c._id === id ? response.data : c));
                } catch (error) {
                    console.error("Error toggling category status:", error);
                }
            }
        },


        addMenuItem,
        addBulkMenuItems,
        updateMenuItem,
        deleteMenuItem,
        toggleMenuItemActive,

        addOrder,
        updateOrder,
        updateOrderStatus,
        deleteOrder,

        blogs,
        loadingBlogs,
        addBlog: async (blog) => {
            try {
                const imageUrl = await handleImageUpload(blog.image);
                const blogWithUrl = { ...blog, image: imageUrl };
                const response = await axios.post('http://localhost:5000/api/blogs/addblog', blogWithUrl);
                setBlogs([...blogs, response.data]);
            } catch (error) {
                console.error("Error adding blog:", error);
            }
        },
        updateBlog: async (id, updatedData) => {
            try {
                let imageUrl = updatedData.image;
                if (updatedData.image && updatedData.image.startsWith('data:image')) {
                    imageUrl = await handleImageUpload(updatedData.image);
                }
                const dataWithUrl = { ...updatedData, image: imageUrl };
                const response = await axios.put(`http://localhost:5000/api/blogs/editblog/${id}`, dataWithUrl);
                setBlogs(blogs.map(blog => blog._id === id ? response.data : blog));
            } catch (error) {
                console.error("Error updating blog:", error);
            }
        },
        deleteBlog: async (id) => {
            try {
                await axios.delete(`http://localhost:5000/api/blogs/deleteblog/${id}`);
                setBlogs(blogs.filter(blog => blog._id !== id));
            } catch (error) {
                console.error("Error deleting blog:", error);
            }
        },


        popularItems,
        loadingPopularItems,
        addPopularItem: async (item) => {
            try {
                const imageUrl = await handleImageUpload(item.image);
                const itemWithUrl = { ...item, image: imageUrl };
                const response = await axios.post('http://localhost:5000/api/food', itemWithUrl);
                setPopularItems([...popularItems, response.data]);
            } catch (error) {
                console.error("Error adding popular item:", error);
            }
        },
        updatePopularItem: async (id, updatedData) => {
            try {
                let imageUrl = updatedData.image;
                if (updatedData.image && updatedData.image.startsWith('data:image')) {
                    imageUrl = await handleImageUpload(updatedData.image);
                }
                const dataWithUrl = { ...updatedData, image: imageUrl };
                const response = await axios.put(`http://localhost:5000/api/food/${id}`, dataWithUrl);
                setPopularItems(popularItems.map(item => item._id === id ? response.data : item));
            } catch (error) {
                console.error("Error updating popular item:", error);
            }
        },
        deletePopularItem: async (id) => {
            try {
                await axios.delete(`http://localhost:5000/api/food/${id}`);
                setPopularItems(popularItems.filter(item => item._id !== id));
            } catch (error) {
                console.error("Error deleting popular item:", error);
            }
        },


        rangeMenus,
        addRangeMenu: (menu) => {
            const newMenu = {
                ...menu,
                id: Date.now()
            };
            setRangeMenus([...rangeMenus, newMenu]);
        },
        updateRangeMenu: (id, updatedData) => {
            setRangeMenus(rangeMenus.map(menu => menu.id === id ? { ...menu, ...updatedData } : menu));
        },
        deleteRangeMenu: (id) => {
            setRangeMenus(rangeMenus.filter(menu => menu.id !== id));
        },


        youtubeLinks,
        addYoutubeLink: (link) => {
            const newLink = {
                ...link,
                id: Date.now()
            };
            setYoutubeLinks([...youtubeLinks, newLink]);
        },
        deleteYoutubeLink: (id) => {
            setYoutubeLinks(youtubeLinks.filter(link => link.id !== id));
        },


        getMenuItemById,
        getOrderById,
        getMenuCategoryById
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
