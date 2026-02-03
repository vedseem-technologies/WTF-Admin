import { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/common/Modal';
import Toggle from '../components/common/Toggle';
import ImageUpload from '../components/common/ImageUpload';
import { getThumbnail } from '../utils/imageOptimizer';
import './Occasions.css'; // Reusing same styles

const Services = () => {
    const { services, loadingServices, addService, updateService, deleteService, toggleServiceActive } = useData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({ title: '', image: '', active: true });
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const handleOpenModal = (service = null) => {
        if (service) {
            setEditingService(service);
            setFormData({ title: service.title, image: service.image, active: service.active });
        } else {
            setEditingService(null);
            setFormData({ title: '', image: '', active: true });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
        setFormData({ title: '', image: '', active: true });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingService) {
            updateService(editingService._id, formData);
        } else {
            addService(formData);
        }

        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            deleteService(id);
        }
    };

    const filteredServices = services.filter(service => {
        const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'active' && service.active) ||
            (filter === 'inactive' && !service.active);
        return matchesSearch && matchesFilter;
    }).sort((a, b) => (b.createdAt || b._id).localeCompare(a.createdAt || a._id));

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <h2 className="page-title-big">🍽️ Services Management</h2>
                    <p className="page-description">Manage catering service types</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    + Add Service
                </button>
            </div>

            <div className="page-filters">
                <input
                    type="text"
                    className="form-control search-input"
                    placeholder="🔍 Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({services.length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                        onClick={() => setFilter('active')}
                    >
                        Active ({services.filter(s => s.active).length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
                        onClick={() => setFilter('inactive')}
                    >
                        Inactive ({services.filter(s => !s.active).length})
                    </button>
                </div>
            </div>

            {filteredServices.length > 0 ? (
                <div className="occasions-grid">
                    {filteredServices.map((service) => (
                        <div key={service._id} className={`occasion-card ${!service.active ? 'inactive' : ''}`}>
                            <div className="occasion-image">
                                <img
                                    src={getThumbnail(service.image)}
                                    alt={service.title}
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                    crossOrigin="anonymous"
                                />
                                {!service.active && <div className="inactive-overlay">Inactive</div>}
                            </div>
                            <div className="occasion-content">
                                <h3 className="occasion-title">{service.title}</h3>
                                <div className="occasion-actions">
                                    <div className="occasion-toggle">
                                        <span className="toggle-label">Active</span>
                                        <Toggle
                                            checked={service.active}
                                            onChange={() => toggleServiceActive(service._id)}
                                        />
                                    </div>
                                    <div className="occasion-buttons">
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => handleOpenModal(service)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(service._id)}
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
                    <span className="empty-icon">🍽️</span>
                    <h3>No services found</h3>
                    <p>Try adjusting your search criteria</p>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingService ? 'Edit Service' : 'Add New Service'}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Service Title *</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g., Buffet Service, Full Service, Cocktail"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <ImageUpload
                        label="Service Image *"
                        value={formData.image}
                        onChange={(image) => setFormData({ ...formData, image })}
                    />

                    <div className="form-group">
                        <div className="toggle-field">
                            <div>
                                <label className="form-label">Active Status</label>
                                <p className="form-help">Show this service on the frontend</p>
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
                            {editingService ? 'Update Service' : 'Add Service'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Services;
