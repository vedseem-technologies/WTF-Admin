import { useState, useEffect } from "react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";
import Toggle from "../../../components/ui/Toggle";
import ImageUpload from "../../../components/ui/ImageUpload";
import { getThumbnail } from "../../../utils/imageOptimizer";
import NewMenuDropdown from "../../../components/ui/NewMenuDropdown";
import "../../occasions/pages/Occasions.css"; // Reusing same styles

const Categories = () => {
  const {
    categories,
    loadingCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,
    menuItems,
    getCategoryMenuSelection,
    saveCategoryMenuSelection,
  } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    active: true,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Menu Selection State
  const [selectedStarters, setSelectedStarters] = useState([]);
  const [selectedMainCourse, setSelectedMainCourse] = useState([]);
  const [selectedDesserts, setSelectedDesserts] = useState([]);
  const [selectedBreadRice, setSelectedBreadRice] = useState([]);
  const [isLoadingSelection, setIsLoadingSelection] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownSearchTerms, setDropdownSearchTerms] = useState({
    starter: "",
    mainCourse: "",
    dessert: "",
    breadRice: "",
  });

  const handleOpenModal = async (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        title: category.title,
        image: category.image,
        active: category.active,
      });

      // Load menu selection
      setIsLoadingSelection(true);
      const savedSelection = await getCategoryMenuSelection(category._id);
      if (savedSelection) {
        const mapItems = (ids) => {
          if (!ids) return [];
          return menuItems.filter((item) => ids.includes(item._id));
        };

        setSelectedStarters(mapItems(savedSelection.starters));
        setSelectedMainCourse(mapItems(savedSelection.mainCourses));
        setSelectedDesserts(mapItems(savedSelection.desserts));
        setSelectedBreadRice(mapItems(savedSelection.breadRice));
      } else {
        setSelectedStarters([]);
        setSelectedMainCourse([]);
        setSelectedDesserts([]);
        setSelectedBreadRice([]);
      }
      setIsLoadingSelection(false);
    } else {
      setEditingCategory(null);
      setFormData({ title: "", image: "", active: true });
      setSelectedStarters([]);
      setSelectedMainCourse([]);
      setSelectedDesserts([]);
      setSelectedBreadRice([]);
      setIsLoadingSelection(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ title: "", image: "", active: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let categoryId;
    let responseCategory;

    if (editingCategory) {
      responseCategory = await updateCategory(editingCategory._id, formData);
      categoryId = editingCategory._id;
    } else {
      responseCategory = await addCategory(formData);
      if (responseCategory) {
        categoryId = responseCategory._id;
      }
    }

    if (categoryId) {
      const menuSelection = {
        starters: selectedStarters.map((item) => item._id),
        mainCourses: selectedMainCourse.map((item) => item._id),
        desserts: selectedDesserts.map((item) => item._id),
        breadRice: selectedBreadRice.map((item) => item._id),
      };
      await saveCategoryMenuSelection(categoryId, menuSelection);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategory(id);
    }
  };

  const filteredCategories = categories
    .filter((category) => {
      const matchesSearch = category.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && category.active) ||
        (filter === "inactive" && !category.active);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) =>
      String(b.createdAt || b._id).localeCompare(String(a.createdAt || a._id)),
    );

  return (
    <div className="page-container">
      <div className="page-filters">
        <input
          type="text"
          className="form-control search-input"
          placeholder="🔍 Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-buttons" style={{ marginLeft: 'auto' }}>
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({categories.length})
          </button>
          <button
            className={`filter-btn ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            Active ({categories.filter((c) => c.active).length})
          </button>
          <button
            className={`filter-btn ${filter === "inactive" ? "active" : ""}`}
            onClick={() => setFilter("inactive")}
          >
            Inactive ({categories.filter((c) => !c.active).length})
          </button>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Add Category
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
            <div
              key={category._id}
              className={`occasion-card ${!category.active ? "inactive" : ""}`}
            >
              <div className="occasion-image">
                <img
                  src={getThumbnail(category.image)}
                  alt={category.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                />
                {!category.active && (
                  <div className="inactive-overlay">Inactive</div>
                )}
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
        title={editingCategory ? "Edit Category" : "Add New Category"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Category Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Buffet Only, Live Service, Delivery Only"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
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
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
              />
            </div>
          </div>

          <div className="menu-selection-section">
            <h4 className="menu-selection-title">Menu Selection</h4>
            {isLoadingSelection ? (
              <div>Loading menu data...</div>
            ) : (
              <div
                className="grid-1"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <NewMenuDropdown
                  label="Starters"
                  icon="🥗"
                  selected={selectedStarters}
                  setSelected={setSelectedStarters}
                  options={menuItems}
                  categoryKey="starter"
                  searchTerms={dropdownSearchTerms}
                  setSearchTerms={setDropdownSearchTerms}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                />
                <NewMenuDropdown
                  label="Main Course"
                  icon="🍛"
                  selected={selectedMainCourse}
                  setSelected={setSelectedMainCourse}
                  options={menuItems}
                  categoryKey="mainCourse"
                  searchTerms={dropdownSearchTerms}
                  setSearchTerms={setDropdownSearchTerms}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                />
                <NewMenuDropdown
                  label="Desserts"
                  icon="🍰"
                  selected={selectedDesserts}
                  setSelected={setSelectedDesserts}
                  options={menuItems}
                  categoryKey="dessert"
                  searchTerms={dropdownSearchTerms}
                  setSearchTerms={setDropdownSearchTerms}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                />
                <NewMenuDropdown
                  label="Rice & Bread"
                  icon="🍚"
                  selected={selectedBreadRice}
                  setSelected={setSelectedBreadRice}
                  options={menuItems}
                  categoryKey="breadRice"
                  searchTerms={dropdownSearchTerms}
                  setSearchTerms={setDropdownSearchTerms}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                />
              </div>
            )}
          </div>

          <div className="modal-actions" style={{ marginTop: "2rem" }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingCategory ? "Update Category" : "Add Category"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
