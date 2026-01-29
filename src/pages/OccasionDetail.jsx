import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Modal from '../components/common/Modal';
import ImageUpload from '../components/common/ImageUpload';
import './Occasions.css';

const OccasionDetail = () => {
  const { id } = useParams();
  const { occasions, packages, addPackage, deletePackage, updatePackage } = useData();
  const occasion = occasions.find(o => o._id === id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    packageName: '',
    image: '',
    isVeg: true,
    price: '',
    numberOfPeople: 20
  });

  if (!occasion) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <h3>Occasion not found</h3>
        </div>
      </div>
    );
  }

  const occasionPackages = packages.filter(p => p.occasionId === id);

  const handleOpenModal = (pkg = null) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        packageName: pkg.packageName,
        image: pkg.image,
        isVeg: pkg.isVeg,
        price: pkg.price,
        numberOfPeople: pkg.numberOfPeople
      });
    } else {
      setEditingPackage(null);
      setFormData({
        packageName: '',
        image: '',
        isVeg: true,
        price: '',
        numberOfPeople: 20
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPackage) {
      await updatePackage(editingPackage._id, {
        ...formData,
        occasionId: id
      });
    } else {
      await addPackage({
        ...formData,
        occasionId: id
      });
    }
    handleCloseModal();
  };

  const handleDelete = async (pkgId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      await deletePackage(pkgId);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-content">
          <h2 className="page-title-big">🎉 {occasion.title}</h2>
          <p className="page-description">Manage packages for {occasion.title}</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          + Add Package
        </button>
      </div>

      <div className="occasions-grid mt-6">
        {occasionPackages.length > 0 ? (
          occasionPackages.map((pkg) => (
            <div key={pkg._id} className="occasion-card">
              <div className="occasion-image">
                <img
                  src={pkg.image}
                  alt={pkg.packageName}
                />
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <span className={`px-2 py-1 rounded text-xs font-bold shadow-sm ${pkg.isVeg ? 'bg-white text-green-700' : 'bg-white text-red-700'}`}>
                    {pkg.isVeg ? 'Veg' : 'Non-Veg'}
                  </span>
                </div>
              </div>
              <div className="occasion-content">
                <h3 className="occasion-title">{pkg.packageName}</h3>

                <div style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                    <span>💰 ₹{pkg.price}</span>
                    <span>👥 {pkg.numberOfPeople}</span>
                  </div>
                </div>

                <div className="occasion-actions">
                  <div className="occasion-buttons">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleOpenModal(pkg)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(pkg._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <h3>No packages found</h3>
            <p>Add a package to get started</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPackage ? "Edit Package" : "Add New Package"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Package Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Gold Wedding Package"
              value={formData.packageName}
              onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
              required
            />
          </div>

          <ImageUpload
            label="Package Image *"
            value={formData.image}
            onChange={(image) => setFormData({ ...formData, image })}
          />

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type *</label>
              <select
                className="form-select"
                value={formData.isVeg}
                onChange={(e) => setFormData({ ...formData, isVeg: e.target.value === 'true' })}
              >
                <option value="true">Veg</option>
                <option value="false">Non-Veg</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input
                type="number"
                className="form-control"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Number of People *</label>
            <input
              type="number"
              className="form-control"
              value={formData.numberOfPeople}
              onChange={(e) => setFormData({ ...formData, numberOfPeople: Number(e.target.value) })}
              required
              min="8"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingPackage ? 'Update Package' : 'Add Package'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default OccasionDetail;
