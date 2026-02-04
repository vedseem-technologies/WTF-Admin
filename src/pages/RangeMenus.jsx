import { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/common/Modal';
import ImageUpload from '../components/common/ImageUpload';
import { getThumbnail } from '../utils/imageOptimizer';
import './RangeMenus.css';

const MENU_RANGES = [
    'Paneer Range',
    'Fast Food Range',
    'Chinese Range'
];

const RangeMenus = () => {
    const { rangeMenus, loadingRangeMenus, addRangeMenu, updateRangeMenu, deleteRangeMenu } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        rating: '',
        range: MENU_RANGES[0]
    });
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenModal = (menu = null) => {
        if (menu) {
            setEditingMenu(menu);
            setFormData({
                name: menu.name,
                image: menu.image,
                rating: menu.rating,
                range: menu.range
            });
        } else {
            setEditingMenu(null);
            setFormData({
                name: '',
                image: '',
                rating: '',
                range: MENU_RANGES[0]
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMenu(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingMenu) {
            updateRangeMenu(editingMenu._id, formData);
        } else {
            addRangeMenu(formData);
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this range menu item?')) {
            deleteRangeMenu(id);
        }
    };

    const filteredMenus = rangeMenus.filter(menu =>
        menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        menu.range.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <h2 className="page-title-big">📋 Range Menus</h2>
                    <p className="page-description">Manage menu items across different ranges</p>
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
                    placeholder="🔍 Search range menus..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="table-container">
                {loadingRangeMenus ? (
                    <div className="loading-state">
                        <h3>...loading</h3>
                    </div>
                ) : filteredMenus.length > 0 ? (
                    <table className="table range-menus-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Range</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMenus.map((menu) => (
                                <tr key={menu._id}>
                                    <td>
                                        <div className="menu-image-cell">
                                            <img
                                                src={getThumbnail(menu.image)}
                                                alt={menu.name}
                                                loading="lazy"
                                                referrerPolicy="no-referrer"
                                                crossOrigin="anonymous"
                                            />
                                        </div>
                                    </td>
                                    <td className="menu-name">{menu.name}</td>
                                    <td>
                                        <span className="range-badge">{menu.range}</span>
                                    </td>
                                    <td>
                                        <span className="rating-display">{menu.rating} ⭐</span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-icon btn-edit"
                                                onClick={() => handleOpenModal(menu)}
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn-icon btn-delete"
                                                onClick={() => handleDelete(menu._id)}
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
                ) : (
                    <div className="empty-state">
                        <span className="empty-icon">📋</span>
                        <h3>No range menus found</h3>
                        <p>Start by adding your first range menu item</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingMenu ? 'Edit Range Menu' : 'Add New Range Menu'}
            >
                <form onSubmit={handleSubmit} className="range-menu-form">
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
                        <label className="form-label">Rating *</label>
                        <div className="rating-input-wrapper">
                            <input
                                type="number"
                                className="form-control rating-input"
                                placeholder="0.0"
                                value={formData.rating}
                                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                                required
                                min="0"
                                max="5"
                                step="0.1"
                            />
                            <span className="rating-star">⭐</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Menu Range *</label>
                        <select
                            className="form-select"
                            value={formData.range}
                            onChange={(e) => setFormData({ ...formData, range: e.target.value })}
                            required
                        >
                            {MENU_RANGES.map((range) => (
                                <option key={range} value={range}>{range}</option>
                            ))}
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-outline" onClick={handleCloseModal}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editingMenu ? 'Update Menu' : 'Add Menu'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div >
    );
};

export default RangeMenus;
