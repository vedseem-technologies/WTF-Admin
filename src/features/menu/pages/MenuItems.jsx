import { useState, useEffect } from "react";
import { Pencil, Trash2, Utensils } from "lucide-react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";
import Toggle from "../../../components/ui/Toggle";
import ImageUpload from "../../../components/ui/ImageUpload";
import { getThumbnail } from "../../../utils/imageOptimizer";
import useCursorPagination from "../../../hooks/useCursorPagination";
import { useDialog } from "../../../context/DialogContext";

const MENU_CATEGORIES = [
  { id: "Starter", name: "Starter", icon: "??" },
  { id: "Main Course", name: "Main Course", icon: "??" },
  { id: "Rice & Bread", name: "Rice & Bread", icon: "??" },
  { id: "Dessert", name: "Dessert", icon: "??" },
];

const LEGACY_CATEGORY_MAP = {
  1: "Starter",
  2: "Main Course",
  3: "Rice & Bread",
  4: "Dessert",
};

const MenuItems = ({ categoryId = null, titleOverride = null }) => {
  const {
    addMenuItem,
    addBulkMenuItems,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemActive,
  } = useData();
  const { confirm } = useDialog();

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
    refresh: refreshMenuItems,
  } = useCursorPagination("/api/menu-items", {
    limit: 20, // Higher limit for menu items usually
    filters: {
      active:
        activeFilter === "active"
          ? true
          : activeFilter === "inactive"
            ? false
            : undefined,
      search: debouncedSearchTerm || undefined,
      category: categoryFilter !== "all" ? categoryFilter : undefined,
      type: typeFilter !== "all" ? typeFilter : undefined,
    },
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
    } catch (e) {
      handleError(e);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm("This action cannot be undone.", {
      title: "Delete Menu Item?",
      variant: "danger",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    try {
      await deleteMenuItem(id);
      refreshMenuItems();
    } catch (e) {
      handleError(e);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleMenuItemActive(id);
      refreshMenuItems();
    } catch (e) {
      handleError(e);
    }
  };

  const handleBulkAdd = async (e) => {
    e.preventDefault();

    const lines = bulkData.trim().split("\n");
    const items = lines.map((line) => {
      const [name, catName, type, quantity, measurement, unitPrice] = line
        .split(",")
        .map((s) => s.trim());

      // Validate category
      const matchedCategory =
        MENU_CATEGORIES.find(
          (c) => c.name.toLowerCase() === (catName || "").toLowerCase(),
        ) || MENU_CATEGORIES[0];

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
    } catch (e) {
      handleError(e);
    }
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
    <div className="p-6">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          className="flex-1 min-w-[200px] px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-gradient text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm"
          onClick={() => handleOpenModal()}
        >
          + Add Item
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-border overflow-hidden">
        {loadingMenuItems && menuItems.length === 0 ? (
          <div className="flex justify-center py-16 text-gray-400">
            Loading...
          </div>
        ) : menuItems.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-bg-hover border-b-2 border-border">
                    {[
                      "Image",
                      "Item Name",
                      "Category",
                      "Type",
                      "Qty",
                      "Measure",
                      "Unit Price",
                      "Pax",
                      "Active",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b border-gray-50 hover:bg-bg-hover transition-colors last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={getThumbnail(item.image)}
                            alt={item.name}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-sm text-secondary">
                        {item.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-info-light text-info rounded-full">
                          {LEGACY_CATEGORY_MAP[item.category] ||
                            item.category ||
                            "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${item.type === "Veg" ? "bg-success-light text-success" : "bg-danger-light text-danger"}`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {item.measurement}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-secondary">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {item.people}
                      </td>
                      <td className="px-4 py-3">
                        <Toggle
                          checked={item.active}
                          onChange={() => handleToggle(item._id)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            className="px-2.5 py-1 text-xs border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all"
                            onClick={() => handleOpenModal(item)}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="px-2.5 py-1 text-xs bg-danger text-white rounded-lg font-medium hover:bg-red-700 transition-all"
                            onClick={() => handleDelete(item._id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <button
                onClick={handlePrev}
                disabled={!pageInfo.hasPrevPage || loadingMenuItems}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                ← Previous
              </button>
              <span className="text-sm text-gray-500">
                {loadingMenuItems ? (
                  <span className="animate-pulse">Loading…</span>
                ) : (
                  ""
                )}
              </span>
              <button
                onClick={handleNext}
                disabled={!pageInfo.hasNextPage || loadingMenuItems}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                Next →
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Utensils size={48} className="mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-1">No menu items found</h3>
            <p className="text-sm">
              Try adjusting your filters or add new items
            </p>
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
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-secondary">
                Item Name *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
                placeholder="e.g., Paneer Butter Masala"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-secondary">
                Category *
              </label>
              <select
                className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
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
            <div>
              <label className="block mb-1.5 text-sm font-medium text-secondary">
                Type *
              </label>
              <select
                className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
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
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-secondary">
                  Quantity *
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
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
              <div>
                <label className="block mb-1.5 text-sm font-medium text-secondary">
                  Measurement *
                </label>
                <select
                  className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
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
              <div>
                <label className="block mb-1.5 text-sm font-medium text-secondary">
                  Unit Price (₹) *
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
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
            <div>
              <label className="block mb-1.5 text-sm font-medium text-secondary">
                Serves (People) *
              </label>
              <input
                type="number"
                className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
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
          <div className="flex items-center justify-between py-3">
            <div>
              <label className="block text-sm font-medium text-secondary">
                Active Status
              </label>
              <p className="text-xs text-gray-500">
                Show this item on the menu
              </p>
            </div>
            <Toggle
              checked={formData.active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
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
          <div className="mb-4">
            <label className="block mb-1.5 text-sm font-medium text-secondary">
              Bulk Data (CSV Format)
            </label>
            <textarea
              className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all resize-none"
              style={{ minHeight: "250px" }}
              placeholder={`Enter items in CSV format (one per line):\nName, CategoryID, Type, Quantity, Measurement, UnitPrice\n\nExample:\nDal Makhani, 2, Veg, 200, kg, 120`}
              value={bulkData}
              onChange={(e) => setBulkData(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: Name, CategoryID, Type (Veg/Non-Veg), Quantity,
              Measurement (kg/pcs), UnitPrice
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Category Names: {MENU_CATEGORIES.map((c) => c.name).join(", ")}
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsBulkModalOpen(false)}
              className="px-5 py-2.5 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary-gradient text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Add Items
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MenuItems;
