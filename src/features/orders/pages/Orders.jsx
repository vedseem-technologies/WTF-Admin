import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../../context/DataContext";
import "./Orders.css";

const Orders = () => {
  const { orders, occasions } = useData();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      Pending: "warning",
      Confirmed: "info",
      "In Preparation": "primary",
      Delivered: "success",
      Cancelled: "danger",
    };
    return colors[status] || "info";
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
    "Pending",
    "Confirmed",
    "In Preparation",
    "Delivered",
    "Cancelled",
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-content">
          <h2 className="page-title-big">📋 Orders Management</h2>
          <p className="page-description">
            View and manage all customer orders
          </p>
        </div>
        <div className="orders-stats">
          <div className="stat-item">
            <span className="stat-label">Total</span>
            <span className="stat-value">{orders.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pending</span>
            <span className="stat-value text-warning">
              {orders.filter((o) => o.status === "Pending").length}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Delivered</span>
            <span className="stat-value text-success">
              {orders.filter((o) => o.status === "Delivered").length}
            </span>
          </div>
        </div>
      </div>

      <div className="page-filters orders-filters">
        <input
          type="text"
          className="form-control search-input"
          placeholder="🔍 Search by order ID or customer name..."
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
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="table orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Customer</th>
              <th>Event Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="clickable-row"
              >
                <td className="font-semibold text-primary">#{order.id}</td>
                <td>{formatDate(order.orderDate)}</td>
                <td>
                  <div className="customer-cell">
                    <div className="customer-name">{order.customer.name}</div>
                    <div className="customer-phone">{order.customer.phone}</div>
                  </div>
                </td>
                <td>{formatDate(order.eventDate)}</td>
                <td className="font-semibold">{formatCurrency(order.total)}</td>
                <td>
                  <span
                    className={`badge badge-${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/orders/${order.id}`);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <h3>No orders found</h3>
          <p>Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default Orders;
