import { useState, useEffect } from "react";
import {
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Images,
} from "lucide-react";
import { useData } from "../../context/DataContext";

import useCursorPagination from "../../hooks/useCursorPagination";
import { useDialog } from "../../context/DialogContext";

const Banner = () => {
  const { addBannerImage, deleteBannerImage } = useData();
  const { confirm } = useDialog();
  const [imageInput, setImageInput] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  // Debounce search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: bannerImages,
    loading: loadingBanner,
    pageInfo,
    handleNext,
    handlePrev,
    refresh: refreshBanner,
  } = useCursorPagination("/api/banner", {
    limit: 12,
    filters: {
      search: debouncedSearchTerm || undefined,
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setImageInput(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleError = (error) => {
    console.error("Action error:", error);
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (imageInput) {
      setIsAdding(true);
      try {
        await addBannerImage(imageInput);
        refreshBanner();
        setImageInput("");
        setPreviewImage("");
        document.getElementById("banner-image-upload").value = "";
      } catch (e) {
        handleError(e);
      } finally {
        setIsAdding(false);
      }
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm("This banner image will be permanently removed.", {
      title: "Delete Banner?",
      variant: "danger",
      confirmLabel: "Delete",
    });
    if (!ok) return;
    try {
      await deleteBannerImage(id);
      refreshBanner();
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-secondary flex items-center gap-2">
            <Images className="text-primary" size={28} />
            Banner Images
          </h2>
          <p className="text-sm text-gray-500 mt-1">Manage app banner images</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Search */}
        <div className="w-full md:w-1/3 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all text-sm"
            placeholder="Search image URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Add Form */}
        <div className="w-full md:w-2/3">
          <form
            onSubmit={handleAddImage}
            className="flex gap-2 w-full items-start"
          >
            <div className="flex-1 flex flex-col gap-2">
              <input
                type="file"
                id="banner-image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-soft file:text-primary hover:file:bg-primary-light"
                required
              />
              {previewImage && (
                <div className="h-20 w-48 rounded-lg overflow-hidden border border-border shadow-sm">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-primary-gradient text-white rounded-lg text-sm font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              disabled={!imageInput || isAdding}
            >
              {isAdding ? "Adding..." : "Add Banner"}
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        {loadingBanner && bannerImages.length === 0 ? (
          <div className="flex justify-center flex-col items-center py-16">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <h3 className="text-gray-500 font-medium mt-4">
              Loading images...
            </h3>
          </div>
        ) : bannerImages.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {bannerImages.map((img) => (
                <div
                  key={img._id}
                  className="relative group rounded-xl overflow-hidden shadow-sm border border-border aspect-[21/9] bg-gray-100"
                >
                  <img
                    src={img.image}
                    alt="Banner Item"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      className="w-10 h-10 bg-white text-danger rounded-full flex items-center justify-center shadow-lg hover:bg-danger hover:text-white transition-all transform hover:scale-110"
                      onClick={() => handleDelete(img._id)}
                      title="Delete image"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={handlePrev}
                disabled={!pageInfo.hasPrevPage || loadingBanner}
                className="px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary"
              >
                <ChevronLeft size={16} className="inline mr-1 -mt-0.5" />{" "}
                Previous
              </button>
              <span className="text-sm font-medium text-gray-500">
                {loadingBanner
                  ? "Loading..."
                  : `Page ${pageInfo.hasPrevPage ? "..." : "1"}`}
              </span>
              <button
                onClick={handleNext}
                disabled={!pageInfo.hasNextPage || loadingBanner}
                className="px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-primary"
              >
                Next <ChevronRight size={16} className="inline ml-1 -mt-0.5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Images size={64} className="mb-4 opacity-50 text-gray-400" />
            <h3 className="text-xl font-bold text-secondary mb-2">
              No Banner images
            </h3>
            <p className="text-sm">
              Start by uploading your first banner above
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;
