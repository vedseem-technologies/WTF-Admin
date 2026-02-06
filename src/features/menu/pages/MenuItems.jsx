import { useState, useEffect } from "react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";
import Toggle from "../../../components/ui/Toggle";
import ImageUpload from "../../../components/ui/ImageUpload";
import { getThumbnail } from "../../../utils/imageOptimizer";
import "./MenuItems.css";
import useCursorPagination from "../../../hooks/useCursorPagination";

const MENU_CATEGORIES = [
  { id: "Starter", name: "Starter", icon: "🥗" },
  { id: "Main Course", name: "Main Course", icon: "🍛" },
  { id: "Rice & Bread", name: "Rice & Bread", icon: "🍚" },
  { id: "Dessert", name: "Dessert", icon: "🍰" },
];

const LEGACY_CATEGORY_MAP = {
  1: "Starter",
  2: "Main Course",
  3: "Rice & Bread",
  4: "Dessert"
};

const MenuItems = ({ categoryId = null, titleOverride = null }) => {
  const {
    addMenuItem,
    addBulkMenuItems,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemActive,
  } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  // Debounce search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [categoryFilter, setCategoryFilter] = useState(
    categoryId ? categoryId.toString() : "all",
  );
  // Update category filter if prop changes
  useEffect(() => {
    if (categoryId) setCategoryFilter(categoryId.toString());
  }, [categoryId]);

  const [typeFilter, setTypeFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");

  const {
    data: menuItems,
    loading: loadingMenuItems,
    pageInfo,
    handleNext,
    handlePrev,
    refresh: refreshMenuItems
  } = useCursorPagination('/api/menu-items', {
    limit: 20, // Higher limit for menu items usually
    filters: {
      active: activeFilter === 'active' ? true : (activeFilter === 'inactive' ? false : undefined),
      search: debouncedSearchTerm || undefined,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      type: typeFilter !== 'all' ? typeFilter : undefined
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    type: "Veg",
    category: categoryId || MENU_CATEGORIES[0].id,
    active: true,
    people: 20,
    quantity: 0,
    measurement: "kg",
    unitPrice: 0,
  });

  const [bulkData, setBulkData] = useState("");

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        image: item.image,
        type: item.type,
        category: LEGACY_CATEGORY_MAP[item.category] || item.category,
        active: item.active,
        people: item.people,
        quantity: item.quantity,
        measurement: item.measurement,
        unitPrice: item.unitPrice,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        image: "",
        type: "Veg",
        category: categoryId || MENU_CATEGORIES[0].id,
        active: true,
        people: 20,
        quantity: 0,
        measurement: "kg",
        unitPrice: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleError = (error) => {
    console.error("Action error:", error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateMenuItem(editingItem._id, formData);
      } else {
        await addMenuItem(formData);
      }
      refreshMenuItems();
      handleCloseModal();
    } catch (e) { handleError(e); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        await deleteMenuItem(id);
        refreshMenuItems();
      } catch (e) { handleError(e); }
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleMenuItemActive(id);
      refreshMenuItems();
    } catch (e) { handleError(e); }
  }

  const handleBulkAdd = async (e) => {
    e.preventDefault();

    const lines = bulkData.trim().split("\n");
    const items = lines.map((line) => {
      const [name, catName, type, quantity, measurement, unitPrice] = line
        .split(",")
        .map((s) => s.trim());

      // Validate category
      const matchedCategory = MENU_CATEGORIES.find(c => c.name.toLowerCase() === (catName || "").toLowerCase()) || MENU_CATEGORIES[0];

      return {
        name,
        category: matchedCategory.id,
        type: type || "Veg",
        quantity: parseFloat(quantity) || 1,
        measurement: measurement || "kg",
        unitPrice: parseFloat(unitPrice) || 0,
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
        active: true,
        people: 20,
      };
    });

    try {
      await addBulkMenuItems(items);
      refreshMenuItems();
      setBulkData("");
      setIsBulkModalOpen(false);
    } catch (e) { handleError(e); }
  };

  const getCategoryName = (catId) => {
    const category = MENU_CATEGORIES.find((c) => c.id === catId);
    return category ? category.name : "Unknown";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="page-container">
      <div className="page-filters">
        <input
          type="text"
          className="form-control search-input"
          placeholder="🔍 Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-buttons" style={{ marginLeft: "auto" }}>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Add Item
          </button>
        </div>
      </div>

      <div className="table-container">
        {loadingMenuItems && menuItems.length === 0 ? (
          <div className="loading-state">
            <h3>...loading</h3>
          </div>
        ) : menuItems.length > 0 ? (
          <>
            <table className="table menu-items-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Measurement</th>
                  <th>Unit Price</th>
                  <th>People</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="item-image">
                        <img
                          src={getThumbnail(item.image)}
                          alt={item.name}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                        />
                      </div>
                    </td>
                    <td className="font-semibold">{item.name}</td>
                    <td>
                      <span className="badge badge-info">
                        {LEGACY_CATEGORY_MAP[item.category] || item.category || "-"}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge badge-${item.type === "Veg" ? "success" : "danger"}`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td>{item.quantity}</td>
                    <td>{item.measurement}</td>
                    <td>{formatCurrency(item.unitPrice)}</td>
                    <td>{item.people}</td>
                    <td>
                      <Toggle
                        checked={item.active}
                        onChange={() => handleToggle(item._id)}
                      />
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleOpenModal(item)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item._id)}
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
                disabled={!pageInfo.hasPrevPage || loadingMenuItems}
                className="btn btn-outline"
              >
                ⬅️ Previous
              </button>
              <span className="text-gray-500">
                {loadingMenuItems ? 'Loading...' : ''}
              </span>
              <button
                onClick={handleNext}
                disabled={!pageInfo.hasNextPage || loadingMenuItems}
                className="btn btn-outline"
              >
                Next ➡️
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">🍕</span>
            <h3>No menu items found</h3>
            <p>Try adjusting your filters or add new items</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? "Edit Menu Item" : "Add New Menu Item"}
        size="large"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Item Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Paneer Butter Masala"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              >
                {MENU_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type *</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
              >
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Quantity *</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g., 100"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity:
                      e.target.value === "" ? 0 : parseFloat(e.target.value),
                  })
                }
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Measurement *</label>
              <select
                className="form-select"
                value={formData.measurement}
                onChange={(e) =>
                  setFormData({ ...formData, measurement: e.target.value })
                }
                required
              >
                <option value="kg">kg</option>
                <option value="pcs">pcs</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Unit Price (₹) *</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g., 150"
                value={formData.unitPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unitPrice:
                      e.target.value === "" ? 0 : parseFloat(e.target.value),
                  })
                }
                required
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Serves (People) *</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g., 20"
                value={formData.people}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    people:
                      e.target.value === "" ? 1 : parseInt(e.target.value),
                  })
                }
                required
                min="1"
              />
            </div>
          </div>

          <ImageUpload
            label="Item Image *"
            value={formData.image}
            onChange={(image) => setFormData({ ...formData, image })}
          />

          <div className="form-group">
            <div className="toggle-field">
              <div>
                <label className="form-label">Active Status</label>
                <p className="form-help">Show this item on the menu</p>
              </div>
              <Toggle
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
              />
            </div>
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
              {editingItem ? "Update Item" : "Add Item"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        title="Bulk Add Menu Items"
        size="large"
      >
        <form onSubmit={handleBulkAdd}>
          <div className="form-group">
            <label className="form-label">Bulk Data (CSV Format)</label>
            <textarea
              className="form-textarea"
              style={{ minHeight: "300px" }}
              placeholder="Enter items in CSV format (one per line):
Name, CategoryID, Type, Quantity, Measurement, UnitPrice

Example:
Dal Makhani, 2, Veg, 200, kg, 120
Chicken Tikka, 1, Non-Veg, 150, pcs, 180
Jeera Rice, 3, Veg, 200, kg, 60"
              value={bulkData}
              onChange={(e) => setBulkData(e.target.value)}
              required
            />
            <p className="form-help">
              Format: Name, CategoryID, Type (Veg/Non-Veg), Quantity,
              Measurement (kg/pcs), UnitPrice
            </p>
            <p className="form-help">
              Category Names:{" "}
              {MENU_CATEGORIES.map((c) => c.name).join(", ")}
            </p>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsBulkModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Items
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MenuItems;
