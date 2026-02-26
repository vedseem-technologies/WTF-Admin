import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  User,
  CreditCard,
  PartyPopper,
  Settings,
  Check,
  Utensils,
  IndianRupee,
  BarChart,
} from "lucide-react";
import "./OrderDetail.css";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    return (
      <div className="page-container flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <ClipboardList size={48} className="mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-4">Order not found</h3>
          <button
            className="px-5 py-2.5 bg-primary-gradient text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
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
    if (!dateString) return "N/A";
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
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setOrder((prev) => ({ ...prev, status: newStatus }));
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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          className="px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all"
          onClick={() => navigate("/orders")}
        >
          ← Back to Orders
        </button>
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-secondary">
            Order #{order.orderId}
          </h2>
          <span
            className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${{ warning: "bg-warning-light text-warning", info: "bg-info-light text-info", primary: "bg-primary/10 text-primary", success: "bg-success-light text-success", danger: "bg-danger-light text-danger" }[getStatusColor(order.status)] || "bg-gray-100 text-gray-700"}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Customer Information */}
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-secondary text-lg flex items-center">
              <User className="text-primary mr-2" size={20} />
              Customer Information
            </h3>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">Name</span>
              <span className="text-sm text-secondary font-bold">
                {order.userId?.firstName} {order.userId?.lastName}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">Phone</span>
              <span className="text-sm text-secondary font-medium">
                {order.userId?.phone || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm text-secondary font-medium break-words">
                {order.userId?.email || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">Delivery Address</span>
              <span className="text-sm text-secondary font-medium">
                {order.address || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-secondary text-lg flex items-center">
              <CreditCard className="text-primary mr-2" size={20} />
              Payment Information
            </h3>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">Method</span>
              <span className="text-sm text-secondary uppercase font-bold">
                {order.paymentMethod || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">Status</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${order.paymentStatus === "paid" ? "bg-success-light text-success" : "bg-warning-light text-warning"}`}
              >
                {order.paymentStatus || "Pending"}
              </span>
            </div>
            {order.zohoTransactionId && (
              <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">Transaction ID</span>
                <span className="text-sm text-secondary font-mono">
                  {order.zohoTransactionId}
                </span>
              </div>
            )}
            {order.paymentGatewayResponse && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs space-y-1">
                <p className="font-semibold text-gray-500">Gateway Details:</p>
                <p>ID: {order.zohoPaymentId || "N/A"}</p>
              </div>
            )}
          </div>
        </div>

        {/* Event Information */}
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-secondary text-lg flex items-center">
              <PartyPopper className="text-primary mr-2" size={20} />
              Event Information
            </h3>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">Occasion</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                {order.occasion}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">Service Type</span>
              <span className="text-sm text-secondary font-medium">
                {order.service}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">Guest Count</span>
              <span className="text-sm text-secondary font-semibold">
                {order.guests} guests
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">Event Date</span>
              <span className="text-sm text-secondary font-semibold">
                {formatDate(order.eventDate)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">Order Date</span>
              <span className="text-sm text-secondary font-medium">
                {formatDate(order.orderDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Order Status Control */}
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden col-span-1 lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-secondary text-lg flex items-center">
              <Settings className="text-primary mr-2" size={20} />
              Order Status Control
            </h3>
          </div>
          <div className="p-6">
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Status
              </label>
              <select
                className="w-full max-w-sm px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
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
            <div className="flex justify-between relative before:absolute before:inset-0 before:top-4 before:-translate-y-1/2 before:h-1 before:bg-gray-100 before:z-0">
              {[
                {
                  label: "Pending",
                  active: [
                    "Pending",
                    "Confirmed",
                    "In Preparation",
                    "Delivered",
                  ].includes(order.status),
                },
                {
                  label: "Confirmed",
                  active: ["Confirmed", "In Preparation", "Delivered"].includes(
                    order.status,
                  ),
                },
                {
                  label: "In Preparation",
                  active: ["In Preparation", "Delivered"].includes(
                    order.status,
                  ),
                },
                { label: "Delivered", active: order.status === "Delivered" },
              ].map((step, idx) => (
                <div
                  key={step.label}
                  className="relative z-10 flex flex-col items-center gap-2"
                >
                  <div
                    className={`w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-colors ${step.active ? "bg-success text-white" : "bg-gray-200"}`}
                  >
                    {step.active && <Check size={16} />}
                  </div>
                  <div
                    className={`text-xs font-semibold ${step.active ? "text-success" : "text-gray-400"}`}
                  >
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-secondary text-lg flex items-center">
            <Utensils className="text-primary mr-2" size={20} />
            Menu Summary (Auto-Generated)
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.keys(groupedItems).map((categoryName) => (
              <div
                key={categoryName}
                className="bg-gray-50/50 rounded-lg p-4 border border-gray-100"
              >
                <h4 className="text-sm font-bold text-secondary mb-3 border-b border-gray-200 pb-2">
                  {categoryName}{" "}
                  <span className="text-xs text-gray-500 font-normal">
                    ({groupedItems[categoryName].length})
                  </span>
                </h4>
                <ul className="space-y-2">
                  {groupedItems[categoryName].map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-700 font-medium">
                        {item.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.type.toLowerCase() === "veg" ? "bg-success-light text-success" : "bg-danger-light text-danger"}`}
                      >
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
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-secondary text-lg flex items-center">
            <IndianRupee className="text-primary mr-2" size={20} />
            Quantity & Price Breakdown
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {order.items.map((orderItem, idx) => {
              const totalPrice = (orderItem.price || 0) * orderItem.quantity;
              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div>
                    <span className="font-bold text-secondary block mb-1">
                      {orderItem.name || "Unknown Item"}
                    </span>
                    <span className="text-sm font-semibold text-gray-500">
                      {formatCurrency(orderItem.price || 0)} ×{" "}
                      {orderItem.quantity}{" "}
                      {orderItem.measurement === "pcs" ? "pcs" : ""} ={" "}
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                  <div className="mt-2 sm:mt-0 text-right">
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Total Amount */}
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden lg:w-1/2 ml-auto">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-secondary text-lg flex items-center">
            <BarChart className="text-primary mr-2" size={20} />
            Total Amount
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-secondary">
                {formatCurrency(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Service Charges (10%)</span>
              <span className="font-semibold text-secondary">
                {formatCurrency(order.serviceCharges)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm pb-3 border-b border-gray-200">
              <span className="text-gray-600">GST (18%)</span>
              <span className="font-semibold text-secondary">
                {formatCurrency(order.gst)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-bold text-gray-800">Grand Total</span>
              <span className="text-xl font-bold text-primary">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
