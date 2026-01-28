import { useState } from 'react';
import { useData } from '../context/DataContext';
import Modal from '../components/common/Modal';
import ImageUpload from '../components/common/ImageUpload';
import './Occasions.css'; // Reusing same styles

const Services = () => {
    const { services, addService, updateService, deleteService } = useData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({ title: '', image: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const handleOpenModal = (service = null) => {
        if (service) {
            setEditingService(service);
            setFormData({ title: service.title, image: service.image });
        } else {
            setEditingService(null);
            setFormData({ title: '', image: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
        setFormData({ title: '', image: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingService) {
            updateService(editingService.id, formData);
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

    const filteredServices = services.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <button className="filter-btn active">
                        All ({services.length})
                    </button>
                </div>
            </div>

            <div className="occasions-grid">
                {filteredServices.map((service) => (
                    <div key={service.id} className="occasion-card">
                        <div className="occasion-image">
                            <img src={service.image} alt={service.title} />
                        </div>
                        <div className="occasion-content">
                            <h3 className="occasion-title">{service.title}</h3>
                            <div className="occasion-actions">
                                <div className="occasion-buttons">
                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={() => handleOpenModal(service)}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(service.id)}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredServices.length === 0 && (
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
