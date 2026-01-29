import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    const [sidebarSearch, setSidebarSearch] = useState('');
    const [isMenuSummaryOpen, setIsMenuSummaryOpen] = useState(location.pathname.startsWith('/menu/'));

    const menuItems = [
        { path: '/', icon: '📊', label: 'Dashboard' },
        { path: '/occasions', icon: '🎉', label: 'Occasions' },
        { path: '/services', icon: '🍽️', label: 'Services' },
        { path: '/categories', icon: '📁', label: 'Categories' },
        { path: '/menu-items', icon: '🍕', label: 'Menu Items' },
        { path: '/blogs', icon: '📝', label: 'Blogs' },
        { path: '/popular-items', icon: '⭐', label: 'Popular Items' },
        { path: '/range-menus', icon: '📋', label: 'Range Menus' },
        { path: '/youtube', icon: '🎥', label: 'YouTube' },
    ];

    const summaryCategories = [
        { path: '/menu/starter', icon: '🥗', label: 'Starter' },
        { path: '/menu/main-course', icon: '🍛', label: 'Main Course' },
        { path: '/menu/dessert', icon: '🍰', label: 'Dessert' },
        { path: '/menu/bread-rice', icon: '🍚', label: 'Rice and Bread' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <div className="logo-icon">🍴</div>
                    <div className="logo-text">
                        <h3>WTF Admin</h3>
                        <p>Catering Panel</p>
                    </div>
                </div>
            </div>

            {/* <div className="sidebar-search-container">
                <input
                    type="text"
                    className="sidebar-search"
                    placeholder="🔍 Search..."
                    value={sidebarSearch}
                    onChange={(e) => setSidebarSearch(e.target.value)}
                />
            </div> */}

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? 'nav-item active' : 'nav-item'
                        }
                        end={item.path === '/'}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}

                {/* Menu Summary Dropdown */}
                <div className={`nav-dropdown ${location.pathname.startsWith('/menu/') ? 'active' : ''}`}>
                    <div
                        className="nav-item dropdown-toggle"
                        onClick={() => setIsMenuSummaryOpen(!isMenuSummaryOpen)}
                    >
                        <span className="nav-icon">📋</span>
                        <span className="nav-label">Menu Summary</span>
                        <span className={`dropdown-arrow ${isMenuSummaryOpen ? 'open' : ''}`}>▾</span>
                    </div>

                    <div className={`dropdown-content ${isMenuSummaryOpen ? 'show' : ''}`}>
                        {summaryCategories.map((subItem) => (
                            <NavLink
                                key={subItem.path}
                                to={subItem.path}
                                className={({ isActive }) =>
                                    isActive ? 'sub-nav-item active' : 'sub-nav-item'
                                }
                            >
                                <span className="nav-icon">{subItem.icon}</span>
                                <span className="nav-label">{subItem.label}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>

                <NavLink
                    to="/orders"
                    className={({ isActive }) =>
                        isActive ? 'nav-item active' : 'nav-item'
                    }
                >
                    <span className="nav-icon">📋</span>
                    <span className="nav-label">Orders</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">👤</div>
                    <div className="user-details">
                        <div className="user-name">Admin User</div>
                        <div className="user-role">Super Admin</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
