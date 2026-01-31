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
    const [loadingYoutubeLinks, setLoadingYoutubeLinks] = useState(true);
    const [loadingRangeMenus, setLoadingRangeMenus] = useState(true);
    const [loadingMenuItems, setLoadingMenuItems] = useState(true);
    const [loadingPackages, setLoadingPackages] = useState(true);
    const [progress, setProgress] = useState(0);

    // Fetch Blogs
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoadingBlogs(true);
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/getblogs`);
                setBlogs(response.data);
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
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/food`);
                setPopularItems(response.data);
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
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/occasions`);
                setOccasions(response.data);
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
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/services`);
                setServices(response.data);
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoadingServices(false);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        const fetchYoutubeLinks = async () => {
            try {
                setLoadingYoutubeLinks(true);
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/youtube`);
                setYoutubeLinks(response.data);
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
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/range-menus`);
                setRangeMenus(response.data);
            } catch (error) {
                console.error("Error fetching range menus:", error);
            } finally {
                setLoadingRangeMenus(false);
            }
        };
        fetchRangeMenus();
    }, []);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                setProgress(30);
                setLoadingMenuItems(true);
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/menu-items`);
                setMenuItems(response.data);
                setProgress(100);
            } catch (error) {
                setProgress(100);
            } finally {
                setLoadingMenuItems(false);
            }
        };
        fetchMenuItems();
    }, []);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setLoadingPackages(true);
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/packages`);
                setPackages(response.data);
            } catch (error) {
                console.error("Error fetching packages:", error);
            } finally {
                setLoadingPackages(false);
            }
        };
        fetchPackages();
    }, []);
    const [occasions, setOccasions] = useState([]);
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [orders, setOrders] = useState(mockOrders);

    const [popularItems, setPopularItems] = useState([]);
    const [rangeMenus, setRangeMenus] = useState([]);
    const [youtubeLinks, setYoutubeLinks] = useState([]);
    const [packages, setPackages] = useState([]);




    const addMenuItem = async (menuItem) => {
        try {
            const imageUrl = await handleImageUpload(menuItem.image);
            const itemWithUrl = { ...menuItem, image: imageUrl };
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/menu-items`, itemWithUrl);
            setMenuItems([response.data, ...menuItems]);
        } catch (error) {
            console.error("Error adding menu item:", error);
        }
    };

    const addBulkMenuItems = async (items) => {
        try {
            // Process images if needed (assuming simple URLs for bulk for now)
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/menu-items/bulk`, items);
            setMenuItems([...response.data, ...menuItems]);
        } catch (error) {
            console.error("Error adding bulk menu items:", error);
        }
    };

    const updateMenuItem = async (id, updatedMenuItem) => {
        try {
            let imageUrl = updatedMenuItem.image;
            if (updatedMenuItem.image && updatedMenuItem.image.startsWith('data:image')) {
                imageUrl = await handleImageUpload(updatedMenuItem.image);
            }
            const itemWithUrl = { ...updatedMenuItem, image: imageUrl };
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/menu-items/${id}`, itemWithUrl);
            setMenuItems(menuItems.map(mi => mi._id === id ? response.data : mi));
        } catch (error) {
            console.error("Error updating menu item:", error);
        }
    };

    const deleteMenuItem = async (id) => {
        const originalItems = [...menuItems];
        setMenuItems(menuItems.filter(mi => mi._id !== id));
        try {
            setProgress(30);
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/menu-items/${id}`);
            setProgress(100);
        } catch (error) {
            setMenuItems(originalItems);
            setProgress(100);
        }
    };

    const toggleMenuItemActive = async (id) => {
        const item = menuItems.find(mi => mi._id === id);
        if (item) {
            try {
                const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/menu-items/${id}`, { ...item, active: !item.active });
                setMenuItems(menuItems.map(mi => mi._id === id ? response.data : mi));
            } catch (error) {
                console.error("Error toggling menu item status:", error);
            }
        }
    };

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
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, { image });
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
        orders,

        // Occasions
        loadingOccasions,
        addOccasion: async (occasion) => {
            try {
                const imageUrl = await handleImageUpload(occasion.image);
                const occasionWithUrl = { ...occasion, image: imageUrl };
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/occasions`, occasionWithUrl);
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
                const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/occasions/${id}`, dataWithUrl);
                setOccasions(occasions.map(o => o._id === id ? response.data : o));
            } catch (error) {
                console.error("Error updating occasion:", error);
            }
        },
        deleteOccasion: async (id) => {
            try {
                setProgress(30);
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/occasions/${id}`);
                setOccasions(occasions.filter(o => o._id !== id));
                setProgress(100);
            } catch (error) {
                console.error("Error deleting occasion:", error);
                setProgress(100);
            }
        },
        toggleOccasionActive: async (id) => {
            const occasion = occasions.find(o => o._id === id);
            if (occasion) {
                try {
                    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/occasions/${id}`, { ...occasion, active: !occasion.active });
                    setOccasions(occasions.map(o => o._id === id ? response.data : o));
                } catch (error) {
                    console.error("Error toggling occasion status:", error);
                }
            }
        },

        // Services
        loadingServices,
        addService: async (service) => {
            try {
                const imageUrl = await handleImageUpload(service.image);
                const serviceWithUrl = { ...service, image: imageUrl };
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/services`, serviceWithUrl);
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
                const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/services/${id}`, dataWithUrl);
                setServices(services.map(s => s._id === id ? response.data : s));
            } catch (error) {
                console.error("Error updating service:", error);
            }
        },
        deleteService: async (id) => {
            try {
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/services/${id}`);
                setServices(services.filter(s => s._id !== id));
            } catch (error) {
                console.error("Error deleting service:", error);
            }
        },
        toggleServiceActive: async (id) => {
            const service = services.find(s => s._id === id);
            if (service) {
                try {
                    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/services/${id}`, { ...service, active: !service.active });
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
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, categoryWithUrl);
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
                const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/categories/${id}`, dataWithUrl);
                setCategories(categories.map(c => c._id === id ? response.data : c));
            } catch (error) {
                console.error("Error updating category:", error);
            }
        },
        deleteCategory: async (id) => {
            try {
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/categories/${id}`);
                setCategories(categories.filter(c => c._id !== id));
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        },
        toggleCategoryActive: async (id) => {
            const category = categories.find(c => c._id === id);
            if (category) {
                try {
                    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/categories/${id}`, { ...category, active: !category.active });
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
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/addblog`, blogWithUrl);
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
                const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/editblog/${id}`, dataWithUrl);
                setBlogs(blogs.map(blog => blog._id === id ? response.data : blog));
            } catch (error) {
                console.error("Error updating blog:", error);
            }
        },
        deleteBlog: async (id) => {
            try {
                setProgress(30);
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/deleteblog/${id}`);
                setBlogs(blogs.filter(blog => blog._id !== id));
                setProgress(100);
            } catch (error) {
                console.error("Error deleting blog:", error);
                setProgress(100);
            }
        },


        popularItems,
        loadingPopularItems,
        addPopularItem: async (item) => {
            try {
                const imageUrl = await handleImageUpload(item.image);
                const itemWithUrl = { ...item, image: imageUrl };
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/food`, itemWithUrl);
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
                const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/food/${id}`, dataWithUrl);
                setPopularItems(popularItems.map(item => item._id === id ? response.data : item));
            } catch (error) {
                console.error("Error updating popular item:", error);
            }
        },
        deletePopularItem: async (id) => {
            try {
                setProgress(30);
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/food/${id}`);
                setPopularItems(popularItems.filter(item => item._id !== id));
                setProgress(100);
            } catch (error) {
                console.error("Error deleting popular item:", error);
                setProgress(100);
            }
        },


        rangeMenus,
        loadingRangeMenus,
        addRangeMenu: async (menu) => {
            try {
                const imageUrl = await handleImageUpload(menu.image);
                const menuWithUrl = { ...menu, image: imageUrl };
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/range-menus`, menuWithUrl);
                setRangeMenus([response.data, ...rangeMenus]);
            } catch (error) {
                console.error("Error adding range menu:", error);
            }
        },
        updateRangeMenu: async (id, updatedData) => {
            try {
                let imageUrl = updatedData.image;
                if (updatedData.image && updatedData.image.startsWith('data:image')) {
                    imageUrl = await handleImageUpload(updatedData.image);
                }
                const dataWithUrl = { ...updatedData, image: imageUrl };
                const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/range-menus/${id}`, dataWithUrl);
                setRangeMenus(rangeMenus.map(m => m._id === id ? response.data : m));
            } catch (error) {
                console.error("Error updating range menu:", error);
            }
        },
        deleteRangeMenu: async (id) => {
            const originalItems = [...rangeMenus];
            setRangeMenus(rangeMenus.filter(m => m._id !== id));
            try {
                setProgress(30);
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/range-menus/${id}`);
                setProgress(100);
            } catch (error) {
                setRangeMenus(originalItems);
                setProgress(100);
            }
        },


        youtubeLinks,
        loadingYoutubeLinks,
        addYoutubeLink: async (link) => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/youtube`, link);
                setYoutubeLinks([response.data, ...youtubeLinks]);
            } catch (error) {
                console.error("Error adding YouTube link:", error);
            }
        },
        deleteYoutubeLink: async (id) => {
            try {
                setProgress(30);
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/youtube/${id}`);
                setYoutubeLinks(youtubeLinks.filter(link => link._id !== id));
                setProgress(100);
            } catch (error) {
                console.error("Error deleting YouTube link:", error);
                setProgress(100);
            }
        },

        packages,
        loadingPackages,
        addPackage: async (pkg) => {
            try {
                const imageUrl = await handleImageUpload(pkg.image);
                const pkgWithUrl = { ...pkg, image: imageUrl };
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/packages`, pkgWithUrl);
                setPackages([response.data, ...packages]);
            } catch (error) {
                console.error("Error adding package:", error);
            }
        },
        deletePackage: async (id) => {
            try {
                setProgress(30);
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/packages/${id}`);
                setPackages(packages.filter(p => p._id !== id));
                setProgress(100);
            } catch (error) {
                console.error("Error deleting package:", error);
                setProgress(100);
            }
        },
        updatePackage: async (id, updatedData) => {
            try {
                const imageUrl = await handleImageUpload(updatedData.image);
                const pkgWithUrl = { ...updatedData, image: imageUrl };
                const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/packages/${id}`, pkgWithUrl);
                setPackages(packages.map(p => p._id === id ? response.data : p));
            } catch (error) {
                console.error("Error updating package:", error);
            }
        },


        getMenuItemById,
        getOrderById,
        getMenuCategoryById,
        progress,
        setProgress
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
