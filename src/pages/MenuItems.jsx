import { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/common/Modal';
import Toggle from '../components/common/Toggle';
import ImageUpload from '../components/common/ImageUpload';
import './MenuItems.css';

const MENU_CATEGORIES = [
    { id: 1, name: 'Starter', icon: '🥗' },
    { id: 2, name: 'Main Course', icon: '🍛' },
    { id: 3, name: 'Bread & Rice', icon: '🍚' },
    { id: 4, name: 'Dessert', icon: '🍰' },
    { id: 5, name: 'Live Services', icon: '👨‍🍳' }
];

const MenuItems = ({ categoryId = null, titleOverride = null }) => {
    const { menuItems, loadingMenuItems, addMenuItem, addBulkMenuItems, updateMenuItem, deleteMenuItem, toggleMenuItemActive } = useData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        type: 'Veg',
        price: '',
        category: '',
        active: true,
        people: 20,
        portionSize: ''
    });

    const [bulkData, setBulkData] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState(categoryId ? categoryId.toString() : 'all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [activeFilter, setActiveFilter] = useState('all');

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                image: item.image,
                type: item.type,
                price: item.price,
                category: item.category,
                active: item.active,
                people: item.people,
                portionSize: item.portionSize
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                image: '',
                type: 'Veg',
                price: '',
                category: categoryId || MENU_CATEGORIES[0].id,
                active: true,
                people: 20,
                portionSize: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingItem) {
            updateMenuItem(editingItem._id, formData);
        } else {
            addMenuItem(formData);
        }

        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this menu item?')) {
            deleteMenuItem(id);
        }
    };

    const handleBulkAdd = (e) => {
        e.preventDefault();

        // Parse CSV-like bulk data (simple implementation)
        // Format: Name, Category, Type, Price, PortionSize
        const lines = bulkData.trim().split('\n');
        const items = lines.map(line => {
            const [name, catId, type, price, portionSize] = line.split(',').map(s => s.trim());
            return {
                name,
                category: parseInt(catId) || categoryId || MENU_CATEGORIES[0].id,
                type: type || 'Veg',
                price: parseFloat(price) || 0,
                portionSize: portionSize || '100g',
                image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
                active: true,
                people: 20
            };
        });

        addBulkMenuItems(items);
        setBulkData('');
        setIsBulkModalOpen(false);
    };

    const filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || item.category === parseInt(categoryFilter);
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        const matchesActive = activeFilter === 'all' ||
            (activeFilter === 'active' && item.active) ||
            (activeFilter === 'inactive' && !item.active);
        return matchesSearch && matchesCategory && matchesType && matchesActive;
    });

    const getCategoryName = (catId) => {
        const category = MENU_CATEGORIES.find(c => c.id === catId);
        return category ? category.name : 'Unknown';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <h2 className="page-title-big">{titleOverride || '🍕 Menu Items'}</h2>
                    <p className="page-description">Manage {titleOverride ? titleOverride.toLowerCase() : 'all menu items'} with bulk add support</p>
                </div>
                <div className="header-buttons">
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        + Add Item
                    </button>
                </div>
            </div>

            <div className="page-filters">
                <input
                    type="text"
                    className="form-control search-input"
                    placeholder="🔍 Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="table-container">
                {loadingMenuItems ? (
                    <div className="loading-state">
                        <h3>...loading</h3>
                    </div>
                ) : filteredItems.length > 0 ? (
                    <table className="table menu-items-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Item Name</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Portion</th>
                                <th>People</th>
                                <th>Active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        <div className="item-image">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                referrerPolicy="no-referrer"
                                                crossOrigin="anonymous"
                                            />
                                        </div>
                                    </td>
                                    <td className="font-semibold">{item.name}</td>
                                    <td>
                                        <span className={`badge badge-${item.type === 'Veg' ? 'success' : 'danger'}`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="font-semibold">{formatCurrency(item.price)}</td>
                                    <td>{item.portionSize}</td>
                                    <td>{item.people}</td>
                                    <td>
                                        <Toggle
                                            checked={item.active}
                                            onChange={() => toggleMenuItemActive(item._id)}
                                        />
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn btn-sm btn-outline"
                                                onClick={() => handleOpenModal(item)}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(item._id)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <span className="empty-icon">🍕</span>
                        <h3>No menu items found</h3>
                        <p>Try adjusting your filters or add new items</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                size="large"
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Item Name *</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g., Paneer Butter Masala"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Price (₹) *</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="e.g., 180"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Type *</label>
                            <select
                                className="form-select"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                required
                            >
                                <option value="Veg">Veg</option>
                                <option value="Non-Veg">Non-Veg</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Price (₹) *</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="e.g., 180"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Portion Size *</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="e.g., 120g, 1 pc, Per counter"
                                value={formData.portionSize}
                                onChange={(e) => setFormData({ ...formData, portionSize: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Serves (People) *</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="e.g., 20"
                                value={formData.people}
                                onChange={(e) => setFormData({ ...formData, people: parseInt(e.target.value) })}
                                required
                                min="1"
                            />
                        </div>
                    </div>

                    <ImageUpload
                        label="Item Image *"
                        value={formData.image}
                        onChange={(image) => setFormData({ ...formData, image })}
                    />

                    <div className="form-group">
                        <div className="toggle-field">
                            <div>
                                <label className="form-label">Active Status</label>
                                <p className="form-help">Show this item on the menu</p>
                            </div>
                            <Toggle
                                checked={formData.active}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-outline" onClick={handleCloseModal}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editingItem ? 'Update Item' : 'Add Item'}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isBulkModalOpen}
                onClose={() => setIsBulkModalOpen(false)}
                title="Bulk Add Menu Items"
                size="large"
            >
                <form onSubmit={handleBulkAdd}>
                    <div className="form-group">
                        <label className="form-label">Bulk Data (CSV Format)</label>
                        <textarea
                            className="form-textarea"
                            style={{ minHeight: '300px' }}
                            placeholder="Enter items in CSV format (one per line):
Name, CategoryID, Type, Price, PortionSize

Example:
Dal Makhani, 2, Veg, 150, 200g
Chicken Tikka, 1, Non-Veg, 200, 150g
Jeera Rice, 3, Veg, 80, 200g"
                            value={bulkData}
                            onChange={(e) => setBulkData(e.target.value)}
                            required
                        />
                        <p className="form-help">Format: Name, CategoryID, Type (Veg/Non-Veg), Price, PortionSize</p>
                        <p className="form-help">Category IDs: {MENU_CATEGORIES.map(c => `${c.id}=${c.name}`).join(', ')}</p>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-outline" onClick={() => setIsBulkModalOpen(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Add Items
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default MenuItems;
