import { useState } from "react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";
import ImageUpload from "../../../components/ui/ImageUpload";
import "../../blogs/pages/Blogs.css"; // Reusing Blogs CSS for similar layout if needed

const Events = () => {
  const { events, loadingEvents, addEvent, updateEvent, deleteEvent } =
    useData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    type: "Festival",
    status: "Upcoming",
    image: "",
  });

  const handleOpenModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        date: event.date,
        location: event.location || "",
        description: event.description,
        type: event.type || "Festival",
        status: event.status || "Upcoming",
        image: event.image || "",
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: "",
        date: "",
        location: "",
        description: "",
        type: "Festival",
        status: "Upcoming",
        image: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setFormData({
      title: "",
      date: "",
      location: "",
      description: "",
      type: "Festival",
      status: "Upcoming",
      image: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await updateEvent(editingEvent._id, formData);
      } else {
        await addEvent(formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id);
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleImageChange = (image) => {
    setFormData({ ...formData, image });
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loadingEvents) {
    return <div className="loading-state">Loading events...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-filters">
        <input
          type="text"
          className="form-control search-input"
          placeholder="🔍 Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-buttons" style={{ marginLeft: "auto" }}>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Add New Event
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map((event) => (
              <tr key={event._id}>
                <td>
                  <img
                    src={event.image || "https://via.placeholder.com/60"}
                    alt={event.title}
                    className="table-thumbnail"
                    style={{
                      width: "60px",
                      height: "40px",
                      borderRadius: "4px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td className="font-medium">{event.title}</td>
                <td>{event.date}</td>
                <td>{event.location}</td>
                <td>
                  <span className="badge badge-secondary">{event.type}</span>
                </td>
                <td>
                  <span
                    className={`badge ${event.status === "Upcoming" ? "badge-success" : "badge-warning"}`}
                  >
                    {event.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleOpenModal(event)}
                      style={{ marginRight: "8px" }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(event._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEvents.length === 0 && (
          <div className="empty-state">
            <p>No events found</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEvent ? "Edit Event" : "Add New Event"}
      >
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Event Image</label>
            <ImageUpload
              image={formData.image}
              onImageChange={handleImageChange}
              onRemove={() => setFormData({ ...formData, image: "" })}
            />
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="text"
              className="form-control"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              placeholder="e.g. February 15-17, 2026"
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              className="form-control"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g. Central Park, Delhi"
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <input
              type="text"
              className="form-control"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              placeholder="e.g. Festival, Tasting Event"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Limited Seats">Limited Seats</option>
              <option value="Open for All">Open for All</option>
              <option value="Past">Past</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="4"
              required
            />
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
              {editingEvent ? "Save Changes" : "Add Event"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Events;
