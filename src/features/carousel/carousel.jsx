import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import './carousel.css';
import useCursorPagination from '../../hooks/useCursorPagination';

const Carousel = () => {
  const { addCarouselImage, deleteCarouselImage } = useData();
  const [imageInput, setImageInput] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  // Debounce search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: carouselImages,
    loading: loadingCarousel,
    pageInfo,
    handleNext,
    handlePrev,
    refresh: refreshCarousel
  } = useCursorPagination('/api/carousel', {
    limit: 12,
    filters: {
      search: debouncedSearchTerm || undefined
    }
  });


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

  const handleError = (error) => {
    console.error("Action error:", error);
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (imageInput) {
      setIsAdding(true);
      try {
        await addCarouselImage(imageInput);
        refreshCarousel();
        setImageInput('');
        setPreviewImage('');
        // Reset file input
        document.getElementById('carousel-image-upload').value = '';
      } catch (e) { handleError(e); }
      finally { setIsAdding(false); }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteCarouselImage(id);
        refreshCarousel();
      } catch (e) { handleError(e); }
    }
  };

  return (
    <div className="page-container">
      <div className="page-filters" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          className="form-control search-input"
          placeholder="🔍 Search image URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
        {loadingCarousel && carouselImages.length === 0 ? (
          <div className="loading-state">
            <h3>...loading</h3>
          </div>
        ) : carouselImages.length > 0 ? (
          <>
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
            {/* Pagination Controls */}
            <div className="pagination-controls flex justify-between items-center mt-8 mb-8">
              <button
                onClick={handlePrev}
                disabled={!pageInfo.hasPrevPage || loadingCarousel}
                className="btn btn-outline"
              >
                ⬅️ Previous
              </button>
              <span className="text-gray-500">
                {loadingCarousel ? 'Loading...' : ''}
              </span>
              <button
                onClick={handleNext}
                disabled={!pageInfo.hasNextPage || loadingCarousel}
                className="btn btn-outline"
              >
                Next ➡️
              </button>
            </div>
          </>
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
