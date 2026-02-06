import { useState, useEffect } from "react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";
import Toggle from "../../../components/ui/Toggle";
import ImageUpload from "../../../components/ui/ImageUpload";
import { getThumbnail } from "../../../utils/imageOptimizer";
import NewMenuDropdown from "../../../components/ui/NewMenuDropdown";
import "./Occasions.css";

import useCursorPagination from "../../../hooks/useCursorPagination";

const Occasions = () => {
  const {
    addOccasion,
    updateOccasion,
    deleteOccasion,
    toggleOccasionActive,
    getOccasionMenuSelection,
    saveOccasionMenuSelection,
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
    data: occasions,
    loading: loadingOccasions,
    pageInfo,
    handleNext,
    handlePrev,
    refresh: refreshOccasions
  } = useCursorPagination('/api/occasions', {
    limit: 12,
    filters: {
      active: filter === 'active' ? true : (filter === 'inactive' ? false : undefined),
      search: debouncedSearchTerm || undefined
    }
  });

  // Fetch menu items for dropdowns (fetch all/large limit)
  const { data: menuItems } = useCursorPagination('/api/menu-items', { limit: 1000, filters: { active: true } });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOccasion, setEditingOccasion] = useState(null);
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

  const handleOpenModal = async (occasion = null) => {
    // Debug: Full menu items
    console.log("Full Menu Items (Source of Truth):", menuItems);

    if (occasion) {
      setEditingOccasion(occasion);
      setFormData({
        title: occasion.title,
        image: occasion.image,
        active: occasion.active,
      });

      // Load menu selection
      setIsLoadingSelection(true);
      try {
        const savedSelection = await getOccasionMenuSelection(occasion._id);
        console.log('Loaded menu selection for occasion:', savedSelection);

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
          // New implementation fallback
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
      setEditingOccasion(null);
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
    setEditingOccasion(null);
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

  // Combined handlers to refresh list after mutation
  const handleAddOccasion = async (data) => {
    await addOccasion(data);
    refreshOccasions();
  };

  const handleUpdateOccasion = async (id, data) => {
    await updateOccasion(id, data);
    refreshOccasions();
  };

  const handleDeleteOccasion = async (id) => {
    if (window.confirm("Are you sure you want to delete this occasion?")) {
      await deleteOccasion(id);
      refreshOccasions();
    }
  };

  const handleToggleOccasion = async (id) => {
    await toggleOccasionActive(id);
    refreshOccasions();
  };

  // ... (keeping existing modal logic, replacing update/add calls in handleSubmit)

  // handleSubmit Logic replacement
  const handleSubmit = async (e) => {
    e.preventDefault();
    let occasionId;
    let responseOccasion;

    if (editingOccasion) {
      // Use local wrapper
      // Note: updateOccasion returns the updated object in context, 
      // but we need to await it. 
      // DataContext updateOccasion calls setOccasions (which is empty/harmless) and returns response.data
      responseOccasion = await updateOccasion(editingOccasion._id, formData);
      occasionId = editingOccasion._id;
    } else {
      responseOccasion = await addOccasion(formData);
      if (responseOccasion) {
        occasionId = responseOccasion._id;
      }
    }

    // Refresh list
    refreshOccasions();

    if (occasionId) {
      // ... (Menu selection logic same as before)
      // Copied from original:
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
      await saveOccasionMenuSelection(occasionId, menuSelection);
    }
    handleCloseModal();
  };

  return (
    <div className="page-container">
      <div className="page-filters">
        <input
          type="text"
          className="form-control search-input"
          placeholder="🔍 Search occasions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="filter-buttons" style={{ marginLeft: "auto" }}>
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
            + Add Occasion
          </button>
        </div>
      </div>

      {loadingOccasions && occasions.length === 0 ? (
        <div className="text-center py-10">Loading...</div>
      ) : occasions.length > 0 ? (
        <>
          <div className="occasions-grid">
            {occasions.map((occasion) => (
              <div
                key={occasion._id}
                className={`occasion-card ${!occasion.active ? "inactive" : ""}`}
              >
                <div className="occasion-image">
                  <img
                    src={getThumbnail(occasion.image)}
                    alt={occasion.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                  {!occasion.active && (
                    <div className="inactive-overlay">Inactive</div>
                  )}
                </div>
                <div className="occasion-content">
                  <h3 className="occasion-title">{occasion.title}</h3>
                  <div className="occasion-actions">
                    <div className="occasion-toggle">
                      <span className="toggle-label">Active</span>
                      <Toggle
                        checked={occasion.active}
                        onChange={() => handleToggleOccasion(occasion._id)}
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
                        onClick={() => handleDeleteOccasion(occasion._id)}
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
              disabled={!pageInfo.hasPrevPage || loadingOccasions}
              className="btn btn-outline"
            >
              ⬅️ Previous
            </button>
            <span className="text-gray-500">
              {loadingOccasions ? 'Loading...' : ''}
            </span>
            <button
              onClick={handleNext}
              disabled={!pageInfo.hasNextPage || loadingOccasions}
              className="btn btn-outline"
            >
              Next ➡️
            </button>
          </div>

        </>
      ) : (
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
        title={editingOccasion ? "Edit Occasion" : "Add New Occasion"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Occasion Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Birthday, Wedding, Anniversary"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
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
              {editingOccasion ? "Update Occasion" : "Add Occasion"}
            </button>
          </div>
        </form>
      </Modal>
    </div >
  );
};

export default Occasions;
