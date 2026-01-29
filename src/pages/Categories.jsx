import { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/common/Modal';
import Toggle from '../components/common/Toggle';
import ImageUpload from '../components/common/ImageUpload';
import './Occasions.css'; // Reusing same styles

const Categories = () => {
    const { categories, loadingCategories, addCategory, updateCategory, deleteCategory, toggleCategoryActive } = useData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ title: '', image: '', active: true });
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const handleOpenModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ title: category.title, image: category.image, active: category.active });
        } else {
            setEditingCategory(null);
            setFormData({ title: '', image: '', active: true });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ title: '', image: '', active: true });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingCategory) {
            updateCategory(editingCategory._id, formData);
        } else {
            addCategory(formData);
        }

        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            deleteCategory(id);
        }
    };

    const filteredCategories = categories.filter(category => {
        const matchesSearch = category.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'active' && category.active) ||
            (filter === 'inactive' && !category.active);
        return matchesSearch && matchesFilter;
    }).sort((a, b) => (b.createdAt || b._id).localeCompare(a.createdAt || a._id));

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <h2 className="page-title-big">📁 Categories Management</h2>
                    <p className="page-description">Manage service categories for filtering and pricing</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    + Add Category
                </button>
            </div>

            <div className="page-filters">
                <input
                    type="text"
                    className="form-control search-input"
                    placeholder="🔍 Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({categories.length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                        onClick={() => setFilter('active')}
                    >
                        Active ({categories.filter(c => c.active).length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
                        onClick={() => setFilter('inactive')}
                    >
                        Inactive ({categories.filter(c => !c.active).length})
                    </button>
                </div>
            </div>

            {loadingCategories ? (
                <div className="loading-state">
                    <h3>...loading</h3>
                </div>
            ) : filteredCategories.length > 0 ? (
                <div className="occasions-grid">
                    {filteredCategories.map((category) => (
                        <div key={category._id} className={`occasion-card ${!category.active ? 'inactive' : ''}`}>
                            <div className="occasion-image">
                                <img
                                    src={category.image}
                                    alt={category.title}
                                    referrerPolicy="no-referrer"
                                    crossOrigin="anonymous"
                                />
                                {!category.active && <div className="inactive-overlay">Inactive</div>}
                            </div>
                            <div className="occasion-content">
                                <h3 className="occasion-title">{category.title}</h3>
                                <div className="occasion-actions">
                                    <div className="occasion-toggle">
                                        <span className="toggle-label">Active</span>
                                        <Toggle
                                            checked={category.active}
                                            onChange={() => toggleCategoryActive(category._id)}
                                        />
                                    </div>
                                    <div className="occasion-buttons">
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => handleOpenModal(category)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(category._id)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <span className="empty-icon">📁</span>
                    <h3>No categories found</h3>
                    <p>Try adjusting your search criteria</p>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingCategory ? 'Edit Category' : 'Add New Category'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Category Title *</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g., Buffet Only, Live Service, Delivery Only"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <ImageUpload
                        label="Category Image *"
                        value={formData.image}
                        onChange={(image) => setFormData({ ...formData, image })}
                    />

                    <div className="form-group">
                        <div className="toggle-field">
                            <div>
                                <label className="form-label">Active Status</label>
                                <p className="form-help">Show this category on the frontend</p>
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
                            {editingCategory ? 'Update Category' : 'Add Category'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Categories;
