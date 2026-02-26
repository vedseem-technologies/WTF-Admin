import { useState, useEffect } from "react";
import { Search, Pencil, Trash2, MessageSquare, Star } from "lucide-react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";
import useCursorPagination from "../../../hooks/useCursorPagination";
import { useDialog } from "../../../context/DialogContext";

const Testimonials = () => {
  const { addTestimonial, updateTestimonial, deleteTestimonial } = useData();
  const { confirm, alert } = useDialog();

  const [searchTerm, setSearchTerm] = useState("");
  // Debounce search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: testimonials,
    loading: loadingTestimonials,
    pageInfo,
    handleNext,
    handlePrev,
    refresh: refreshTestimonials,
  } = useCursorPagination("/api/testimonials", {
    limit: 12,
    filters: {
      search: debouncedSearchTerm || undefined,
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    text: "",
    rating: 5,
    date: "",
  });

  const handleOpenModal = (testimonial = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        role: testimonial.role,
        text: testimonial.text,
        rating: testimonial.rating,
        date: testimonial.date || "",
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: "",
        role: "",
        text: "",
        rating: 5,
        date: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
    setFormData({
      name: "",
      role: "",
      text: "",
      rating: 5,
      date: "",
    });
    setIsSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial._id, formData);
      } else {
        await addTestimonial(formData);
      }
      refreshTestimonials();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      await alert("Failed to save testimonial. Please try again.", {
        title: "Error",
        variant: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm("This action cannot be undone.", {
      title: "Delete Testimonial?",
      variant: "danger",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    try {
      await deleteTestimonial(id);
      refreshTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      await alert("Failed to delete testimonial.", {
        title: "Error",
        variant: "danger",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
            placeholder="Search testimonials by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            <Search size={18} />
          </span>
        </div>
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-gradient text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm"
          onClick={() => handleOpenModal()}
        >
          + Add New
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-border overflow-hidden">
        {loadingTestimonials && testimonials.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-gray-500">Loading testimonials...</div>
          </div>
        ) : testimonials.length > 0 ? (
          <>
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {testimonials.map((testimonial) => (
                  <tr
                    key={testimonial._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {testimonial.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {testimonial.role}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="text-sm text-gray-900 line-clamp-2"
                        style={{
                          maxWidth: "300px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                        title={testimonial.text}
                      >
                        {testimonial.text}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {testimonial.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-500">
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className="fill-current text-yellow-500"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                        onClick={() => handleOpenModal(testimonial)}
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 transition-colors"
                        onClick={() => handleDelete(testimonial._id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <button
                onClick={handlePrev}
                disabled={!pageInfo.hasPrevPage || loadingTestimonials}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                ← Previous
              </button>
              <span className="text-sm text-gray-500">
                {loadingTestimonials ? (
                  <span className="animate-pulse">Loading…</span>
                ) : (
                  ""
                )}
              </span>
              <button
                onClick={handleNext}
                disabled={!pageInfo.hasNextPage || loadingTestimonials}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                Next →
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <MessageSquare size={48} className="mb-4 text-gray-400" />
            <p className="text-lg font-semibold">No testimonials found</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
      >
        <form onSubmit={handleSubmit} className="modal-form space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="form-control w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role / Designation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="form-control w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                placeholder="e.g. Wedding Client"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Review Text <span className="text-red-500">*</span>
            </label>
            <textarea
              className="form-control w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              rows="4"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                className="form-control w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <select
                className="form-control w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rating: parseInt(e.target.value),
                  })
                }
              >
                <option value={1}>1 Star</option>
                <option value={2}>2 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="px-5 py-2.5 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-primary-gradient text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60"
            >
              {isSubmitting
                ? "Saving..."
                : editingTestimonial
                  ? "Save Changes"
                  : "Add Testimonial"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Testimonials;
