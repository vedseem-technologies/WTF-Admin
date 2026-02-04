import { useState } from "react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";
import ImageUpload from "../../../components/ui/ImageUpload";
import { getThumbnail } from "../../../utils/imageOptimizer";
import "./Blogs.css";

const BLOG_TYPES = [
  "Recipe",
  "Restaurant Review",
  "Cooking Tips",
  "Food Culture",
  "Ingredient Guide",
  "Chef Interview",
];

const Blogs = () => {
  const { blogs, loadingBlogs, addBlog, updateBlog, deleteBlog } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    blogType: BLOG_TYPES[0],
  });
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        image: blog.image,
        description: blog.description,
        date: blog.date,
        blogType: blog.blogType,
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: "",
        image: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        blogType: BLOG_TYPES[0],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBlog) {
      updateBlog(editingBlog._id, formData);
    } else {
      addBlog(formData);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      deleteBlog(id);
    }
  };

  const filteredBlogs = blogs
    .filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      const dateDiff = new Date(b.date) - new Date(a.date);
      if (dateDiff !== 0) return dateDiff;
      return b._id.localeCompare(a._id);
    });

  return (
    <div className="page-container">
      <div className="page-filters">
        <input
          type="text"
          className="form-control search-input"
          placeholder="🔍 Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-buttons" style={{ marginLeft: "auto" }}>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Add New Blog
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table blogs-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Blog Type</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.map((blog) => (
              <tr key={blog._id}>
                <td>
                  <div className="blog-image-cell">
                    <img
                      src={getThumbnail(blog.image)}
                      alt={blog.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                    />
                  </div>
                </td>
                <td>
                  <div className="blog-title-cell">
                    <h4>{blog.title}</h4>
                    <p>{blog.description.substring(0, 80)}...</p>
                  </div>
                </td>
                <td>
                  <span className="blog-type-badge">{blog.blogType}</span>
                </td>
                <td>{new Date(blog.date).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleOpenModal(blog)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(blog._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loadingBlogs && filteredBlogs.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">📝</span>
            <h3>No blogs found</h3>
            <p>Start by adding your first blog post</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBlog ? "Edit Blog" : "Add New Blog"}
      >
        <form onSubmit={handleSubmit} className="blog-form">
          <ImageUpload
            value={formData.image}
            onChange={(value) => setFormData({ ...formData, image: value })}
            label="Blog Image *"
          />

          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter blog title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-control"
              placeholder="Enter blog description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows="5"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                className="form-control"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Blog Type *</label>
              <select
                className="form-select"
                value={formData.blogType}
                onChange={(e) =>
                  setFormData({ ...formData, blogType: e.target.value })
                }
                required
              >
                {BLOG_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
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
              {editingBlog ? "Update Blog" : "Add Blog"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Blogs;
