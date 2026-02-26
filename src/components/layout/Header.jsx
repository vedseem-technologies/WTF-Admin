import { useLocation } from "react-router-dom";
import { CalendarDays } from "lucide-react";

const pageMeta = {
  "/": { title: "Dashboard", subtitle: "Overview of your catering business" },
  "/occasions": {
    title: "Occasions Management",
    subtitle: "Manage occasions for catering services",
  },
  "/services": {
    title: "Services Management",
    subtitle: "Manage service types",
  },
  "/categories": {
    title: "Categories Management",
    subtitle: "Manage service categories",
  },
  "/menu-categories": {
    title: "Menu Categories",
    subtitle: "Organize menu item categories",
  },
  "/menu-items": {
    title: "Menu Items",
    subtitle: "Manage menu items and pricing",
  },
  "/orders": {
    title: "Orders Management",
    subtitle: "View and manage all orders",
  },
  "/blogs": {
    title: "Blogs Management",
    subtitle: "Manage food-related blog posts",
  },
  "/popular-items": {
    title: "Popular Items",
    subtitle: "Manage your most popular menu items",
  },
  "/range-menus": {
    title: "Range Menus",
    subtitle: "Manage menu items across different ranges",
  },
  "/testimonials": {
    title: "Testimonials",
    subtitle: "Manage customer testimonials",
  },
  "/events": {
    title: "Events Management",
    subtitle: "Manage upcoming and past events",
  },
  "/youtube": {
    title: "YouTube Videos",
    subtitle: "Manage YouTube video links",
  },
  "/carousel": { title: "Carousel", subtitle: "Manage homepage carousel" },
  "/banner": { title: "Banner", subtitle: "Manage banner content" },
};

const Header = () => {
  const location = useLocation();

  const meta = location.pathname.startsWith("/orders/")
    ? {
        title: "Order Details",
        subtitle: "Complete order information and management",
      }
    : pageMeta[location.pathname] || { title: "Admin Panel", subtitle: "" };

  return (
    <header className="fixed top-0 left-[260px] right-0 h-[70px] bg-white border-b border-border z-[1020] shadow-sm">
      <div className="h-full px-8 flex items-center justify-between">
        {/* Left */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-secondary leading-none mb-1">
            {meta.title}
          </h1>
          {meta.subtitle && (
            <p className="text-sm text-gray-500 leading-none">
              {meta.subtitle}
            </p>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="w-px h-8 bg-border" />
          <div className="flex items-center gap-2 px-3 py-2 bg-bg-hover rounded-lg text-primary">
            <CalendarDays size={20} />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-secondary leading-none">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="text-[11px] text-gray-500 leading-none">
                {new Date().toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
