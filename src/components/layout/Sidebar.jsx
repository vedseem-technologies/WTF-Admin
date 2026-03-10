import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LogOut,
  LayoutDashboard,
  PartyPopper,
  ConciergeBell,
  FolderOpen,
  Pizza,
  FileText,
  Star,
  ClipboardList,
  MessageSquare,
  CalendarDays,
  Youtube,
  Image as ImageIcon,
  Images,
  ShoppingBag,
  UtensilsCrossed,
  User,
  Users,
} from "lucide-react";

const navItems = [
  { path: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard", end: true },
  { path: "/orders", icon: <ShoppingBag size={20} />, label: "Orders" },
  { path: "/occasions", icon: <PartyPopper size={20} />, label: "Occasions" },
  { path: "/services", icon: <ConciergeBell size={20} />, label: "Services" },
  { path: "/categories", icon: <FolderOpen size={20} />, label: "Categories" },
  { path: "/menu-items", icon: <Pizza size={20} />, label: "Menu Items" },
  { path: "/popular-items", icon: <Star size={20} />, label: "Popular Items" },
  { path: "/range-menus", icon: <ClipboardList size={20} />, label: "Range Menus" },
  { path: "/blogs", icon: <FileText size={20} />, label: "Blogs" },
  { path: "/carousel", icon: <ImageIcon size={20} />, label: "Carousel" },
  { path: "/testimonials", icon: <MessageSquare size={20} />, label: "Testimonials" },
  { path: "/youtube", icon: <Youtube size={20} />, label: "YouTube" },
  { path: "/banner", icon: <Images size={20} />, label: "Banner" },
  { path: "/events", icon: <CalendarDays size={20} />, label: "Events" },
  { path: "/admins", icon: <Users size={20} />, label: "Admins" },
];

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-gradient-to-b from-secondary to-secondary-light flex flex-col z-[1030] shadow-2xl overflow-y-auto">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-primary-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/40">
            <UtensilsCrossed size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-none mb-0.5">
              WTF Admin
            </h3>
            <p className="text-xs text-white/60">Catering Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 flex flex-col gap-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `relative flex items-center gap-4 px-8 py-3 text-sm font-medium transition-all duration-200 no-underline group ${isActive
                ? "bg-primary/15 text-white"
                : "text-white/70 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-4/5 bg-primary-gradient rounded-r-full" />
                )}
                <span
                  className={`w-6 flex items-center justify-center transition-transform ${isActive ? "scale-110" : ""}`}
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 bg-white/5 rounded-lg mb-3 hover:bg-white/10 transition-all cursor-pointer">
          <div className="w-10 h-10 bg-primary-gradient rounded-full flex items-center justify-center text-white">
            <User size={20} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-white leading-none mb-0.5">
              Admin User
            </div>
            <div className="text-xs text-white/60">Super Admin</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-400 bg-red-600/10 border border-red-600/20 rounded-lg hover:bg-red-600/20 hover:text-white transition-all cursor-pointer"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
