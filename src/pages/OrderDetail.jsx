import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import './OrderDetail.css';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getOrderById, updateOrderStatus, getMenuItemById, getMenuCategoryById } = useData();

    const order = getOrderById(id);

    if (!order) {
        return (
            <div className="page-container">
                <div className="empty-state">
                    <span className="empty-icon">📋</span>
                    <h3>Order not found</h3>
                    <button className="btn btn-primary" onClick={() => navigate('/orders')}>
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'warning',
            'Confirmed': 'info',
            'In Preparation': 'primary',
            'Delivered': 'success',
            'Cancelled': 'danger'
        };
        return colors[status] || 'info';
    };

    const handleStatusChange = (newStatus) => {
        updateOrderStatus(order.id, newStatus);
    };

    // Group items by category
    const groupedItems = {};
    order.items.forEach(orderItem => {
        const menuItem = getMenuItemById(orderItem.id);
        if (menuItem) {
            const category = getMenuCategoryById(menuItem.category);
            const categoryName = category ? category.name : 'Other';

            if (!groupedItems[categoryName]) {
                groupedItems[categoryName] = [];
            }

            groupedItems[categoryName].push({
                ...menuItem,
                quantity: orderItem.quantity
            });
        }
    });

    return (
        <div className="page-container">
            <div className="order-detail-header">
                <button className="btn btn-outline" onClick={() => navigate('/orders')}>
                    ← Back to Orders
                </button>
                <div className="order-header-info">
                    <h2 className="page-title-big">Order #{order.id}</h2>
                    <span className={`badge badge-lg badge-${getStatusColor(order.status)}`}>
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
                            <span className="info-value">{order.customer.name}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Phone</span>
                            <span className="info-value">{order.customer.phone}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Email</span>
                            <span className="info-value">{order.customer.email}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Address</span>
                            <span className="info-value">{order.customer.address}</span>
                        </div>
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
                            <span className="info-value font-semibold">{order.guests} guests</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Event Date</span>
                            <span className="info-value font-semibold">{formatDate(order.eventDate)}</span>
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
                            <div className={`timeline-item ${['Pending', 'Confirmed', 'In Preparation', 'Delivered'].includes(order.status) ? 'completed' : ''}`}>
                                <div className="timeline-dot"></div>
                                <div className="timeline-label">Pending</div>
                            </div>
                            <div className={`timeline-item ${['Confirmed', 'In Preparation', 'Delivered'].includes(order.status) ? 'completed' : ''}`}>
                                <div className="timeline-dot"></div>
                                <div className="timeline-label">Confirmed</div>
                            </div>
                            <div className={`timeline-item ${['In Preparation', 'Delivered'].includes(order.status) ? 'completed' : ''}`}>
                                <div className="timeline-dot"></div>
                                <div className="timeline-label">In Preparation</div>
                            </div>
                            <div className={`timeline-item ${order.status === 'Delivered' ? 'completed' : ''}`}>
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
                    <h3 className="detail-card-title">🍽️ Menu Summary (Auto-Generated)</h3>
                </div>
                <div className="detail-card-body">
                    <div className="menu-categories">
                        {Object.keys(groupedItems).map(categoryName => (
                            <div key={categoryName} className="menu-category-section">
                                <h4 className="category-heading">
                                    {categoryName} ({groupedItems[categoryName].length})
                                </h4>
                                <ul className="menu-items-list">
                                    {groupedItems[categoryName].map(item => (
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
                        {order.items.map(orderItem => {
                            const menuItem = getMenuItemById(orderItem.id);
                            if (!menuItem) return null;

                            const totalWeight = (parseFloat(menuItem.portionSize) || 0) * orderItem.quantity;
                            const totalPrice = menuItem.price * orderItem.quantity;

                            return (
                                <div key={orderItem.id} className="breakdown-item">
                                    <div className="breakdown-header">
                                        <span className="breakdown-name">{menuItem.name}</span>
                                        <span className="breakdown-total">{formatCurrency(totalPrice)}</span>
                                    </div>
                                    <div className="breakdown-details">
                                        <span className="breakdown-calc">
                                            {menuItem.portionSize} × {orderItem.quantity} guests = {totalWeight}{menuItem.portionSize.match(/\d+/g) ? 'g' : ''}
                                        </span>
                                        <span className="breakdown-calc">
                                            {formatCurrency(menuItem.price)} × {orderItem.quantity} = {formatCurrency(totalPrice)}
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
                            <span className="total-value">{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className="total-row">
                            <span className="total-label">Service Charges (10%)</span>
                            <span className="total-value">{formatCurrency(order.serviceCharges)}</span>
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
