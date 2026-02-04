import { useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        const titles = {
            '/': 'Dashboard',
            '/occasions': 'Occasions Management',
            '/services': 'Services Management',
            '/categories': 'Categories Management',
            '/menu-categories': 'Menu Categories',
            '/menu-items': 'Menu Items',
            '/orders': 'Orders Management'
        };

        if (path.startsWith('/orders/')) {
            return 'Order Details';
        }

        return titles[path] || 'Admin Panel';
    };

    const getPageSubtitle = () => {
        const path = location.pathname;
        const subtitles = {
            '/': 'Overview of your catering business',
            '/occasions': 'Manage occasions for catering services',
            '/services': 'Manage service types',
            '/categories': 'Manage service categories',
            '/menu-categories': 'Organize menu item categories',
            '/menu-items': 'Manage menu items and pricing',
            '/orders': 'View and manage all orders'
        };

        if (path.startsWith('/orders/')) {
            return 'Complete order information and management';
        }

        return subtitles[path] || '';
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-left">
                    <h1 className="page-title">{getPageTitle()}</h1>
                    <p className="page-subtitle">{getPageSubtitle()}</p>
                </div>

                <div className="header-right">
                    <button className="header-btn" title="Notifications">
                        <span className="header-icon">🔔</span>
                        <span className="notification-badge">3</span>
                    </button>

                    <button className="header-btn" title="Settings">
                        <span className="header-icon">⚙️</span>
                    </button>

                    <div className="header-divider"></div>

                    <div className="header-date">
                        <span className="date-icon">📅</span>
                        <div className="date-info">
                            <div className="current-date">
                                {new Date().toLocaleDateString('en-IN', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="current-time">
                                {new Date().toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
