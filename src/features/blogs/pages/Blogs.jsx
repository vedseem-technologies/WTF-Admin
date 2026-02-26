import { useState, useEffect } from "react";
import { Pencil, Trash2, FileText } from "lucide-react";
import { useData } from "../../../context/DataContext";
import Modal from "../../../components/ui/Modal";
import ImageUpload from "../../../components/ui/ImageUpload";
import { getThumbnail } from "../../../utils/imageOptimizer";
import useCursorPagination from "../../../hooks/useCursorPagination";
import { useDialog } from "../../../context/DialogContext";

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
  const { confirm } = useDialog();

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
    refresh: refreshBlogs,
    setData,
  } = useCursorPagination("/api/blogs/getblogs", {
    limit: 12,
    filters: {
      search: debouncedSearchTerm || undefined,
      blogType: blogTypeFilter !== "all" ? blogTypeFilter : undefined,
    },
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
    handleCloseModal(); // 1. Close modal immediately

    if (editingBlog) {
      // Optimistic Update for Edit
      const originalItems = [...blogs];
      const updatedItem = { ...editingBlog, ...formData };
      setData((prev) =>
        prev.map((item) => (item._id === editingBlog._id ? updatedItem : item)),
      );

      try {
        await updateBlog(editingBlog._id, formData);
        refreshBlogs();
      } catch (e) {
        setData(originalItems); // Rollback
        handleError(e);
      }
    } else {
      // Optimistic Update for Add
      const tempId = `temp-${Date.now()}`;
      const optimisticItem = { ...formData, _id: tempId };

      // Prepend to list immediately
      setData((prev) => [optimisticItem, ...prev]);

      try {
        const serverItem = await addBlog(formData);
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
      title: "Delete Blog?",
      variant: "danger",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    try {
      await deleteBlog(id);
      refreshBlogs();
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          className="flex-1 min-w-[200px] px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex items-center gap-2 ml-auto">
          <select
            className="px-3 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
            value={blogTypeFilter}
            onChange={(e) => setBlogTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            {BLOG_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-gradient text-white rounded-lg font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm"
            onClick={() => handleOpenModal()}
          >
            + Add New
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-border overflow-hidden">
        {loadingBlogs && blogs.length === 0 ? (
          <div className="flex justify-center py-16 text-gray-400">
            Loading...
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-bg-hover border-b-2 border-border">
                    {["Image", "Title", "Type", "Date", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr
                      key={blog._id}
                      className="border-b border-gray-50 hover:bg-bg-hover transition-colors last:border-0"
                    >
                      <td className="px-5 py-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={getThumbnail(blog.image)}
                            alt={blog.title}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="font-semibold text-sm text-secondary max-w-xs truncate">
                          {blog.title}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">
                          {blog.description?.substring(0, 70)}…
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-info-light text-info rounded-full">
                          {blog.blogType}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(blog.date).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            className="px-3 py-1.5 text-xs border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all"
                            onClick={() => handleOpenModal(blog)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="px-3 py-1.5 text-xs bg-danger text-white rounded-lg font-medium hover:bg-red-700 transition-all"
                            onClick={() => handleDelete(blog._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
              <button
                onClick={handlePrev}
                disabled={!pageInfo.hasPrevPage || loadingBlogs}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                ← Previous
              </button>
              <span className="text-sm text-gray-500">
                {loadingBlogs ? (
                  <span className="animate-pulse">Loading…</span>
                ) : (
                  ""
                )}
              </span>
              <button
                onClick={handleNext}
                disabled={!pageInfo.hasNextPage || loadingBlogs}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                Next →
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FileText size={48} className="mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-1">No blogs found</h3>
            <p className="text-sm">Start by adding your first blog post</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBlog ? "Edit Blog" : "Add New Blog"}
      >
        <form onSubmit={handleSubmit}>
          <ImageUpload
            value={formData.image}
            onChange={(value) => setFormData({ ...formData, image: value })}
            label="Blog Image *"
          />
          <div className="mb-4">
            <label className="block mb-1.5 text-sm font-medium text-secondary">
              Title *
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
              placeholder="Enter blog title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1.5 text-sm font-medium text-secondary">
              Description *
            </label>
            <textarea
              className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all resize-none"
              placeholder="Enter blog description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows="5"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-secondary">
                Date *
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-secondary">
                Blog Type *
              </label>
              <select
                className="w-full px-4 py-2.5 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all"
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
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-5 py-2.5 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary-gradient text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              {editingBlog ? "Update Blog" : "Add Blog"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Blogs;
