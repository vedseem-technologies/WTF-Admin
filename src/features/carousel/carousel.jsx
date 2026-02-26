import { useState, useEffect, useRef } from "react";
import {
  Trash2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import { useData } from "../../context/DataContext";
import useCursorPagination from "../../hooks/useCursorPagination";
import { useDialog } from "../../context/DialogContext";

const Carousel = () => {
  const { addCarouselImage, deleteCarouselImage } = useData();
  const { confirm } = useDialog();
  const fileRef = useRef(null);
  const [imageInput, setImageInput] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [fileName, setFileName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: carouselImages,
    loading: loadingCarousel,
    pageInfo,
    handleNext,
    handlePrev,
    refresh: refreshCarousel,
  } = useCursorPagination("/api/carousel", {
    limit: 12,
    filters: { search: debouncedSearchTerm || undefined },
  });

  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setImageInput(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const clearPreview = () => {
    setImageInput("");
    setPreviewImage("");
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!imageInput) return;
    setIsAdding(true);
    try {
      await addCarouselImage(imageInput);
      refreshCarousel();
      clearPreview();
    } catch (err) {
      console.error("Action error:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm(
      "This carousel image will be permanently removed.",
      { title: "Delete Image?", variant: "danger", confirmLabel: "Delete" },
    );
    if (!ok) return;
    try {
      await deleteCarouselImage(id);
      refreshCarousel();
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Upload Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-border p-6 mb-6">
        <form onSubmit={handleAddImage}>
          {!previewImage ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileRef.current?.click()}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 py-12 flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? "border-primary bg-red-50/60 scale-[1.01]"
                  : "border-gray-200 hover:border-primary/50 hover:bg-gray-50/50"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isDragging ? "bg-primary/10" : "bg-gray-100"}`}
              >
                <Upload
                  size={24}
                  className={isDragging ? "text-primary" : "text-gray-400"}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-secondary">
                  Drop image here or{" "}
                  <span className="text-primary">browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG or WEBP — max 5MB
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => processFile(e.target.files[0])}
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <div className="relative w-40 h-24 rounded-xl overflow-hidden border border-border shadow-sm flex-shrink-0">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={clearPreview}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-secondary truncate">
                  {fileName}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Ready to upload</p>
              </div>
              <button
                type="submit"
                disabled={isAdding}
                className="px-6 py-2.5 bg-primary-gradient text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap inline-flex items-center gap-2"
              >
                {isAdding ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Uploading…
                  </>
                ) : (
                  <>
                    <Upload size={15} /> Upload
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Gallery */}
      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        {loadingCarousel && carouselImages.length === 0 ? (
          <div className="flex justify-center flex-col items-center py-24">
            <Loader2 size={32} className="animate-spin text-primary mb-4" />
            <p className="text-sm text-gray-400 font-medium">Loading images…</p>
          </div>
        ) : carouselImages.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
              {carouselImages.map((img) => (
                <div
                  key={img._id}
                  className="group relative rounded-xl overflow-hidden bg-gray-100 aspect-video border border-border/60"
                >
                  <img
                    src={img.image}
                    alt="Carousel"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between p-3">
                    <span className="text-[10px] font-medium text-white/70 truncate max-w-[60%]">
                      {img._id}
                    </span>
                    <button
                      onClick={() => handleDelete(img._id)}
                      className="w-8 h-8 rounded-lg bg-white/90 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all duration-150 shadow-sm hover:shadow-md hover:scale-105"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center px-5 py-3.5 border-t border-gray-100">
              <button
                onClick={handlePrev}
                disabled={!pageInfo.hasPrevPage || loadingCarousel}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-border text-secondary rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <span className="text-xs font-medium text-gray-400">
                {loadingCarousel ? "Loading…" : ""}
              </span>
              <button
                onClick={handleNext}
                disabled={!pageInfo.hasNextPage || loadingCarousel}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-border text-secondary rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mb-5">
              <ImageIcon size={36} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-secondary mb-1">
              No images yet
            </h3>
            <p className="text-sm text-gray-400 max-w-xs">
              Upload your first image using the drop zone above to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Carousel;
