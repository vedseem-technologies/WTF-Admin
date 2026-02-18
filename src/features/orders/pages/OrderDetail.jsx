import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../../context/DataContext";
import "./OrderDetail.css";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    updateOrderStatus,
    getMenuItemById, // Keep for menu item details lookup if needed, assuming DataContext has menu items loaded
    getMenuCategoryById,
  } = useData();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        const data = await response.json();
        if (data.success) {
          setOrder(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return <div className="page-container flex justify-center items-center">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <h3>Order not found</h3>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/orders")}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
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

  const handleStatusChange = async (newStatus) => {
    // updateOrderStatus(order.id, newStatus); // Using context method might be stale or not support string IDs
    // Implement direct update
    try {
      const response = await fetch(`/api/orders/${order.orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Group items by category
  const groupedItems = {};
  order.items.forEach((orderItem) => {
    // Fallback: Use orderItem.name if getMenuItemById fails (menu item might be deleted)
    // Actually, getMenuItemById relies on DataContext. 
    // If orderItem has 'name', use it directly!
    // The backend stores snapshot of item details in `items` array properly now.

    const categoryName = orderItem.category || "Other";

    if (!groupedItems[categoryName]) {
      groupedItems[categoryName] = [];
    }

    groupedItems[categoryName].push(orderItem);
  });

  return (
    <div className="page-container">
      <div className="order-detail-header">
        <button className="btn btn-outline" onClick={() => navigate("/orders")}>
          ← Back to Orders
        </button>
        <div className="order-header-info">
          <h2 className="page-title-big">Order #{order.orderId}</h2>
          <span
            className={`badge badge-lg badge-${getStatusColor(order.status)}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="order-detail-grid">
        {/* Customer Information */}
        <div className="detail-card">
          <div className="detail-card-header">
            <h3 className="detail-card-title">👤 Customer Information</h3>
          </div>
          <div className="detail-card-body">
            <div className="info-row">
              <span className="info-label">Name</span>
              <span className="info-value font-bold">
                {order.userId?.firstName} {order.userId?.lastName}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone</span>
              <span className="info-value">{order.userId?.phone || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value break-words">{order.userId?.email || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Delivery Address</span>
              <span className="info-value">{order.address || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="detail-card">
          <div className="detail-card-header">
            <h3 className="detail-card-title">💳 Payment Information</h3>
          </div>
          <div className="detail-card-body">
            <div className="info-row">
              <span className="info-label">Method</span>
              <span className="info-value uppercase font-bold">{order.paymentMethod || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Status</span>
              <span className={`badge badge-${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}>
                {order.paymentStatus || 'Pending'}
              </span>
            </div>
            {order.zohoTransactionId && (
              <div className="info-row">
                <span className="info-label">Transaction ID</span>
                <span className="info-value font-mono text-sm">{order.zohoTransactionId}</span>
              </div>
            )}
            {order.paymentGatewayResponse && (
              <div className="mt-4 p-2 bg-gray-50 rounded text-xs space-y-1">
                <p className="font-semibold text-gray-500">Gateway Details:</p>
                <p>ID: {order.zohoPaymentId || 'N/A'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Event Information */}
        <div className="detail-card">
          <div className="detail-card-header">
            <h3 className="detail-card-title">🎉 Event Information</h3>
          </div>
          <div className="detail-card-body">
            <div className="info-row">
              <span className="info-label">Occasion</span>
              <span className="info-value">
                <span className="occasion-tag">{order.occasion}</span>
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Service Type</span>
              <span className="info-value">{order.service}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Guest Count</span>
              <span className="info-value font-semibold">
                {order.guests} guests
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Event Date</span>
              <span className="info-value font-semibold">
                {formatDate(order.eventDate)}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Order Date</span>
              <span className="info-value">{formatDate(order.orderDate)}</span>
            </div>
          </div>
        </div>

        {/* Order Status Control */}
        <div className="detail-card status-card">
          <div className="detail-card-header">
            <h3 className="detail-card-title">⚙️ Order Status Control</h3>
          </div>
          <div className="detail-card-body">
            <div className="form-group">
              <label className="form-label">Update Status</label>
              <select
                className="form-select"
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Preparation">In Preparation</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="status-timeline">
              <div
                className={`timeline-item ${["Pending", "Confirmed", "In Preparation", "Delivered"].includes(order.status) ? "completed" : ""}`}
              >
                <div className="timeline-dot"></div>
                <div className="timeline-label">Pending</div>
              </div>
              <div
                className={`timeline-item ${["Confirmed", "In Preparation", "Delivered"].includes(order.status) ? "completed" : ""}`}
              >
                <div className="timeline-dot"></div>
                <div className="timeline-label">Confirmed</div>
              </div>
              <div
                className={`timeline-item ${["In Preparation", "Delivered"].includes(order.status) ? "completed" : ""}`}
              >
                <div className="timeline-dot"></div>
                <div className="timeline-label">In Preparation</div>
              </div>
              <div
                className={`timeline-item ${order.status === "Delivered" ? "completed" : ""}`}
              >
                <div className="timeline-dot"></div>
                <div className="timeline-label">Delivered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Summary */}
      <div className="detail-card menu-summary-card">
        <div className="detail-card-header">
          <h3 className="detail-card-title">
            🍽️ Menu Summary (Auto-Generated)
          </h3>
        </div>
        <div className="detail-card-body">
          <div className="menu-categories">
            {Object.keys(groupedItems).map((categoryName) => (
              <div key={categoryName} className="menu-category-section">
                <h4 className="category-heading">
                  {categoryName} ({groupedItems[categoryName].length})
                </h4>
                <ul className="menu-items-list">
                  {groupedItems[categoryName].map((item) => (
                    <li key={item.id} className="menu-item-entry">
                      <span className="item-name">{item.name}</span>
                      <span className={`item-type ${item.type.toLowerCase()}`}>
                        {item.type}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quantity & Price Breakdown */}
      <div className="detail-card">
        <div className="detail-card-header">
          <h3 className="detail-card-title">💰 Quantity & Price Breakdown</h3>
        </div>
        <div className="detail-card-body">
          <div className="price-breakdown">
            {order.items.map((orderItem, idx) => {
              const totalPrice = (orderItem.price || 0) * orderItem.quantity;

              return (
                <div key={idx} className="breakdown-item">
                  <div className="breakdown-header">
                    <span className="breakdown-name">
                      {orderItem.name || "Unknown Item"}
                    </span>
                    <span className="breakdown-total">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                  <div className="breakdown-details">
                    <span className="breakdown-calc">
                      {orderItem.measurement === 'pcs' ? '' : orderItem.measurement} {orderItem.quantity} {orderItem.measurement === 'pcs' ? 'pcs' : ''}
                    </span>
                    <span className="breakdown-calc">
                      {formatCurrency(orderItem.price || 0)} × {orderItem.quantity} = {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Total Amount */}
      <div className="detail-card total-card">
        <div className="detail-card-header">
          <h3 className="detail-card-title">📊 Total Amount</h3>
        </div>
        <div className="detail-card-body">
          <div className="total-breakdown">
            <div className="total-row">
              <span className="total-label">Subtotal</span>
              <span className="total-value">
                {formatCurrency(order.subtotal)}
              </span>
            </div>
            <div className="total-row">
              <span className="total-label">Service Charges (10%)</span>
              <span className="total-value">
                {formatCurrency(order.serviceCharges)}
              </span>
            </div>
            <div className="total-row">
              <span className="total-label">GST (18%)</span>
              <span className="total-value">{formatCurrency(order.gst)}</span>
            </div>
            <div className="total-row grand-total">
              <span className="total-label">Grand Total</span>
              <span className="total-value">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
