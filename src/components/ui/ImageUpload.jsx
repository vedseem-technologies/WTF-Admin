import { useState } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ value, onChange, label = 'Upload Image' }) => {
    const [preview, setPreview] = useState(value || '');

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
        setPreview('');
        onChange('');
    };

    return (
        <div className="image-upload">
            <label className="form-label">{label}</label>

            <div className="image-upload-container">
                {preview ? (
                    <div className="image-preview">
                        <img src={preview} alt="Preview" />
                        <button
                            type="button"
                            className="image-remove"
                            onClick={clearImage}
                            title="Remove image"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <div className="image-placeholder">
                        <span className="placeholder-icon">🖼️</span>
                        <span className="placeholder-text">No image selected</span>
                    </div>
                )}
            </div>

            <div className="image-upload-inputs">
                <div className="form-group">
                    <label className="file-upload-btn">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        <span className="btn btn-outline btn-sm w-full">
                            📁 Choose File
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
