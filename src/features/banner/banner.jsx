import { useState } from 'react';
import { useData } from '../../context/DataContext';
import './banner.css';

const Banner = () => {
  const { bannerImages, loadingBanner, addBannerImage, deleteBannerImage } = useData();
  const [imageInput, setImageInput] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setImageInput(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (imageInput) {
      setIsAdding(true);
      await addBannerImage(imageInput);
      setIsAdding(false);
      setImageInput('');
      setPreviewImage('');
      document.getElementById('banner-image-upload').value = '';
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      deleteBannerImage(id);
    }
  };

  return (
    <div className="page-container">
      <div className="add-link-section">
        <form onSubmit={handleAddImage} className="add-link-form">
          <div className="image-upload-container">
            <input
              type="file"
              id="banner-image-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
              required
            />
            {previewImage && (
              <div className="image-preview-mini">
                <img src={previewImage} alt="Preview" />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary add-btn" disabled={!imageInput || isAdding}>
            {isAdding ? 'Adding...' : 'Add Banner'}
          </button>
        </form>
      </div>

      <div className="table-container">
        {loadingBanner ? (
          <div className="loading-state">
            <h3>...loading</h3>
          </div>
        ) : bannerImages.length > 0 ? (
          <div className="images-grid">
            {bannerImages.map((img) => (
              <div key={img._id} className="image-card">
                <img src={img.image} alt="Banner Item" className="banner-img-display" />
                <button
                  className="btn btn-sm btn-danger delete-btn-overlay"
                  onClick={() => handleDelete(img._id)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">🖼️</span>
            <h3>No Banner images added</h3>
            <p>Start by uploading your first banner above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;
