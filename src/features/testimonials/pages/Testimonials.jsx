import { useState } from "react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";


const Testimonials = () => {
  const {
    testimonials,
    loadingTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
  } = useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
      handleCloseModal();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      alert("Failed to save testimonial. Please check the console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await deleteTestimonial(id);
      } catch (error) {
        console.error("Error deleting testimonial:", error);
        alert("Failed to delete testimonial.");
      }
    }
  };



  const filteredTestimonials = testimonials.filter(
    (testimonial) =>
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loadingTestimonials) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-500">Loading testimonials...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Testimonials</h1>
        <p className="text-gray-600">
          Manage what your clients say about you.
        </p>
      </div>

      <div className="page-filters flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            className="form-control search-input pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Search testimonials by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        <div className="filter-buttons ml-4">
          <button
            className="btn btn-primary"
            onClick={() => handleOpenModal()}
          >
            <span className="mr-2">+</span> Add New
          </button>
        </div>
      </div>

      <div className="table-container bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="table w-full">
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
            {filteredTestimonials.map((testimonial) => (
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
                  {"⭐".repeat(testimonial.rating)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                    onClick={() => handleOpenModal(testimonial)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 transition-colors"
                    onClick={() => handleDelete(testimonial._id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTestimonials.length === 0 && (
          <div className="empty-state p-12 text-center text-gray-500">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-lg">No testimonials found</p>
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

          <div className="modal-actions flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="opacity-75 mr-2">Saving...</span>
                </>
              ) : editingTestimonial ? (
                "Save Changes"
              ) : (
                "Add Testimonial"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Testimonials;
