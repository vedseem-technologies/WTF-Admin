import { useState, useEffect } from "react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";
import Toggle from "../../../components/ui/Toggle";
import ImageUpload from "../../../components/ui/ImageUpload";
import { getThumbnail } from "../../../utils/imageOptimizer";
import NewMenuDropdown from "../../../components/ui/NewMenuDropdown";
import "./Occasions.css";

const Occasions = () => {
  const {
    occasions,
    addOccasion,
    updateOccasion,
    deleteOccasion,
    toggleOccasionActive,
    menuItems,
    getOccasionMenuSelection,
    saveOccasionMenuSelection,
  } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOccasion, setEditingOccasion] = useState(null);
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

  const handleOpenModal = async (occasion = null) => {
    if (occasion) {
      setEditingOccasion(occasion);
      setFormData({
        title: occasion.title,
        image: occasion.image,
        active: occasion.active,
      });

      // Load menu selection
      setIsLoadingSelection(true);
      const savedSelection = await getOccasionMenuSelection(occasion._id);
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
      setEditingOccasion(null);
      setFormData({ title: "", image: "", active: true });
      setSelectedStarters([]);
      setSelectedMainCourse([]);
      setSelectedDesserts([]);
      setSelectedBreadRice([]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOccasion(null);
    setFormData({ title: "", image: "", active: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let occasionId;
    let responseOccasion;

    if (editingOccasion) {
      responseOccasion = await updateOccasion(editingOccasion._id, formData);
      occasionId = editingOccasion._id;
    } else {
      responseOccasion = await addOccasion(formData);
      if (responseOccasion) {
        occasionId = responseOccasion._id;
      }
    }

    if (occasionId) {
      const menuSelection = {
        starters: selectedStarters.map((item) => item._id),
        mainCourses: selectedMainCourse.map((item) => item._id),
        desserts: selectedDesserts.map((item) => item._id),
        breadRice: selectedBreadRice.map((item) => item._id),
      };
      await saveOccasionMenuSelection(occasionId, menuSelection);
    }

    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this occasion?")) {
      deleteOccasion(id);
    }
  };

  const filteredOccasions = occasions
    .filter((occasion) => {
      const matchesSearch = occasion.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && occasion.active) ||
        (filter === "inactive" && !occasion.active);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(
        a.createdAt || a._id ? parseInt(a._id.substring(0, 8), 16) * 1000 : 0,
      ).getTime();
      const dateB = new Date(
        b.createdAt || b._id ? parseInt(b._id.substring(0, 8), 16) * 1000 : 0,
      ).getTime();
      return dateB - dateA;
    });

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-content">
          <h2 className="page-title-big">🎉 Occasions Management</h2>
          <p className="page-description">
            Manage occasions for your catering services
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          + Add Occasion
        </button>
      </div>

      <div className="page-filters">
        <input
          type="text"
          className="form-control search-input"
          placeholder="🔍 Search occasions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({occasions.length})
          </button>
          <button
            className={`filter-btn ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            Active ({occasions.filter((o) => o.active).length})
          </button>
          <button
            className={`filter-btn ${filter === "inactive" ? "active" : ""}`}
            onClick={() => setFilter("inactive")}
          >
            Inactive ({occasions.filter((o) => !o.active).length})
          </button>
        </div>
      </div>

      {filteredOccasions.length > 0 ? (
        <div className="occasions-grid">
          {filteredOccasions.map((occasion) => (
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
                      onChange={() => toggleOccasionActive(occasion._id)}
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
                      onClick={() => handleDelete(occasion._id)}
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
          <span className="empty-icon">🎉</span>
          <h3>No occasions found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

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

          <div
            className="menu-selection-section"
            style={{
              marginTop: "2rem",
              borderTop: "1px solid #eee",
              paddingTop: "1rem",
            }}
          >
            <h4 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
              Menu Selection
            </h4>
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
              {editingOccasion ? "Update Occasion" : "Add Occasion"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Occasions;
