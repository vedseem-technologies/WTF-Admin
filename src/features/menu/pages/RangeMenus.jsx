import { useState, useEffect } from "react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";
import ImageUpload from "../../../components/ui/ImageUpload";
import { getThumbnail } from "../../../utils/imageOptimizer";
import "./RangeMenus.css";
import useCursorPagination from "../../../hooks/useCursorPagination";

const MENU_RANGES = ["Paneer Range", "Fast Food Range", "Chinese Range"];

const RangeMenus = () => {
  const {
    addRangeMenu,
    updateRangeMenu,
    deleteRangeMenu,
  } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  // Debounce search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: rangeMenus,
    loading: loadingRangeMenus,
    pageInfo,
    handleNext,
    handlePrev,
    refresh: refreshRangeMenus
  } = useCursorPagination('/api/range-menus', {
    limit: 12,
    filters: {
      search: debouncedSearchTerm || undefined
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    rating: "",
    range: MENU_RANGES[0],
  });

  const handleOpenModal = (menu = null) => {
    if (menu) {
      setEditingMenu(menu);
      setFormData({
        name: menu.name,
        image: menu.image,
        rating: menu.rating,
        range: menu.range,
      });
    } else {
      setEditingMenu(null);
      setFormData({
        name: "",
        image: "",
        rating: "",
        range: MENU_RANGES[0],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMenu(null);
  };

  const handleError = (error) => {
    console.error("Action error:", error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMenu) {
        await updateRangeMenu(editingMenu._id, formData);
      } else {
        await addRangeMenu(formData);
      }
      refreshRangeMenus();
      handleCloseModal();
    } catch (e) { handleError(e); }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this range menu item?")
    ) {
      try {
        await deleteRangeMenu(id);
        refreshRangeMenus();
      } catch (e) { handleError(e); }
    }
  };


  return (
    <div className="page-container">
      <div className="page-filters">
        <input
          type="text"
          className="form-control search-input"
          placeholder="🔍 Search range menus..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-buttons" style={{ marginLeft: "auto" }}>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Add New
          </button>
        </div>
      </div>

      <div className="table-container">
        {loadingRangeMenus && rangeMenus.length === 0 ? (
          <div className="loading-state">
            <h3>...loading</h3>
          </div>
        ) : rangeMenus.length > 0 ? (
          <>
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
                {rangeMenus.map((menu) => (
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
                          className="btn btn-sm btn-outline"
                          onClick={() => handleOpenModal(menu)}
                          style={{ marginRight: "8px" }}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(menu._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="pagination-controls flex justify-between items-center mt-8 mb-8">
              <button
                onClick={handlePrev}
                disabled={!pageInfo.hasPrevPage || loadingRangeMenus}
                className="btn btn-outline"
              >
                ⬅️ Previous
              </button>
              <span className="text-gray-500">
                {loadingRangeMenus ? 'Loading...' : ''}
              </span>
              <button
                onClick={handleNext}
                disabled={!pageInfo.hasNextPage || loadingRangeMenus}
                className="btn btn-outline"
              >
                Next ➡️
              </button>
            </div>
          </>
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
        title={editingMenu ? "Edit Range Menu" : "Add New Range Menu"}
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rating: parseFloat(e.target.value),
                  })
                }
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
              onChange={(e) =>
                setFormData({ ...formData, range: e.target.value })
              }
              required
            >
              {MENU_RANGES.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingMenu ? "Update Menu" : "Add Menu"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RangeMenus;
