import { useState } from "react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";
import { FolderOpen, ArrowUp, ArrowDown, Pencil, Trash2 } from "lucide-react";
import "./MenuCategories.css";
import { useDialog } from "../../../context/DialogContext";

const MenuCategories = () => {
  const {
    menuCategories,
    addMenuCategory,
    updateMenuCategory,
    deleteMenuCategory,
    reorderMenuCategories,
  } = useData();
  const { confirm } = useDialog();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", icon: "" });

  const sortedCategories = [...menuCategories].sort(
    (a, b) => a.order - b.order,
  );

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, icon: category.icon });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", icon: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", icon: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingCategory) {
      updateMenuCategory(editingCategory.id, formData);
    } else {
      addMenuCategory(formData);
    }

    handleCloseModal();
  };

  const handleDelete = async (id) => {
    const ok = await confirm("This action cannot be undone.", {
      title: "Delete Menu Category?",
      variant: "danger",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    deleteMenuCategory(id);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newCategories = [...sortedCategories];
    [newCategories[index - 1], newCategories[index]] = [
      newCategories[index],
      newCategories[index - 1],
    ];
    newCategories.forEach((cat, idx) => {
      cat.order = idx + 1;
    });
    reorderMenuCategories(newCategories);
  };

  const moveDown = (index) => {
    if (index === sortedCategories.length - 1) return;
    const newCategories = [...sortedCategories];
    [newCategories[index], newCategories[index + 1]] = [
      newCategories[index + 1],
      newCategories[index],
    ];
    newCategories.forEach((cat, idx) => {
      cat.order = idx + 1;
    });
    reorderMenuCategories(newCategories);
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-secondary flex items-center">
            <FolderOpen size={24} className="mr-2 text-primary" /> Menu
            Categories
          </h2>
          <p className="text-sm text-gray-500">
            Organize menu item categories (used in dropdown)
          </p>
        </div>
        <button
          className="px-5 py-2.5 bg-primary-gradient text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm"
          onClick={() => handleOpenModal()}
        >
          + Add Menu Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCategories.map((category, index) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-sm border border-border p-6 relative flex flex-col hover:shadow-md transition-shadow"
          >
            <div className="absolute top-4 right-4 text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
              #{category.order}
            </div>
            <div className="text-4xl mb-4">{category.icon}</div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-secondary mb-1">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500">
                Display order: {category.order}
              </p>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  className="p-1.5 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  title="Move up"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  className="p-1.5 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  onClick={() => moveDown(index)}
                  disabled={index === sortedCategories.length - 1}
                  title="Move down"
                >
                  <ArrowDown size={16} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 text-xs bg-primary/10 text-primary border border-primary/20 rounded-lg font-medium hover:bg-primary hover:text-white transition-all"
                  onClick={() => handleOpenModal(category)}
                >
                  <Pencil size={14} className="inline mr-1 -mt-0.5" /> Edit
                </button>
                <button
                  className="px-3 py-1.5 text-xs bg-danger-light text-danger border border-danger/20 rounded-lg font-medium hover:bg-danger hover:text-white transition-all"
                  onClick={() => handleDelete(category.id)}
                >
                  <Trash2 size={14} className="inline mr-1 -mt-0.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sortedCategories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <FolderOpen size={48} className="mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-1">
            No menu categories found
          </h3>
          <p className="text-sm">Add categories to organize your menu items</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? "Edit Menu Category" : "Add New Menu Category"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1.5 text-sm font-medium text-secondary">
              Category Name *
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
              placeholder="e.g., Starter, Main Course, Dessert"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1.5 text-sm font-medium text-secondary">
              Icon/Emoji *
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
              placeholder="e.g., Salad, Chef, Cake"
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
              required
              maxLength={2}
            />
            <p className="text-xs text-gray-500 mt-1">
              Use an emoji to represent this category
            </p>
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
              {editingCategory ? "Update Category" : "Add Category"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MenuCategories;
