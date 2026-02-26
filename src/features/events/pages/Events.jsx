import { useState, useEffect } from "react";
import { Search, Pencil, Trash2, CalendarDays } from "lucide-react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";
import useCursorPagination from "../../../hooks/useCursorPagination";
import { useDialog } from "../../../context/DialogContext";
const Events = () => {
  const { addEvent, updateEvent, deleteEvent } = useData();
  const { confirm, alert } = useDialog();

  const [searchTerm, setSearchTerm] = useState("");
  // Debounce search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const {
    data: events,
    loading: loadingEvents,
    pageInfo,
    handleNext,
    handlePrev,
    refresh: refreshEvents,
  } = useCursorPagination("/api/events", {
    limit: 12,
    filters: {
      search: debouncedSearchTerm || undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      type: typeFilter !== "all" ? typeFilter : undefined,
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    type: "Festival",
    status: "Upcoming",
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
    });
    setIsSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingEvent) {
        await updateEvent(editingEvent._id, formData);
      } else {
        await addEvent(formData);
      }
      refreshEvents();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving event:", error);
      await alert("Failed to save event. Please try again.", {
        title: "Error",
        variant: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm("This action cannot be undone.", {
      title: "Delete Event?",
      variant: "danger",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    try {
      await deleteEvent(id);
      refreshEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      await alert("Failed to delete event.", {
        title: "Error",
        variant: "danger",
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Upcoming":
        return "bg-green-100 text-green-800";
      case "Limited Seats":
        return "bg-yellow-100 text-yellow-800";
      case "Open for All":
        return "bg-blue-100 text-blue-800";
      case "Past":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
            placeholder="Search events by title or location..."
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
          + Add New Event
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-border overflow-hidden">
        {loadingEvents && events.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-gray-500">Loading events...</div>
          </div>
        ) : events.length > 0 ? (
          <>
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map((event) => (
                  <tr
                    key={event._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {event.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {event.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{event.date}</div>
                      <div className="text-sm text-gray-500">
                        {event.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {event.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          event.status,
                        )}`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                        onClick={() => handleOpenModal(event)}
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 transition-colors"
                        onClick={() => handleDelete(event._id)}
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
                disabled={!pageInfo.hasPrevPage || loadingEvents}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                ← Previous
              </button>
              <span className="text-sm text-gray-500">
                {loadingEvents ? (
                  <span className="animate-pulse">Loading…</span>
                ) : (
                  ""
                )}
              </span>
              <button
                onClick={handleNext}
                disabled={!pageInfo.hasNextPage || loadingEvents}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                Next →
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <CalendarDays size={48} className="mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-1">No events found</h3>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingEvent ? "Edit Event" : "Add New Event"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-sm font-medium text-secondary">
              Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-secondary">
                Date <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                placeholder="e.g. Feb 15-17, 2026"
                required
              />
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-secondary">
                Location
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g. Central Park"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-secondary">
                Type
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                placeholder="e.g. Festival"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-secondary">
                Status
              </label>
              <select
                className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
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
          </div>
          <div>
            <label className="block mb-1.5 text-sm font-medium text-secondary">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="4"
              required
            />
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
                : editingEvent
                  ? "Save Changes"
                  : "Add Event"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Events;
