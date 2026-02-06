import { useState, useEffect } from "react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";
import ImageUpload from "../../../components/ui/ImageUpload";
import { getThumbnail } from "../../../utils/imageOptimizer";
import "./Blogs.css";
import useCursorPagination from "../../../hooks/useCursorPagination";

const BLOG_TYPES = [
  "Recipe",
  "Restaurant Review",
  "Cooking Tips",
  "Food Culture",
  "Ingredient Guide",
  "Chef Interview",
];

const Blogs = () => {
  const { addBlog, updateBlog, deleteBlog } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [blogTypeFilter, setBlogTypeFilter] = useState("all");

  const {
    data: blogs,
    loading: loadingBlogs,
    pageInfo,
    handleNext,
    handlePrev,
    refresh: refreshBlogs
  } = useCursorPagination('/api/blogs/getblogs', {
    limit: 12,
    filters: {
      search: debouncedSearchTerm || undefined,
      blogType: blogTypeFilter !== 'all' ? blogTypeFilter : undefined
    }
  });


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    blogType: BLOG_TYPES[0],
  });

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

  const handleError = (error) => {
    console.error("Action error:", error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        await updateBlog(editingBlog._id, formData);
      } else {
        await addBlog(formData);
      }
      refreshBlogs();
      handleCloseModal();
    } catch (e) { handleError(e); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id);
        refreshBlogs();
      } catch (e) { handleError(e); }
    }
  };

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
          <select
            className="form-select"
            style={{ width: 'auto', marginRight: '10px' }}
            value={blogTypeFilter}
            onChange={(e) => setBlogTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            {BLOG_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            + Add New
          </button>
        </div>
      </div>

      <div className="table-container">
        {loadingBlogs && blogs.length === 0 ? (
          <div className="loading-state">
            <h3>...loading</h3>
          </div>
        ) : blogs.length > 0 ? (
          <>
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
                {blogs.map((blog) => (
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
                          className="btn btn-sm btn-outline"
                          onClick={() => handleOpenModal(blog)}
                          style={{ marginRight: "8px" }}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(blog._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="pagination-controls flex justify-between items-center mt-8 mb-8">
              <button
                onClick={handlePrev}
                disabled={!pageInfo.hasPrevPage || loadingBlogs}
                className="btn btn-outline"
              >
                ⬅️ Previous
              </button>
              <span className="text-gray-500">
                {loadingBlogs ? 'Loading...' : ''}
              </span>
              <button
                onClick={handleNext}
                disabled={!pageInfo.hasNextPage || loadingBlogs}
                className="btn btn-outline"
              >
                Next ➡️
              </button>
            </div>
          </>
        ) : (
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
