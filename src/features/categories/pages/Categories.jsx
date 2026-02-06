import { useState, useEffect } from "react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";
import Toggle from "../../../components/ui/Toggle";
import ImageUpload from "../../../components/ui/ImageUpload";
import { getThumbnail } from "../../../utils/imageOptimizer";
import NewMenuDropdown from "../../../components/ui/NewMenuDropdown";
import "../../occasions/pages/Occasions.css"; // Reusing same styles
import useCursorPagination from "../../../hooks/useCursorPagination";

const Categories = () => {
  const {
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,
    getCategoryMenuSelection,
    saveCategoryMenuSelection,
  } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  // Debounce search term to avoid too many API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [filter, setFilter] = useState("all");

  const {
    data: categories,
    loading: loadingCategories,
    pageInfo,
    handleNext,
    handlePrev,
    refresh: refreshCategories
  } = useCursorPagination('/api/categories', {
    limit: 12,
    filters: {
      active: filter === 'active' ? true : (filter === 'inactive' ? false : undefined),
      search: debouncedSearchTerm || undefined
    }
  });

  // Fetch menu items for dropdowns (fetch all/large limit)
  const { data: menuItems } = useCursorPagination('/api/menu-items', { limit: 1000, filters: { active: true } });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    active: true,
  });

  // Menu Selection State
  const [selectedStarters, setSelectedStarters] = useState([]);
  const [selectedMainCourse, setSelectedMainCourse] = useState([]);
  const [selectedDesserts, setSelectedDesserts] = useState([]);
  const [selectedBreadRice, setSelectedBreadRice] = useState([]);

  // Unselected Menu Items State (For Strict Persistence)
  const [unselectedStarters, setUnselectedStarters] = useState([]);
  const [unselectedMainCourse, setUnselectedMainCourse] = useState([]);
  const [unselectedDesserts, setUnselectedDesserts] = useState([]);
  const [unselectedBreadRice, setUnselectedBreadRice] = useState([]);
  const [isLoadingSelection, setIsLoadingSelection] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownSearchTerms, setDropdownSearchTerms] = useState({
    starter: "",
    mainCourse: "",
    dessert: "",
    breadRice: "",
  });

  const handleOpenModal = async (category = null) => {
    // Debug: Full menu items
    console.log("Full Menu Items (Source of Truth):", menuItems);

    if (category) {
      setEditingCategory(category);
      setFormData({
        title: category.title,
        image: category.image,
        active: category.active,
      });

      // Load menu selection
      setIsLoadingSelection(true);
      try {
        const savedSelection = await getCategoryMenuSelection(category._id);
        console.log('Loaded menu selection for category:', savedSelection);

        if (savedSelection) {
          const mapItems = (data) => {
            if (!data || !Array.isArray(data)) return [];

            let itemsToMap = [];
            if (data.length > 0 && typeof data[0] === 'object' && data[0]._id) {
              itemsToMap = data;
            } else {
              itemsToMap = menuItems.filter((item) => data.includes(item._id));
            }
            return itemsToMap;
          };

          // Helper for Strict Filtering
          const filterByCategory = (items, categoryName, categoryId) => {
            return items.filter(i => i.category === categoryName || i.category == categoryId);
          };

          const mappedSelectedStarters = mapItems(savedSelection.starters);
          const mappedSelectedMain = mapItems(savedSelection.mainCourses);
          const mappedSelectedDesserts = mapItems(savedSelection.desserts);
          const mappedSelectedBreadRice = mapItems(savedSelection.breadRice);

          const mappedUnselectedStarters = mapItems(savedSelection.unselectedStarters);
          const mappedUnselectedMain = mapItems(savedSelection.unselectedMainCourses);
          const mappedUnselectedDesserts = mapItems(savedSelection.unselectedDesserts);
          const mappedUnselectedBreadRice = mapItems(savedSelection.unselectedBreadRice);

          // Apply Strict Category Filtering
          setSelectedStarters(filterByCategory(mappedSelectedStarters, 'Starter', 1));
          setSelectedMainCourse(filterByCategory(mappedSelectedMain, 'Main Course', 2));
          setSelectedDesserts(filterByCategory(mappedSelectedDesserts, 'Dessert', 4));
          setSelectedBreadRice(filterByCategory(mappedSelectedBreadRice, 'Rice & Bread', 3));

          setUnselectedStarters(filterByCategory(mappedUnselectedStarters, 'Starter', 1));
          setUnselectedMainCourse(filterByCategory(mappedUnselectedMain, 'Main Course', 2));
          setUnselectedDesserts(filterByCategory(mappedUnselectedDesserts, 'Dessert', 4));
          setUnselectedBreadRice(filterByCategory(mappedUnselectedBreadRice, 'Rice & Bread', 3));

          // Debug: Category-wise filtered items (After Load)
          console.log("Strictly Filtered Loaded Items:", {
            starters: { selected: mappedSelectedStarters.length, unselected: mappedUnselectedStarters.length },
            mains: { selected: mappedSelectedMain.length, unselected: mappedUnselectedMain.length },
          });

        } else {
          // New category implementation fallback
          setUnselectedStarters(menuItems.filter(i => i.category === 'Starter' || i.category == 1));
          setUnselectedMainCourse(menuItems.filter(i => i.category === 'Main Course' || i.category == 2));
          setUnselectedDesserts(menuItems.filter(i => i.category === 'Dessert' || i.category == 4));
          setUnselectedBreadRice(menuItems.filter(i => i.category === 'Rice & Bread' || i.category == 3));

          setSelectedStarters([]);
          setSelectedMainCourse([]);
          setSelectedDesserts([]);
          setSelectedBreadRice([]);
        }
      } catch (error) {
        console.error('Error loading menu selection:', error);
        setSelectedStarters([]);
        setSelectedMainCourse([]);
        setSelectedDesserts([]);
        setSelectedBreadRice([]);
      }
      setIsLoadingSelection(false);
    } else {
      setEditingCategory(null);
      setFormData({ title: "", image: "", active: true });

      // Strict Initialization
      setUnselectedStarters(menuItems.filter(i => i.category === 'Starter' || i.category == 1));
      setUnselectedMainCourse(menuItems.filter(i => i.category === 'Main Course' || i.category == 2));
      setUnselectedDesserts(menuItems.filter(i => i.category === 'Dessert' || i.category == 4));
      setUnselectedBreadRice(menuItems.filter(i => i.category === 'Rice & Bread' || i.category == 3));

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
    // Reset menu selections
    setSelectedStarters([]);
    setSelectedMainCourse([]);
    setSelectedDesserts([]);
    setSelectedBreadRice([]);

    setUnselectedStarters([]);
    setUnselectedMainCourse([]);
    setUnselectedDesserts([]);
    setUnselectedBreadRice([]);

    // Reset dropdown states
    setOpenDropdown(null);
    setDropdownSearchTerms({
      starter: "",
      mainCourse: "",
      dessert: "",
      breadRice: "",
    });
  };

  // State Wrappers to sync Selected/Unselected
  // Helper for Updating Selection State
  const updateSelection = (category, newSelected, allCategoryItems, setUnselected) => {
    // Unselected = All Items - Selected Items
    // Identify by ID to be safe
    const selectedIds = new Set(newSelected.map(i => i._id));
    const newUnselected = allCategoryItems.filter(i => !selectedIds.has(i._id));
    setUnselected(newUnselected);
  };

  const handleError = (error) => {
    console.error("Action error:", error);
    // Could add toaster here
  };

  const handleAddCategory = async (data) => {
    try {
      await addCategory(data);
      refreshCategories();
    } catch (e) { handleError(e); }
  };

  const handleUpdateCategory = async (id, data) => {
    try {
      await updateCategory(id, data);
      refreshCategories();
    } catch (e) { handleError(e); }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        refreshCategories();
      } catch (e) { handleError(e); }
    }
  };

  const handleToggleCategory = async (id) => {
    try {
      await toggleCategoryActive(id);
      refreshCategories();
    } catch (e) { handleError(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let categoryId;
    let responseCategory;

    if (editingCategory) {
      // Use DataContext function, but wait for it and then refresh
      // NOTE: DataContext functions might not return promise that resolves to data correctly if I messed with them?
      // Checking DataContext code... it uses axios and returns response.data.
      responseCategory = await updateCategory(editingCategory._id, formData);
      categoryId = editingCategory._id;
    } else {
      responseCategory = await addCategory(formData);
      if (responseCategory) {
        categoryId = responseCategory._id;
      }
    }

    refreshCategories();

    if (categoryId) {
      // Debug: Log state before constructing payload
      console.log("Preparing to Save Category - State Check:", {
        selected: { starters: selectedStarters.length, mains: selectedMainCourse.length },
        unselected: { starters: unselectedStarters.length, mains: unselectedMainCourse.length }
      });

      const menuSelection = {
        starters: selectedStarters.map((item) => item._id),
        mainCourses: selectedMainCourse.map((item) => item._id),
        desserts: selectedDesserts.map((item) => item._id),
        breadRice: selectedBreadRice.map((item) => item._id),
        unselectedStarters: unselectedStarters.map(i => i._id),
        unselectedMainCourses: unselectedMainCourse.map(i => i._id),
        unselectedDesserts: unselectedDesserts.map(i => i._id),
        unselectedBreadRice: unselectedBreadRice.map(i => i._id),
      };

      console.log("FINAL PAYLOAD being sent to API (Category):", JSON.stringify(menuSelection, null, 2));
      await saveCategoryMenuSelection(categoryId, menuSelection);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    handleDeleteCategory(id);
  };

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
            All
          </button>
          <button
            className={`filter-btn ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filter === "inactive" ? "active" : ""}`}
            onClick={() => setFilter("inactive")}
          >
            Inactive
          </button>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Add Category
          </button>
        </div>
      </div>

      {loadingCategories && categories.length === 0 ? (
        <div className="loading-state">
          <h3>...loading</h3>
        </div>
      ) : categories.length > 0 ? (
        <>
          <div className="occasions-grid">
            {categories.map((category) => (
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
                        onChange={() => handleToggleCategory(category._id)}
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

          <div className="pagination-controls flex justify-between items-center mt-8 mb-8">
            <button
              onClick={handlePrev}
              disabled={!pageInfo.hasPrevPage || loadingCategories}
              className="btn btn-outline"
            >
              ⬅️ Previous
            </button>
            <span className="text-gray-500">
              {loadingCategories ? 'Loading...' : ''}
            </span>
            <button
              onClick={handleNext}
              disabled={!pageInfo.hasNextPage || loadingCategories}
              className="btn btn-outline"
            >
              Next ➡️
            </button>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">📁</span>
          <h3>No categories found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )
      }

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
                  setSelected={(newSelected) => {
                    setSelectedStarters(newSelected);
                    updateSelection('starter', newSelected, menuItems.filter(i => i.category === 'Starter'), setUnselectedStarters);
                  }}
                  options={menuItems.filter(i => i.category === 'Starter')}
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
                  setSelected={(newSelected) => {
                    setSelectedMainCourse(newSelected);
                    updateSelection('mainCourse', newSelected, menuItems.filter(i => i.category === 'Main Course'), setUnselectedMainCourse);
                  }}
                  options={menuItems.filter(i => i.category === 'Main Course')}
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
                  setSelected={(newSelected) => {
                    setSelectedDesserts(newSelected);
                    updateSelection('dessert', newSelected, menuItems.filter(i => i.category === 'Dessert'), setUnselectedDesserts);
                  }}
                  options={menuItems.filter(i => i.category === 'Dessert')}
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
                  setSelected={(newSelected) => {
                    setSelectedBreadRice(newSelected);
                    updateSelection('breadRice', newSelected, menuItems.filter(i => i.category === 'Rice & Bread'), setUnselectedBreadRice);
                  }}
                  options={menuItems.filter(i => i.category === 'Rice & Bread')}
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
    </div >
  );
};

export default Categories;
