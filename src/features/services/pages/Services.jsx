import { useState, useEffect } from "react";
import {
  Search,
  Pencil,
  Trash2,
  BellRing,
  Salad,
  Utensils,
  Cake,
  UtensilsCrossed,
} from "lucide-react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";
import Toggle from "../../../components/ui/Toggle";
import ImageUpload from "../../../components/ui/ImageUpload";
import { getThumbnail } from "../../../utils/imageOptimizer";
import NewMenuDropdown from "../../../components/ui/NewMenuDropdown";

import useCursorPagination from "../../../hooks/useCursorPagination";
import { useDialog } from "../../../context/DialogContext";

const Services = () => {
  const {
    addService,
    updateService,
    deleteService,
    toggleServiceActive,
    getServiceMenuSelection,
    saveServiceMenuSelection,
  } = useData();
  const { confirm } = useDialog();

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
    page,
    handleNext,
    handlePrev,
    refresh: refreshServices,
  } = useCursorPagination("/api/services", {
    limit: 12,
    filters: {
      active:
        filter === "active" ? true : filter === "inactive" ? false : undefined,
      search: debouncedSearchTerm || undefined,
    },
  });

  // Fetch menu items for dropdowns (fetch all/large limit)
  const { data: menuItems } = useCursorPagination("/api/menu-items", {
    limit: 1000,
    filters: { active: true },
  });

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
    const ok = await confirm("This action cannot be undone.", {
      title: "Delete Service?",
      variant: "danger",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    await deleteService(id);
    refreshServices();
  };

  const handleToggleService = async (id) => {
    await toggleServiceActive(id);
    refreshServices();
  };

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

  const handleOpenModal = async (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        image: service.image,
        active: service.active,
      });

      // Load menu selection
      setIsLoadingSelection(true);
      try {
        const savedSelection = await getServiceMenuSelection(service._id);

        if (savedSelection) {
          const mapItems = (data) => {
            if (!data || !Array.isArray(data)) return [];
            let itemsToMap = [];
            if (data.length > 0 && typeof data[0] === "object" && data[0]._id) {
              itemsToMap = data;
            } else {
              itemsToMap = menuItems.filter((item) => data.includes(item._id));
            }
            return itemsToMap;
          };

          const filterByCategory = (items, categoryName, categoryId) => {
            return items.filter(
              (i) => i.category === categoryName || i.category == categoryId,
            );
          };

          const mappedSelectedStarters = mapItems(savedSelection.starters);
          const mappedSelectedMain = mapItems(savedSelection.mainCourses);
          const mappedSelectedDesserts = mapItems(savedSelection.desserts);
          const mappedSelectedBreadRice = mapItems(savedSelection.breadRice);

          const mappedUnselectedStarters = mapItems(
            savedSelection.unselectedStarters,
          );
          const mappedUnselectedMain = mapItems(
            savedSelection.unselectedMainCourses,
          );
          const mappedUnselectedDesserts = mapItems(
            savedSelection.unselectedDesserts,
          );
          const mappedUnselectedBreadRice = mapItems(
            savedSelection.unselectedBreadRice,
          );

          setSelectedStarters(
            filterByCategory(mappedSelectedStarters, "Starter", 1),
          );
          setSelectedMainCourse(
            filterByCategory(mappedSelectedMain, "Main Course", 2),
          );
          setSelectedDesserts(
            filterByCategory(mappedSelectedDesserts, "Dessert", 4),
          );
          setSelectedBreadRice(
            filterByCategory(mappedSelectedBreadRice, "Rice & Bread", 3),
          );

          setUnselectedStarters(
            filterByCategory(mappedUnselectedStarters, "Starter", 1),
          );
          setUnselectedMainCourse(
            filterByCategory(mappedUnselectedMain, "Main Course", 2),
          );
          setUnselectedDesserts(
            filterByCategory(mappedUnselectedDesserts, "Dessert", 4),
          );
          setUnselectedBreadRice(
            filterByCategory(mappedUnselectedBreadRice, "Rice & Bread", 3),
          );
        } else {
          // Fallback
          setUnselectedStarters(
            menuItems.filter(
              (i) => i.category === "Starter" || i.category == 1,
            ),
          );
          setUnselectedMainCourse(
            menuItems.filter(
              (i) => i.category === "Main Course" || i.category == 2,
            ),
          );
          setUnselectedDesserts(
            menuItems.filter(
              (i) => i.category === "Dessert" || i.category == 4,
            ),
          );
          setUnselectedBreadRice(
            menuItems.filter(
              (i) => i.category === "Rice & Bread" || i.category == 3,
            ),
          );

          setSelectedStarters([]);
          setSelectedMainCourse([]);
          setSelectedDesserts([]);
          setSelectedBreadRice([]);
        }
      } catch (error) {
        console.error("Error loading menu selection:", error);
        setSelectedStarters([]);
        setSelectedMainCourse([]);
        setSelectedDesserts([]);
        setSelectedBreadRice([]);
      }
      setIsLoadingSelection(false);
    } else {
      setEditingService(null);
      setFormData({
        title: "",
        image: "",
        active: true,
      });
      // Strict Initialization
      setUnselectedStarters(
        menuItems.filter((i) => i.category === "Starter" || i.category == 1),
      );
      setUnselectedMainCourse(
        menuItems.filter(
          (i) => i.category === "Main Course" || i.category == 2,
        ),
      );
      setUnselectedDesserts(
        menuItems.filter((i) => i.category === "Dessert" || i.category == 4),
      );
      setUnselectedBreadRice(
        menuItems.filter(
          (i) => i.category === "Rice & Bread" || i.category == 3,
        ),
      );

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
    setEditingService(null);
    setFormData({
      title: "",
      image: "",
      active: true,
    });
    setSelectedStarters([]);
    setSelectedMainCourse([]);
    setSelectedDesserts([]);
    setSelectedBreadRice([]);

    setUnselectedStarters([]);
    setUnselectedMainCourse([]);
    setUnselectedDesserts([]);
    setUnselectedBreadRice([]);

    setOpenDropdown(null);
    setDropdownSearchTerms({
      starter: "",
      mainCourse: "",
      dessert: "",
      breadRice: "",
    });
  };

  const updateSelection = (
    category,
    newSelected,
    allCategoryItems,
    setUnselected,
  ) => {
    const selectedIds = new Set(newSelected.map((i) => i._id));
    const newUnselected = allCategoryItems.filter(
      (i) => !selectedIds.has(i._id),
    );
    setUnselected(newUnselected);
  };

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
      const menuSelection = {
        starters: selectedStarters.map((item) => item._id),
        mainCourses: selectedMainCourse.map((item) => item._id),
        desserts: selectedDesserts.map((item) => item._id),
        breadRice: selectedBreadRice.map((item) => item._id),
        unselectedStarters: unselectedStarters.map((i) => i._id),
        unselectedMainCourses: unselectedMainCourse.map((i) => i._id),
        unselectedDesserts: unselectedDesserts.map((i) => i._id),
        unselectedBreadRice: unselectedBreadRice.map((i) => i._id),
      };
      await saveServiceMenuSelection(serviceId, menuSelection);
    }
    handleCloseModal();
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          className="flex-1 min-w-[200px] px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center gap-2 ml-auto">
          {["all", "active", "inactive"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize ${filter === f ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-gradient text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm"
            onClick={() => handleOpenModal()}
          >
            + Add Service
          </button>
        </div>
      </div>

      {loadingServices && services.length === 0 ? (
        <div className="flex justify-center py-16 text-gray-400 text-lg">
          Loading...
        </div>
      ) : services.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {services.map((service) => (
              <div
                key={service._id}
                className={`bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-all overflow-hidden ${!service.active ? "opacity-60" : ""}`}
              >
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  <img
                    src={getThumbnail(service.image)}
                    alt={service.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover"
                  />
                  {!service.active && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold bg-black/60 px-2 py-1 rounded">
                        Inactive
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-secondary text-sm mb-3">
                    {service.title}
                  </h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">Active</span>
                    <Toggle
                      checked={service.active}
                      onChange={() => handleToggleService(service._id)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-1.5 text-xs border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all"
                      onClick={() => handleOpenModal(service)}
                    >
                      <Pencil className="inline mr-1 -mt-0.5" size={14} /> Edit
                    </button>
                    <button
                      className="flex-1 py-1.5 text-xs bg-danger text-white rounded-lg font-medium hover:bg-red-700 transition-all"
                      onClick={() => handleDeleteService(service._id)}
                    >
                      <Trash2 className="inline mr-1 -mt-0.5" size={14} />{" "}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between my-6 px-2">
            <button
              onClick={handlePrev}
              disabled={!pageInfo.hasPrevPage || loadingServices}
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              ← Previous
            </button>
            <span className="text-sm font-medium text-gray-500 min-w-[80px] text-center">
              {loadingServices ? (
                <span className="animate-pulse">Loading…</span>
              ) : (
                `Page ${page}`
              )}
            </span>
            <button
              onClick={handleNext}
              disabled={!pageInfo.hasNextPage || loadingServices}
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              Next →
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <BellRing size={48} className="mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-1">No services found</h3>
          <p className="text-sm">Try adjusting your search criteria</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingService ? "Edit Service" : "Add New Service"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1.5 text-sm font-medium text-secondary">
              Service Title *
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
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
          <div className="mb-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <label className="block text-sm font-medium text-secondary">
                  Active Status
                </label>
                <p className="text-xs text-gray-500">
                  Show this service on the frontend
                </p>
              </div>
              <Toggle
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-secondary mb-3">
              Menu Selection
            </h4>
            {isLoadingSelection ? (
              <div className="text-sm text-gray-400 py-4">
                Loading menu data...
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <NewMenuDropdown
                  label="Starters"
                  icon={
                    <Salad className="inline text-primary mr-1" size={16} />
                  }
                  selected={selectedStarters}
                  setSelected={(ns) => {
                    setSelectedStarters(ns);
                    updateSelection(
                      "starter",
                      ns,
                      menuItems.filter((i) => i.category === "Starter"),
                      setUnselectedStarters,
                    );
                  }}
                  options={menuItems.filter((i) => i.category === "Starter")}
                  categoryKey="starter"
                  searchTerms={dropdownSearchTerms}
                  setSearchTerms={setDropdownSearchTerms}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                />
                <NewMenuDropdown
                  label="Main Course"
                  icon={
                    <Utensils className="inline text-primary mr-1" size={16} />
                  }
                  selected={selectedMainCourse}
                  setSelected={(ns) => {
                    setSelectedMainCourse(ns);
                    updateSelection(
                      "mainCourse",
                      ns,
                      menuItems.filter((i) => i.category === "Main Course"),
                      setUnselectedMainCourse,
                    );
                  }}
                  options={menuItems.filter(
                    (i) => i.category === "Main Course",
                  )}
                  categoryKey="mainCourse"
                  searchTerms={dropdownSearchTerms}
                  setSearchTerms={setDropdownSearchTerms}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                />
                <NewMenuDropdown
                  label="Desserts"
                  icon={<Cake className="inline text-primary mr-1" size={16} />}
                  selected={selectedDesserts}
                  setSelected={(ns) => {
                    setSelectedDesserts(ns);
                    updateSelection(
                      "dessert",
                      ns,
                      menuItems.filter((i) => i.category === "Dessert"),
                      setUnselectedDesserts,
                    );
                  }}
                  options={menuItems.filter((i) => i.category === "Dessert")}
                  categoryKey="dessert"
                  searchTerms={dropdownSearchTerms}
                  setSearchTerms={setDropdownSearchTerms}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                />
                <NewMenuDropdown
                  label="Rice & Bread"
                  icon={
                    <UtensilsCrossed
                      className="inline text-primary mr-1"
                      size={16}
                    />
                  }
                  selected={selectedBreadRice}
                  setSelected={(ns) => {
                    setSelectedBreadRice(ns);
                    updateSelection(
                      "breadRice",
                      ns,
                      menuItems.filter((i) => i.category === "Rice & Bread"),
                      setUnselectedBreadRice,
                    );
                  }}
                  options={menuItems.filter(
                    (i) => i.category === "Rice & Bread",
                  )}
                  categoryKey="breadRice"
                  searchTerms={dropdownSearchTerms}
                  setSearchTerms={setDropdownSearchTerms}
                  openDropdown={openDropdown}
                  setOpenDropdown={setOpenDropdown}
                />
              </div>
            )}
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-5 py-2.5 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary-gradient text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              {editingService ? "Update Service" : "Add Service"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Services;
