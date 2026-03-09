import { useState, useEffect } from "react";
import { ClipboardList, Search, Filter } from "lucide-react";
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
  } = useCursorPagination("/api/orders", {
    limit: 10,
    filters: {
      search: debouncedSearchTerm || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
    },
  });

  const statusColorMap = {
    warning: "bg-warning-light text-warning",
    info: "bg-info-light text-info",
    primary: "bg-primary/10 text-primary",
    success: "bg-success-light text-success",
    danger: "bg-danger-light text-danger",
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "warning",
      confirmed: "info",
      processing: "primary",
      completed: "success",
      cancelled: "danger",
    };
    return colors[status?.toLowerCase()] || "info";
  };

  const displayStatus = (status) => {
    if (!status) return "—";
    const map = { processing: "In Preparation", completed: "Delivered" };
    return (
      map[status.toLowerCase()] ||
      status.charAt(0).toUpperCase() + status.slice(1)
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const dashParts = dateString.split(/[-/]/);
    let dateObj;
    if (dashParts.length === 3 && dashParts[0].length <= 2) {
      dateObj = new Date(`${dashParts[2]}-${dashParts[1]}-${dashParts[0]}`);
    } else {
      dateObj = new Date(dateString);
    }
    if (isNaN(dateObj.getTime())) return dateString;
    return dateObj.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statuses = [
    "pending",
    "confirmed",
    "processing",
    "completed",
    "cancelled",
  ];

  return (
    <div className="p-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
            placeholder="Search by Order ID or customer name…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <select
            className="pl-8 pr-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all appearance-none bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {displayStatus(s)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        {loadingOrders && orders.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Loading orders…</p>
            </div>
          </div>
        ) : orders.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b-2 border-border">
                    {[
                      "Order ID",
                      "Occasion",
                      "Service Type",
                      "Guest Count",
                      "Event Date",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const totalGuests =
                      (order.bookingDetails?.vegGuests || 0) +
                      (order.bookingDetails?.nonVegGuests || 0);
                    const colorKey = getStatusColor(order.status);

                    return (
                      <tr
                        key={order._id}
                        onClick={() => navigate(`/orders/${order.orderId}`)}
                        className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors cursor-pointer last:border-0 group"
                      >
                        {/* Order ID */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="text-sm font-bold text-primary">
                            #{order.orderId}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {formatDate(order.createdAt)}
                          </p>
                        </td>

                        {/* Occasion */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-[#E63946]/10 text-[#E63946] uppercase tracking-wide">
                            {order.entityName ||
                              (order.entityType || "N/A").toUpperCase()}
                          </span>
                        </td>

                        {/* Service Type */}
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-secondary capitalize">
                            {order.entityType === "service"
                              ? "Live Service"
                              : "Full Service Catering"}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {order.userId?.firstName
                              ? `${order.userId.firstName} ${order.userId.lastName || ""}`
                              : "Guest"}
                          </p>
                        </td>

                        {/* Guest Count */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="text-sm font-bold text-secondary">
                            {totalGuests}
                          </p>
                          {totalGuests > 0 && (
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {order.bookingDetails?.vegGuests || 0} Veg
                              &middot; {order.bookingDetails?.nonVegGuests || 0}{" "}
                              Non-Veg
                            </p>
                          )}
                        </td>

                        {/* Event Date */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <p className="text-sm font-medium text-secondary">
                            {formatDate(order.bookingDetails?.date)}
                          </p>
                          {order.bookingDetails?.time && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {order.bookingDetails.time}
                            </p>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${statusColorMap[colorKey] || "bg-gray-100 text-gray-600"}`}
                          >
                            {displayStatus(order.status)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={handlePrev}
                disabled={!pageInfo.hasPrevPage || loadingOrders}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                ← Previous
              </button>
              <span className="text-sm text-gray-400">
                {loadingOrders && (
                  <span className="animate-pulse">Loading…</span>
                )}
              </span>
              <button
                onClick={handleNext}
                disabled={!pageInfo.hasNextPage || loadingOrders}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                Next →
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <ClipboardList size={52} className="mb-4 text-gray-200" />
            <p className="text-lg font-bold text-secondary mb-1">
              No orders found
            </p>
            <p className="text-sm">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
