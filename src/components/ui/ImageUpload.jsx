import { useState } from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";

const ImageUpload = ({ value, onChange, label = "Upload Image" }) => {
  const [preview, setPreview] = useState(value || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setPreview(url);
    onChange(url);
  };

  const clearImage = () => {
    setPreview("");
    onChange("");
  };

  return (
    <div className="mb-4">
      <label className="block mb-1.5 text-sm font-medium text-secondary">
        {label}
      </label>

      <div className="mb-3 rounded-xl border-2 border-dashed border-border overflow-hidden bg-bg-hover">
        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-700 transition-all opacity-0 group-hover:opacity-100"
              title="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <ImageIcon size={32} className="mb-2" />
            <span className="text-sm">No image selected</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <span className="inline-flex items-center gap-2 w-full justify-center px-4 py-2 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all">
            <Upload size={16} /> Choose File
          </span>
        </label>
        <input
          type="url"
          placeholder="Or paste image URL..."
          value={preview.startsWith("data:") ? "" : preview}
          onChange={handleUrlChange}
          className="w-full px-3 py-2 text-sm border-2 border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all"
        />
      </div>
    </div>
  );
};

export default ImageUpload;
