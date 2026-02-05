import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [sidebarSearch, setSidebarSearch] = useState("");

  const topItems = [{ path: "/", icon: "📊", label: "Dashboard" }];

  const bottomItems = [
    { path: "/menu-items", icon: "🍕", label: "Menu Items" },
    { path: "/blogs", icon: "📝", label: "Blogs" },
    { path: "/popular-items", icon: "⭐", label: "Popular Items" },
    { path: "/range-menus", icon: "📋", label: "Range Menus" },
    { path: "/testimonials", icon: "💬", label: "Testimonials" },
    { path: "/events", icon: "📅", label: "Events" },
    { path: "/youtube", icon: "🎥", label: "YouTube" },
    { path: "/carousel", icon: "📷", label: "Carousel" },
    { path: "/banner", icon: "🖼️", label: "Banner" },
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

      <nav className="sidebar-nav">
        {topItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            end={item.path === "/"}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}

        <NavLink
          to="/occasions"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span className="nav-icon">🎉</span>
          <span className="nav-label">Occasions</span>
        </NavLink>

        <NavLink
          to="/services"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span className="nav-icon">🛎️</span>
          <span className="nav-label">Services</span>
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <span className="nav-icon">📂</span>
          <span className="nav-label">Categories</span>
        </NavLink>

        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
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
        <button onClick={logout} className="logout-btn" title="Logout">
          <span className="nav-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: "18px", height: "18px" }}
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
