import { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/common/Modal';
import ImageUpload from '../components/common/ImageUpload';
import './PopularItems.css';

const PopularItems = () => {
    const { popularItems, loadingPopularItems, addPopularItem, updatePopularItem, deletePopularItem } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        description: '',
        price: '',
        rating: 5
    });
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                image: item.image,
                description: item.description,
                price: item.price,
                rating: item.rating
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                image: '',
                description: '',
                price: '',
                rating: 5
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
            updatePopularItem(editingItem._id, formData);
        } else {
            addPopularItem(formData);
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this popular item?')) {
            deletePopularItem(id);
        }
    };

    const filteredItems = popularItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => (b.createdAt || b._id).localeCompare(a.createdAt || a._id)); 

    const renderStars = (rating) => {
        return '⭐'.repeat(rating);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <h2 className="page-title-big">⭐ Popular Items</h2>
                    <p className="page-description">Manage your most popular menu items</p>
                </div>
                <div className="header-buttons">
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        + Add New
                    </button>
                </div>
            </div>

            <div className="page-filters">
                <input
                    type="text"
                    className="form-control search-input"
                    placeholder="🔍 Search popular items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="table-container">

                <table className="table popular-items-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item) => (
                            <tr key={item._id}>
                                <td>
                                    <div className="item-image-cell">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            referrerPolicy="no-referrer"
                                            crossOrigin="anonymous"
                                        />
                                    </div>
                                </td>
                                <td className="item-name">{item.name}</td>
                                <td className="item-description">{item.description}</td>
                                <td className="item-price">₹{item.price}</td>
                                <td>
                                    <span className="rating-stars">{renderStars(item.rating)}</span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn-icon btn-edit"
                                            onClick={() => handleOpenModal(item)}
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="btn-icon btn-delete"
                                            onClick={() => handleDelete(item._id)}
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


                {
                    loadingPopularItems ? (
                        <div className="loading-state">
                            <p>...loading</p>
                        </div>
                    ) : !loadingPopularItems && filteredItems.length === 0 && (
                        <div className="empty-state">
                            <span className="empty-icon">⭐</span>
                            <h3>No popular items found</h3>
                            <p>Start by adding your first popular item</p>
                        </div>
                    )
                }
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingItem ? 'Edit Popular Item' : 'Add New Popular Item'}
            >
                <form onSubmit={handleSubmit} className="popular-item-form">
                    <ImageUpload
                        value={formData.image}
                        onChange={(value) => setFormData({ ...formData, image: value })}
                        label="Item Image *"
                    />

                    <div className="form-group">
                        <label className="form-label">Name *</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter item name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description *</label>
                        <textarea
                            className="form-control"
                            placeholder="Enter item description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows="4"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Price (₹) *</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="e.g., 250"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                required
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Rating *</label>
                            <select
                                className="form-select"
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                required
                            >
                                <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
                                <option value="4">⭐⭐⭐⭐ (4 stars)</option>
                                <option value="3">⭐⭐⭐ (3 stars)</option>
                                <option value="2">⭐⭐ (2 stars)</option>
                                <option value="1">⭐ (1 star)</option>
                            </select>
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
        </div>
    );
};

export default PopularItems;
