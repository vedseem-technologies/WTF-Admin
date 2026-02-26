import { useState, useEffect } from "react";
import { Pencil, Trash2, ClipboardList, Star } from "lucide-react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";
import ImageUpload from "../../../components/ui/ImageUpload";
import { getThumbnail } from "../../../utils/imageOptimizer";

import useCursorPagination from "../../../hooks/useCursorPagination";
import { useDialog } from "../../../context/DialogContext";

const MENU_RANGES = ["Paneer Range", "Fast Food Range", "Chinese Range"];

const RangeMenus = () => {
  const { addRangeMenu, updateRangeMenu, deleteRangeMenu } = useData();
  const { confirm } = useDialog();

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
    refresh: refreshRangeMenus,
    setData, // Get setData
  } = useCursorPagination("/api/range-menus", {
    limit: 12,
    filters: {
      search: debouncedSearchTerm || undefined,
    },
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
    handleCloseModal(); // 1. Close modal immediately

    if (editingMenu) {
      // Optimistic Update for Edit
      const originalItems = [...rangeMenus];
      const updatedItem = { ...editingMenu, ...formData };
      setData((prev) =>
        prev.map((item) => (item._id === editingMenu._id ? updatedItem : item)),
      );

      try {
        await updateRangeMenu(editingMenu._id, formData);
        refreshRangeMenus();
      } catch (e) {
        setData(originalItems); // Rollback
        handleError(e);
      }
    } else {
      // Optimistic Update for Add
      const tempId = `temp-${Date.now()}`;
      const optimisticItem = {
        ...formData,
        _id: tempId,
        rating: Number(formData.rating),
      };

      // Prepend to list immediately
      setData((prev) => [optimisticItem, ...prev]);

      try {
        const serverItem = await addRangeMenu(formData);
        // Replace temp item with real item
        setData((prev) =>
          prev.map((item) => (item._id === tempId ? serverItem : item)),
        );
      } catch (e) {
        // Remove temp item on failure
        setData((prev) => prev.filter((item) => item._id !== tempId));
        handleError(e);
      }
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm("This action cannot be undone.", {
      title: "Delete Range Menu Item?",
      variant: "danger",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    try {
      await deleteRangeMenu(id);
      refreshRangeMenus();
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-4 rounded-xl shadow-sm border border-border">
        <input
          type="text"
          className="w-full max-w-sm px-4 py-2 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
          placeholder="Search range menus..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center gap-2 ml-auto">
          <button
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary-gradient text-white rounded-lg font-medium shadow-md hover:-translate-y-0.5 transition-all text-sm"
            onClick={() => handleOpenModal()}
          >
            + Add New
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
        {loadingRangeMenus && rangeMenus.length === 0 ? (
          <div className="flex justify-center p-8 text-gray-400">
            <h3 className="animate-pulse">...loading</h3>
          </div>
        ) : rangeMenus.length > 0 ? (
          <>
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-100">
                  <th className="px-4 py-3 font-semibold text-secondary w-20">
                    Image
                  </th>
                  <th className="px-4 py-3 font-semibold text-secondary w-48">
                    Name
                  </th>
                  <th className="px-4 py-3 font-semibold text-secondary">
                    Range
                  </th>
                  <th className="px-4 py-3 font-semibold text-secondary w-32">
                    Rating
                  </th>
                  <th className="px-4 py-3 font-semibold text-secondary w-32 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rangeMenus.map((menu) => (
                  <tr
                    key={menu._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <img
                          src={getThumbnail(menu.image)}
                          alt={menu.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-secondary">
                      {menu.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-info-light text-info">
                        {menu.range}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-secondary">
                        {menu.rating}{" "}
                        <Star
                          className="inline text-warning fill-warning"
                          size={14}
                        />
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-1.5 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
                          onClick={() => handleOpenModal(menu)}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="p-1.5 bg-danger-light text-danger border border-danger/20 rounded-lg hover:bg-danger hover:text-white transition-all"
                          onClick={() => handleDelete(menu._id)}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center px-4 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={handlePrev}
                disabled={!pageInfo.hasPrevPage || loadingRangeMenus}
                className="px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <span className="text-sm font-medium text-gray-500">
                {loadingRangeMenus ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  ""
                )}
              </span>
              <button
                onClick={handleNext}
                disabled={!pageInfo.hasNextPage || loadingRangeMenus}
                className="px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <ClipboardList size={48} className="mb-3 text-gray-400" />
            <h3 className="text-lg font-semibold text-secondary">
              No range menus found
            </h3>
            <p className="text-sm">
              Start by adding your first range menu item
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMenu ? "Edit Range Menu" : "Add New Range Menu"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUpload
            value={formData.image}
            onChange={(value) => setFormData({ ...formData, image: value })}
            label="Item Image *"
          />

          <div>
            <label className="block mb-1.5 text-sm font-medium text-secondary">
              Name *
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all text-sm"
              placeholder="Enter item name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-secondary">
                Rating *
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full px-4 py-2 pr-8 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all text-sm"
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
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  <Star size={16} />
                </span>
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-secondary">
                Menu Range *
              </label>
              <select
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all text-sm bg-white"
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
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              className="px-5 py-2.5 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary-gradient text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              {editingMenu ? "Update Menu" : "Add Menu"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RangeMenus;
