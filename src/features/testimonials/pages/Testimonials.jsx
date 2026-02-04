import { useState } from "react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";
import ImageUpload from "../../../components/ui/ImageUpload";

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

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    quote: "",
    rating: 5,
    image: "",
  });

  const handleOpenModal = (testimonial = null) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData({
        name: testimonial.name,
        role: testimonial.role,
        quote: testimonial.quote,
        rating: testimonial.rating,
        image: testimonial.image,
      });
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: "",
        role: "",
        quote: "",
        rating: 5,
        image: "",
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
      quote: "",
      rating: 5,
      image: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial._id, formData);
      } else {
        await addTestimonial(formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving testimonial:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await deleteTestimonial(id);
      } catch (error) {
        console.error("Error deleting testimonial:", error);
      }
    }
  };

  const handleImageChange = (image) => {
    setFormData({ ...formData, image });
  };

  const filteredTestimonials = testimonials.filter(
    (testimonial) =>
      testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.role.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loadingTestimonials) {
    return <div className="loading-state">Loading testimonials...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-filters">
        <input
          type="text"
          className="form-control search-input"
          placeholder="🔍 Search testimonials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-buttons" style={{ marginLeft: "auto" }}>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Add New
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Role</th>
              <th>Quote</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTestimonials.map((testimonial) => (
              <tr key={testimonial._id}>
                <td>
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="table-thumbnail"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td className="font-medium">{testimonial.name}</td>
                <td className="text-secondary">{testimonial.role}</td>
                <td
                  style={{
                    maxWidth: "300px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {testimonial.quote}
                </td>
                <td>{"⭐".repeat(testimonial.rating)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleOpenModal(testimonial)}
                      style={{ marginRight: "8px" }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(testimonial._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTestimonials.length === 0 && (
          <div className="empty-state">
            <p>No testimonials found</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
      >
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Client Image</label>
            <ImageUpload
              image={formData.image}
              onImageChange={handleImageChange}
              onRemove={() => setFormData({ ...formData, image: "" })}
            />
          </div>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Role / Designation</label>
            <input
              type="text"
              className="form-control"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              placeholder="e.g. CEO, Food Blogger"
              required
            />
          </div>

          <div className="form-group">
            <label>Quote</label>
            <textarea
              className="form-control"
              value={formData.quote}
              onChange={(e) =>
                setFormData({ ...formData, quote: e.target.value })
              }
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>Rating (1-5)</label>
            <select
              className="form-control"
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: parseInt(e.target.value) })
              }
            >
              <option value={1}>1 Star</option>
              <option value={2}>2 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={5}>5 Stars</option>
            </select>
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
              {editingTestimonial ? "Save Changes" : "Add Testimonial"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Testimonials;
