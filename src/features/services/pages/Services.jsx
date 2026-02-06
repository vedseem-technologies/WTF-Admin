import { useState, useEffect } from "react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";
import Toggle from "../../../components/ui/Toggle";
import ImageUpload from "../../../components/ui/ImageUpload";
import { getThumbnail } from "../../../utils/imageOptimizer";
import NewMenuDropdown from "../../../components/ui/NewMenuDropdown";
import "../../occasions/pages/Occasions.css"; // Reusing same styles

import useCursorPagination from "../../../hooks/useCursorPagination";

const Services = () => {
  const {
    addService,
    updateService,
    deleteService,
    toggleServiceActive,
    getServiceMenuSelection,
    saveServiceMenuSelection,
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
    data: services,
    loading: loadingServices,
    pageInfo,
    handleNext,
    handlePrev,
    refresh: refreshServices
  } = useCursorPagination('/api/services', {
    limit: 12,
    filters: {
      active: filter === 'active' ? true : (filter === 'inactive' ? false : undefined),
      search: debouncedSearchTerm || undefined
    }
  });

  // Fetch menu items for dropdowns (fetch all/large limit)
  const { data: menuItems } = useCursorPagination('/api/menu-items', { limit: 1000, filters: { active: true } });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    active: true,
  });

  // Wrapper for refreshing list after actions
  const handleAddService = async (data) => {
    await addService(data);
    refreshServices();
  };

  const handleUpdateService = async (id, data) => {
    await updateService(id, data);
    refreshServices();
  };

  const handleDeleteService = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      await deleteService(id);
      refreshServices();
    }
  };

  const handleToggleService = async (id) => {
    await toggleServiceActive(id);
    refreshServices();
  };


  // ... state ... (Menu selection state remains)

  // ... (handleOpenModal logic etc remains, it uses service which is passed in)

  // handleSubmit Logic replacement
  const handleSubmit = async (e) => {
    e.preventDefault();

    let serviceId;
    let responseService;

    if (editingService) {
      responseService = await updateService(editingService._id, formData);
      serviceId = editingService._id;
    } else {
      responseService = await addService(formData);
      if (responseService) {
        serviceId = responseService._id;
      }
    }

    refreshServices();

    if (serviceId) {
      // (Menu selection logic same as before)
      console.log("Preparing to Save Service - State Check:", {
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
      await saveServiceMenuSelection(serviceId, menuSelection);
    }
    handleCloseModal();
  };


  return (
    <div className="page-container">
      <div className="page-filters">
        <input
          type="text"
          className="form-control search-input"
          placeholder="🔍 Search services..."
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
            + Add Service
          </button>
        </div>
      </div>

      {loadingServices && services.length === 0 ? (
        <div className="text-center py-10">Loading...</div>
      ) : services.length > 0 ? (
        <>
          <div className="occasions-grid">
            {services.map((service) => (
              <div
                key={service._id}
                className={`occasion-card ${!service.active ? "inactive" : ""}`}
              >
                <div className="occasion-image">
                  <img
                    src={getThumbnail(service.image)}
                    alt={service.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                  {!service.active && (
                    <div className="inactive-overlay">Inactive</div>
                  )}
                </div>
                <div className="occasion-content">
                  <h3 className="occasion-title">{service.title}</h3>
                  <div className="occasion-actions">
                    <div className="occasion-toggle">
                      <span className="toggle-label">Active</span>
                      <Toggle
                        checked={service.active}
                        onChange={() => handleToggleService(service._id)}
                      />
                    </div>
                    <div className="occasion-buttons">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleOpenModal(service)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteService(service._id)}
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
              disabled={!pageInfo.hasPrevPage || loadingServices}
              className="btn btn-outline"
            >
              ⬅️ Previous
            </button>
            <span className="text-gray-500">
              {loadingServices ? 'Loading...' : ''}
            </span>
            <button
              onClick={handleNext}
              disabled={!pageInfo.hasNextPage || loadingServices}
              className="btn btn-outline"
            >
              Next ➡️
            </button>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">🍽️</span>
          <h3>No services found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )
      }

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingService ? "Edit Service" : "Add New Service"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Service Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Buffet Service, Full Service, Cocktail"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <ImageUpload
            label="Service Image *"
            value={formData.image}
            onChange={(image) => setFormData({ ...formData, image })}
          />

          <div className="form-group">
            <div className="toggle-field">
              <div>
                <label className="form-label">Active Status</label>
                <p className="form-help">Show this service on the frontend</p>
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
              {editingService ? "Update Service" : "Add Service"}
            </button>
          </div>
        </form>
      </Modal>
    </div >
  );
};

export default Services;
