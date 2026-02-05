import { useState } from 'react';
import { useData } from '../../context/DataContext';
import './carousel.css';

const Carousel = () => {
  const { carouselImages, loadingCarousel, addCarouselImage, deleteCarouselImage } = useData();
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
      await addCarouselImage(imageInput);
      setIsAdding(false);
      setImageInput('');
      setPreviewImage('');
      // Reset file input
      document.getElementById('carousel-image-upload').value = '';
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      deleteCarouselImage(id);
    }
  };

  return (
    <div className="page-container">
      <div className="add-link-section">
        <form onSubmit={handleAddImage} className="add-link-form">
          <div className="image-upload-container">
            <input
              type="file"
              id="carousel-image-upload"
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
            {isAdding ? 'Adding...' : 'Add Image'}
          </button>
        </form>
      </div>

      <div className="table-container">
        {loadingCarousel ? (
          <div className="loading-state">
            <h3>...loading</h3>
          </div>
        ) : carouselImages.length > 0 ? (
          <div className="images-grid">
            {carouselImages.map((img) => (
              <div key={img._id} className="image-card">
                <img src={img.image} alt="Carousel Item" className="carousel-img-display" />
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
            <span className="empty-icon">📷</span>
            <h3>No Carousel images added</h3>
            <p>Start by uploading your first image above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carousel;
