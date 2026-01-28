import StatsCard from '../components/common/StatsCard';
import { useData } from '../context/DataContext';
import { getOrderStats } from '../utils/mockData';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const { orders, menuItems, occasions } = useData();
    const navigate = useNavigate();
    const stats = getOrderStats();

    // Get recent orders (last 10)
    const recentOrders = [...orders]
        .sort((a, b) => b.id - a.id)
        .slice(0, 10);

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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-container">
                {/* Stats Section */}
                <section className="stats-section">
                    <div className="stats-grid">
                        <StatsCard
                            icon="📦"
                            title="Total Orders"
                            value={stats.totalOrders}
                            subtitle="All time"
                            trend={12}
                            color="primary"
                        />
                        <StatsCard
                            icon="🎯"
                            title="Today's Orders"
                            value={stats.todayOrders}
                            subtitle="Last 24 hours"
                            trend={-5}
                            color="info"
                        />
                        <StatsCard
                            icon="💰"
                            title="Total Revenue"
                            value={formatCurrency(stats.totalRevenue)}
                            subtitle="Total earnings"
                            trend={18}
                            color="success"
                        />
                        <StatsCard
                            icon="🍽️"
                            title="Active Items"
                            value={stats.activeItems}
                            subtitle="Menu items"
                            color="warning"
                        />
                        <StatsCard
                            icon="🎉"
                            title="Active Occasions"
                            value={stats.activeOccasions}
                            subtitle="Available occasions"
                            color="primary"
                        />
                        <StatsCard
                            icon="⏳"
                            title="Pending Orders"
                            value={stats.pendingOrders}
                            subtitle="Awaiting confirmation"
                            color="danger"
                        />
                    </div>
                </section>


                {/* Recent Orders Section */}
                <section className="orders-section">
                    <div className="card">
                        <div className="card-header">
                            <div>
                                <h3 className="card-title">📋 Recent Orders</h3>
                                <p className="card-subtitle">Latest customer orders</p>
                            </div>
                            <button className="btn btn-outline btn-sm" onClick={() => navigate('/orders')}>
                                View All
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Occasion</th>
                                            <th>Guests</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} onClick={() => navigate(`/orders/${order.id}`)}>
                                                <td className="font-semibold">#{order.id}</td>
                                                <td>{order.customer.name}</td>
                                                <td>{order.occasion}</td>
                                                <td>{order.guests} guests</td>
                                                <td className="font-semibold">{formatCurrency(order.total)}</td>
                                                <td>
                                                    <span className={`badge badge-${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline"
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
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
