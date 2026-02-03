import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const { occasions, packages, services, categories } = useData();
  const { logout } = useAuth();
  const [sidebarSearch, setSidebarSearch] = useState("");

  const [isOccasionsOpen, setIsOccasionsOpen] = useState(
    location.pathname.startsWith("/occasions"),
  );
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [expandedOccasionId, setExpandedOccasionId] = useState(null);

  const topItems = [{ path: "/", icon: "📊", label: "Dashboard" }];

  const bottomItems = [
    { path: "/menu-items", icon: "🍕", label: "Menu Items" },
    { path: "/blogs", icon: "📝", label: "Blogs" },
    { path: "/popular-items", icon: "⭐", label: "Popular Items" },
    { path: "/range-menus", icon: "📋", label: "Range Menus" },
    { path: "/youtube", icon: "🎥", label: "YouTube" },
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

        <div
          className={`nav-dropdown ${location.pathname.startsWith("/occasions") ? "active" : ""}`}
        >
          <NavLink
            to="/occasions"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setIsOccasionsOpen(!isOccasionsOpen)}
          >
            <span className="nav-icon">🎉</span>
            <span className="nav-label">Occasions</span>
            <span className={`dropdown-arrow ${isOccasionsOpen ? "open" : ""}`}>
              ▾
            </span>
          </NavLink>

          <div className={`dropdown-content ${isOccasionsOpen ? "show" : ""}`}>
            {occasions.map((occasion) => {
              const occasionPackages = packages.filter(
                (p) => p.occasionId === occasion._id,
              );
              const isExpanded = expandedOccasionId === occasion._id;

              return (
                <div key={occasion._id} className="sub-nav-container">
                  <div className="sub-nav-header">
                    <NavLink
                      to={`/occasions/${occasion._id}`}
                      className="sub-nav-item"
                    >
                      <span className="nav-icon">🔹</span>
                      <span className="nav-label">{occasion.title}</span>
                    </NavLink>
                    {occasionPackages.length > 0 && (
                      <span
                        className={`nested-package-arrow ${isExpanded ? "open" : ""}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setExpandedOccasionId(
                            isExpanded ? null : occasion._id,
                          );
                        }}
                      >
                        ▾
                      </span>
                    )}
                  </div>

                  {isExpanded &&
                    occasionPackages.map((pkg) => (
                      <NavLink
                        key={pkg._id}
                        to={`/packages/${pkg._id}`}
                        className="nested-package-item"
                      >
                        <span className="nav-label">{pkg.packageName}</span>
                      </NavLink>
                    ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Services Dropdown */}
        <div
          className={`nav-dropdown ${location.pathname.startsWith("/services") ? "active" : ""}`}
        >
          <NavLink
            to="/services"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setIsServicesOpen(!isServicesOpen)}
          >
            <span className="nav-icon">🛎️</span>
            <span className="nav-label">Services</span>
            <span className={`dropdown-arrow ${isServicesOpen ? "open" : ""}`}>
              ▾
            </span>
          </NavLink>

          <div className={`dropdown-content ${isServicesOpen ? "show" : ""}`}>
            {services.map((service) => (
              <NavLink
                key={service._id}
                to={`/services/${service._id}`}
                className="sub-nav-item"
              >
                <span className="nav-icon">🔹</span>
                <span className="nav-label">{service.title}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Categories Dropdown */}
        <div
          className={`nav-dropdown ${location.pathname.startsWith("/categories") ? "active" : ""}`}
        >
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
          >
            <span className="nav-icon">📂</span>
            <span className="nav-label">Categories</span>
            <span
              className={`dropdown-arrow ${isCategoriesOpen ? "open" : ""}`}
            >
              ▾
            </span>
          </NavLink>

          <div className={`dropdown-content ${isCategoriesOpen ? "show" : ""}`}>
            {categories.map((category) => (
              <NavLink
                key={category._id}
                to={`/categories/${category._id}`}
                className="sub-nav-item"
              >
                <span className="nav-icon">🔹</span>
                <span className="nav-label">{category.title}</span>
              </NavLink>
            ))}
          </div>
        </div>

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
