import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../../context/DataContext";
import "./Orders.css";
import useCursorPagination from "../../../hooks/useCursorPagination";

const Orders = () => {
  // orders was previously from useData, now we fetch locally. 
  // DataContext might still supply occasions/services but checking 'Orders.jsx' code it just used 'orders'.
  // Wait, line 7 in original: const { orders, occasions } = useData();
  // It doesn't seem to use 'occasions' in the rendered JSX, only 'orders'.
  // Let me double check if 'occasions' is used.
  // Original code:
  // 7:   const { orders, occasions } = useData();
  // It doesn't use occasions anywhere in the snippet I saw.
  // I'll remove occasions for now, or keep useData for it if needed later.

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
    refresh: refreshOrders
  } = useCursorPagination('/api/orders', {
    limit: 10,
    filters: {
      search: debouncedSearchTerm || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined
    }
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: "warning", // Lowercase from backed usually, but mapped to capitalize in UI? Backend defaults 'pending'.
      // Model says enum: ['pending', 'confirmed', ...].
      // Frontend original uniqueStatuses: ["Pending", "Confirmed"...]. 
      // I should handle case sensitivity.
      // Backend returns lowercase probably.
      // Let's safe guard.
      confirmed: "info",
      processing: "primary", // "In Preparation" in frontend? Model has 'processing'. 
      // Need to map model status to frontend display or vice versa.
      // Model: ['pending', 'confirmed', 'processing', 'completed', 'cancelled']
      // Frontend uniqueStatuses: ["Pending", "Confirmed", "In Preparation", "Delivered", "Cancelled"]
      // I should just format the display status.
      delivered: "success", // Model 'completed'? Or 'delivered'? Model says 'completed'. Frontend says 'Delivered'.
      // I might need to map status for display.
      completed: "success",
      cancelled: "danger",
    };
    return colors[status?.toLowerCase()] || "info";
  };

  const displayStatus = (status) => {
    if (!status) return '';
    const map = {
      'processing': 'In Preparation',
      'completed': 'Delivered'
    };
    return map[status.toLowerCase()] || status.charAt(0).toUpperCase() + status.slice(1);
  }

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
    <div className="page-container">
      <div className="page-header">
        {/* <div className="page-header-content">
          <h2 className="page-title-big">📋 Orders Management</h2>
          <p className="page-description">
            View and manage all customer orders
          </p>
        </div> */}
        {/* Stats removed or need separate API call for counts if not paginated. 
            Frontend had stats based on *all* orders in memory. 
            With pagination we don't have all orders. 
            I will hide stats or just show what's loaded (which is misleading).
            Better to remove simple stats from filtered view or fetch stats separately.
            I'll restore the basic layout but remove stats for now as they require aggregation API.
        */}
      </div>

      <div className="page-filters orders-filters">
        <div className="orders-actions">
          <input
            type="text"
            className="form-control search-input"
            placeholder="🔍 Search by order ID or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="form-select filter-select"
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
        {/* Removing statistics panel as it relies on full dataset */}
      </div>

      <div className="table-container">
        {loadingOrders && orders.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-gray-500">Loading orders...</div>
          </div>
        ) : orders.length > 0 ? (
          <>
            <table className="table orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Event Details</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id || order.id}
                    onClick={() => navigate(`/orders/${order.orderId}`)}
                    className="clickable-row"
                  >
                    <td className="font-semibold text-primary">
                      #{order.orderId}
                      <div className="text-xs text-gray-500">{formatDate(order.createdAt)}</div>
                    </td>
                    <td>
                      <div className="text-sm font-medium">{order.bookingDetails?.date || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{order.bookingDetails?.time || ''}</div>
                    </td>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-name font-bold">{order.userId?.firstName} {order.userId?.lastName}</div>
                        <div className="text-xs text-gray-600">{order.userId?.email}</div>
                        <div className="customer-phone text-xs text-blue-600">{order.userId?.phone}</div>
                      </div>
                    </td>
                    <td className="max-w-xs truncate" title={order.address}>
                      {order.address || 'N/A'}
                    </td>
                    <td className="font-semibold">{formatCurrency(order.totalAmount)}</td>
                    <td>
                      <span
                        className={`badge badge-${getStatusColor(order.status)}`}
                      >
                        {displayStatus(order.status)}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
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
            {/* Pagination Controls */}
            <div className="pagination-controls flex justify-between items-center mt-8 mb-8">
              <button
                onClick={handlePrev}
                disabled={!pageInfo.hasPrevPage || loadingOrders}
                className="btn btn-outline"
              >
                ⬅️ Previous
              </button>
              <span className="text-gray-500">
                {loadingOrders ? 'Loading...' : ''}
              </span>
              <button
                onClick={handleNext}
                disabled={!pageInfo.hasNextPage || loadingOrders}
                className="btn btn-outline"
              >
                Next ➡️
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <h3>No orders found</h3>
            <p>Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
