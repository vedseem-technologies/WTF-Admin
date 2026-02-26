import { useState, useEffect } from "react";
import axios from "axios";
import StatsCard from "../../../components/ui/StatsCard";
import { useNavigate } from "react-router-dom";
import {
  Package,
  CalendarDays,
  IndianRupee,
  Utensils,
  PartyPopper,
  Hourglass,
  ClipboardList,
} from "lucide-react";

const statusColorMap = {
  pending: "warning",
  confirmed: "info",
  processing: "primary",
  completed: "success",
  cancelled: "danger",
};

const badgeClass = {
  primary: "bg-primary-light text-primary",
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  danger: "bg-danger-light text-danger",
  info: "bg-info-light text-info",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    activeMenuItems: 0,
    activeOccasions: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/orders/stats`,
        );
        if (response.data?.success) {
          const d = response.data.data;
          setStats({
            totalOrders: d.totalOrders,
            todayOrders: d.todayOrders,
            pendingOrders: d.pendingOrders,
            totalRevenue: d.totalRevenue,
            activeMenuItems: d.activeMenuItems,
            activeOccasions: d.activeOccasions,
          });
          setRecentOrders(d.recentOrders || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const displayStatus = (status) => {
    if (!status) return "";
    const map = {
      processing: "In Preparation",
      completed: "Delivered",
    };
    return (
      map[status.toLowerCase()] ||
      status.charAt(0).toUpperCase() + status.slice(1)
    );
  };

  return (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <StatsCard
          icon={<Package size={24} />}
          title="Total Orders"
          value={loading ? "..." : stats.totalOrders}
          subtitle="All time"
          color="primary"
        />
        <StatsCard
          icon={<CalendarDays size={24} />}
          title="Today's Orders"
          value={loading ? "..." : stats.todayOrders}
          subtitle="Last 24 hours"
          color="info"
        />
        <StatsCard
          icon={<IndianRupee size={24} />}
          title="Total Revenue"
          value={loading ? "..." : formatCurrency(stats.totalRevenue)}
          subtitle="Total earnings"
          color="success"
        />
        <StatsCard
          icon={<Utensils size={24} />}
          title="Active Items"
          value={loading ? "..." : stats.activeMenuItems}
          subtitle="Menu items"
          color="warning"
        />
        <StatsCard
          icon={<PartyPopper size={24} />}
          title="Active Occasions"
          value={loading ? "..." : stats.activeOccasions}
          subtitle="Available occasions"
          color="primary"
        />
        <StatsCard
          icon={<Hourglass size={24} />}
          title="Pending Orders"
          value={loading ? "..." : stats.pendingOrders}
          subtitle="Awaiting confirmation"
          color="danger"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-secondary flex items-center">
              <ClipboardList className="text-primary mr-2" size={20} />
              Recent Orders
            </h3>
            <p className="text-sm text-gray-500">Latest customer orders</p>
          </div>
          <button
            onClick={() => navigate("/orders")}
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-gray-500">Loading orders...</div>
            </div>
          ) : recentOrders.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bg-hover border-b-2 border-border">
                  {[
                    "Order ID",
                    "Customer",
                    "Date",
                    "Amount",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const color =
                    statusColorMap[order.status?.toLowerCase()] || "info";
                  return (
                    <tr
                      key={order._id}
                      className="border-b border-gray-50 hover:bg-bg-hover cursor-pointer transition-colors last:border-0"
                      onClick={() => navigate(`/orders/${order.orderId}`)}
                    >
                      <td className="px-5 py-3 font-semibold text-primary text-sm">
                        #{order.orderId}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600">
                        {order.userId?.firstName} {order.userId?.lastName}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3 font-semibold text-sm text-secondary">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${badgeClass[color]}`}
                        >
                          {displayStatus(order.status)}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/orders/${order.orderId}`);
                          }}
                          className="px-3 py-1.5 text-xs border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex items-center justify-center h-40 text-gray-400">
              No orders yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
