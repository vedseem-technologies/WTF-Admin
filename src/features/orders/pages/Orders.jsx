import { useState, useEffect } from "react";
import { ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useCursorPagination from "../../../hooks/useCursorPagination";

const Orders = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: orders,
    loading: loadingOrders,
    pageInfo,
    handleNext,
    handlePrev,
    refresh: refreshOrders,
  } = useCursorPagination("/api/orders", {
    limit: 10,
    filters: {
      search: debouncedSearchTerm || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
    },
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: "warning", 
      confirmed: "info",
      processing: "primary", 
      delivered: "success", 
      completed: "success",
      cancelled: "danger",
    };
    return colors[status?.toLowerCase()] || "info";
  };

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const uniqueStatuses = [
    "pending",
    "confirmed",
    "processing",
    "completed",
    "cancelled",
  ];

  return (
    <div className="p-6">
      <div className="mb-1" />

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          className="flex-1 min-w-[200px] px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
          placeholder="Search by order ID or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-3 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          {uniqueStatuses.map((status) => (
            <option key={status} value={status}>
              {displayStatus(status)}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-border overflow-hidden">
        {loadingOrders && orders.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-gray-500">Loading orders...</div>
          </div>
        ) : orders.length > 0 ? (
          <>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bg-hover border-b-2 border-border">
                  {[
                    "Order ID",
                    "Event Details",
                    "Customer",
                    "Address",
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
                {orders.map((order) => (
                  <tr
                    key={order._id || order.id}
                    onClick={() => navigate(`/orders/${order.orderId}`)}
                    className="border-b border-gray-50 hover:bg-bg-hover transition-colors cursor-pointer last:border-0"
                  >
                    <td className="px-5 py-3 font-semibold text-primary text-sm">
                      #{order.orderId}
                      <div className="text-xs text-gray-400 font-normal">
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-sm font-medium text-secondary">
                        {order.bookingDetails?.date || "N/A"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.bookingDetails?.time || ""}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-bold text-sm text-secondary">
                        {order.userId?.firstName} {order.userId?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.userId?.email}
                      </div>
                      <div className="text-xs text-primary">
                        {order.userId?.phone}
                      </div>
                    </td>
                    <td
                      className="px-5 py-3 text-sm text-gray-600 max-w-[140px] truncate"
                      title={order.address}
                    >
                      {order.address || "N/A"}
                    </td>
                    <td className="px-5 py-3 font-semibold text-secondary text-sm">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${{ warning: "bg-warning-light text-warning", info: "bg-info-light text-info", primary: "bg-primary/10 text-primary", success: "bg-success-light text-success", danger: "bg-danger-light text-danger" }[getStatusColor(order.status)] || "bg-gray-100 text-gray-700"}`}
                      >
                        {displayStatus(order.status)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        className="px-3 py-1.5 text-xs bg-primary-gradient text-white rounded-lg font-medium hover:shadow-md transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/orders/${order.orderId}`);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <button
                onClick={handlePrev}
                disabled={!pageInfo.hasPrevPage || loadingOrders}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                ← Previous
              </button>
              <span className="text-sm text-gray-500">
                {loadingOrders ? (
                  <span className="animate-pulse">Loading…</span>
                ) : (
                  ""
                )}
              </span>
              <button
                onClick={handleNext}
                disabled={!pageInfo.hasNextPage || loadingOrders}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                Next →
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ClipboardList size={48} className="mb-4 text-gray-400" />
            <div className="text-xl font-bold text-secondary mb-2">
              No orders found
            </div>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
