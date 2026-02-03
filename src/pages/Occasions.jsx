import { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/common/Modal';
import Toggle from '../components/common/Toggle';
import ImageUpload from '../components/common/ImageUpload';
import { getThumbnail } from '../utils/imageOptimizer';
import './Occasions.css';

const Occasions = () => {
    const { occasions, loadingOccasions, addOccasion, updateOccasion, deleteOccasion, toggleOccasionActive } = useData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOccasion, setEditingOccasion] = useState(null);
    const [formData, setFormData] = useState({ title: '', image: '', active: true });
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const handleOpenModal = (occasion = null) => {
        if (occasion) {
            setEditingOccasion(occasion);
            setFormData({ title: occasion.title, image: occasion.image, active: occasion.active });
        } else {
            setEditingOccasion(null);
            setFormData({ title: '', image: '', active: true });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingOccasion(null);
        setFormData({ title: '', image: '', active: true });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingOccasion) {
            updateOccasion(editingOccasion._id, formData);
        } else {
            addOccasion(formData);
        }

        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this occasion?')) {
            deleteOccasion(id);
        }
    };

    const filteredOccasions = occasions.filter(occasion => {
        const matchesSearch = occasion.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'active' && occasion.active) ||
            (filter === 'inactive' && !occasion.active);
        return matchesSearch && matchesFilter;
    }).sort((a, b) => (b.createdAt || b._id).localeCompare(a.createdAt || a._id)); // Sort by newest first

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <h2 className="page-title-big">🎉 Occasions Management</h2>
                    <p className="page-description">Manage occasions for your catering services</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    + Add Occasion
                </button>
            </div>

            <div className="page-filters">
                <input
                    type="text"
                    className="form-control search-input"
                    placeholder="🔍 Search occasions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({occasions.length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                        onClick={() => setFilter('active')}
                    >
                        Active ({occasions.filter(o => o.active).length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
                        onClick={() => setFilter('inactive')}
                    >
                        Inactive ({occasions.filter(o => !o.active).length})
                    </button>
                </div>
            </div>

            {
                filteredOccasions.length > 0 ? (
                    <div className="occasions-grid">
                        {filteredOccasions.map((occasion) => (
                            <div key={occasion._id} className={`occasion-card ${!occasion.active ? 'inactive' : ''}`}>
                                <div className="occasion-image">
                                    <img
                                        src={occasion.image}
                                        alt={occasion.title}
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                        crossOrigin="anonymous"
                                    />
                                    {!occasion.active && <div className="inactive-overlay">Inactive</div>}
                                </div>
                                <div className="occasion-content">
                                    <h3 className="occasion-title">{occasion.title}</h3>
                                    <div className="occasion-actions">
                                        <div className="occasion-toggle">
                                            <span className="toggle-label">Active</span>
                                            <Toggle
                                                checked={occasion.active}
                                                onChange={() => toggleOccasionActive(occasion._id)}
                                            />
                                        </div>
                                        <div className="occasion-buttons">
                                            <button
                                                className="btn btn-sm btn-outline"
                                                onClick={() => handleOpenModal(occasion)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(occasion._id)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
                    :
                    (
                        <div className="empty-state">
                            <span className="empty-icon">🎉</span>
                            <h3>No occasions found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                        </div>
                    )

            }

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingOccasion ? 'Edit Occasion' : 'Add New Occasion'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Occasion Title *</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g., Birthday, Wedding, Anniversary"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <ImageUpload
                        label="Occasion Image *"
                        value={formData.image}
                        onChange={(image) => setFormData({ ...formData, image })}
                    />

                    <div className="form-group">
                        <div className="toggle-field">
                            <div>
                                <label className="form-label">Active Status</label>
                                <p className="form-help">Show this occasion on the frontend</p>
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
                            {editingOccasion ? 'Update Occasion' : 'Add Occasion'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Occasions;
