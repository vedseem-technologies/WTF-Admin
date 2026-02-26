import { useState } from "react";
import { Star, Pencil, Trash2, Search } from "lucide-react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";
import ImageUpload from "../../../components/ui/ImageUpload";
import { getThumbnail } from "../../../utils/imageOptimizer";
import { useDialog } from "../../../context/DialogContext";

const PopularItems = () => {
  const {
    popularItems,
    loadingPopularItems,
    addPopularItem,
    updatePopularItem,
    deletePopularItem,
  } = useData();
  const { confirm } = useDialog();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    price: "",
    rating: 5,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        image: item.image,
        description: item.description,
        price: item.price,
        rating: item.rating,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        image: "",
        description: "",
        price: "",
        rating: 5,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updatePopularItem(editingItem._id, formData);
    } else {
      addPopularItem(formData);
    }
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    const ok = await confirm("This action cannot be undone.", {
      title: "Delete Popular Item?",
      variant: "danger",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    deletePopularItem(id);
  };

  const filteredItems = popularItems
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => (b.createdAt || b._id).localeCompare(a.createdAt || a._id));

  const renderStars = (rating) => {
    return Array(rating)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className="inline text-warning fill-warning" size={14} />
      ));
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-4 rounded-xl shadow-sm border border-border">
        <input
          type="text"
          className="w-full max-w-sm px-4 py-2 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
          placeholder="Search popular items..."
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
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-100">
              <th className="px-4 py-3 font-semibold text-secondary w-20">
                Image
              </th>
              <th className="px-4 py-3 font-semibold text-secondary w-48">
                Name
              </th>
              <th className="px-4 py-3 font-semibold text-secondary hidden md:table-cell">
                Description
              </th>
              <th className="px-4 py-3 font-semibold text-secondary w-24">
                Price
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
            {filteredItems.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <img
                      src={getThumbnail(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 font-bold text-secondary">
                  {item.name}
                </td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell max-w-xs truncate">
                  {item.description}
                </td>
                <td className="px-4 py-3 font-semibold text-primary">
                  ₹{item.price}
                </td>
                <td className="px-4 py-3">
                  <span className="text-warning text-sm tracking-widest">
                    {renderStars(item.rating)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="p-1.5 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all"
                      onClick={() => handleOpenModal(item)}
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="p-1.5 bg-danger-light text-danger border border-danger/20 rounded-lg hover:bg-danger hover:text-white transition-all"
                      onClick={() => handleDelete(item._id)}
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

        {loadingPopularItems ? (
          <div className="flex justify-center p-8 text-gray-400">
            <p className="animate-pulse">...loading</p>
          </div>
        ) : (
          !loadingPopularItems &&
          filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Star size={48} className="mb-3 text-gray-400" />
              <h3 className="text-lg font-semibold text-secondary">
                No popular items found
              </h3>
              <p className="text-sm">Start by adding your first popular item</p>
            </div>
          )
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? "Edit Popular Item" : "Add New Popular Item"}
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

          <div>
            <label className="block mb-1.5 text-sm font-medium text-secondary">
              Description *
            </label>
            <textarea
              className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all text-sm resize-none"
              placeholder="Enter item description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows="4"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-secondary">
                Price (₹) *
              </label>
              <input
                type="number"
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all text-sm"
                placeholder="e.g., 250"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  })
                }
                required
                min="0"
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-secondary">
                Rating *
              </label>
              <select
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all text-sm bg-white"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: parseInt(e.target.value) })
                }
                required
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
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
              {editingItem ? "Update Item" : "Add Item"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PopularItems;
