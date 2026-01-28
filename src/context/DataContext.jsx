import { createContext, useContext, useState } from 'react';
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
    // State management for all data
    const [occasions, setOccasions] = useState(mockOccasions);
    const [services, setServices] = useState(mockServices);
    const [categories, setCategories] = useState(mockCategories);
    const [menuItems, setMenuItems] = useState(mockMenuItems);
    const [orders, setOrders] = useState(mockOrders);
    const [blogs, setBlogs] = useState(mockBlogs);
    const [popularItems, setPopularItems] = useState(mockPopularItems);
    const [rangeMenus, setRangeMenus] = useState(mockRangeMenus);
    const [youtubeLinks, setYoutubeLinks] = useState(mockYoutubeLinks);

    // OCCASIONS CRUD
    const addOccasion = (occasion) => {
        const newOccasion = {
            ...occasion,
            id: Math.max(...occasions.map(o => o.id), 0) + 1
        };
        setOccasions([...occasions, newOccasion]);
    };

    const updateOccasion = (id, updatedOccasion) => {
        setOccasions(occasions.map(o => o.id === id ? { ...o, ...updatedOccasion } : o));
    };

    const deleteOccasion = (id) => {
        setOccasions(occasions.filter(o => o.id !== id));
    };

    const toggleOccasionActive = (id) => {
        setOccasions(occasions.map(o => o.id === id ? { ...o, active: !o.active } : o));
    };

    // SERVICES CRUD
    const addService = (service) => {
        const newService = {
            ...service,
            id: Math.max(...services.map(s => s.id), 0) + 1
        };
        setServices([...services, newService]);
    };

    const updateService = (id, updatedService) => {
        setServices(services.map(s => s.id === id ? { ...s, ...updatedService } : s));
    };

    const deleteService = (id) => {
        setServices(services.filter(s => s.id !== id));
    };

    // CATEGORIES CRUD
    const addCategory = (category) => {
        const newCategory = {
            ...category,
            id: Math.max(...categories.map(c => c.id), 0) + 1
        };
        setCategories([...categories, newCategory]);
    };

    const updateCategory = (id, updatedCategory) => {
        setCategories(categories.map(c => c.id === id ? { ...c, ...updatedCategory } : c));
    };

    const deleteCategory = (id) => {
        setCategories(categories.filter(c => c.id !== id));
    };



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

    const value = {
        // Data
        occasions,
        services,
        categories,
        menuItems,
        orders,

        // Occasions
        addOccasion,
        updateOccasion,
        deleteOccasion,
        toggleOccasionActive,

        // Services
        addService,
        updateService,
        deleteService,

        // Categories
        addCategory,
        updateCategory,
        deleteCategory,



        // Menu Items
        addMenuItem,
        addBulkMenuItems,
        updateMenuItem,
        deleteMenuItem,
        toggleMenuItemActive,

        // Orders
        addOrder,
        updateOrder,
        updateOrderStatus,
        deleteOrder,

        // Blogs
        blogs,
        addBlog: (blog) => {
            const newBlog = {
                ...blog,
                id: Date.now()
            };
            setBlogs([...blogs, newBlog]);
        },
        updateBlog: (id, updatedData) => {
            setBlogs(blogs.map(blog => blog.id === id ? { ...blog, ...updatedData } : blog));
        },
        deleteBlog: (id) => {
            setBlogs(blogs.filter(blog => blog.id !== id));
        },

        // Popular Items
        popularItems,
        addPopularItem: (item) => {
            const newItem = {
                ...item,
                id: Date.now()
            };
            setPopularItems([...popularItems, newItem]);
        },
        updatePopularItem: (id, updatedData) => {
            setPopularItems(popularItems.map(item => item.id === id ? { ...item, ...updatedData } : item));
        },
        deletePopularItem: (id) => {
            setPopularItems(popularItems.filter(item => item.id !== id));
        },

        // Range Menus
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

        // YouTube Links
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

        // Helpers
        getMenuItemById,
        getOrderById,
        getMenuCategoryById
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
