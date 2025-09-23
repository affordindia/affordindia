import React, { useState } from "react";
import { FaTimes, FaUpload, FaImage } from "react-icons/fa";

const ImageUpload = ({ 
    images = [], 
    onImagesChange, 
    maxImages = 5, 
    className = "",
    disabled = false 
}) => {
    const [dragActive, setDragActive] = useState(false);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        handleFiles(files);
    };

    const handleFiles = (files) => {
        if (disabled) return;
        
        const validFiles = files.filter(file => 
            file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
        );
        
        const remainingSlots = maxImages - images.length;
        const filesToAdd = validFiles.slice(0, remainingSlots);
        
        if (filesToAdd.length > 0) {
            onImagesChange([...images, ...filesToAdd]);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const files = Array.from(e.dataTransfer.files || []);
        handleFiles(files);
    };

    const removeImage = (index) => {
        if (disabled) return;
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    };

    const getImagePreview = (image) => {
        if (typeof image === 'string') {
            return image; // URL string
        }
        return URL.createObjectURL(image); // File object
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Upload Area */}
            {images.length < maxImages && (
                <div
                    className={`
                        relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
                        ${dragActive 
                            ? 'border-[#B76E79] bg-pink-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => !disabled && document.getElementById('file-input').click()}
                >
                    <input
                        id="file-input"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={disabled}
                    />
                    
                    <FaUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                    <p className="text-gray-600 mb-1">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                        PNG, JPG, JPEG up to 5MB ({images.length}/{maxImages} images)
                    </p>
                </div>
            )}

            {/* Image Previews */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border bg-gray-100">
                                <img
                                    src={getImagePreview(image)}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {!disabled && (
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {images.length >= maxImages && (
                <p className="text-sm text-gray-500 text-center">
                    Maximum {maxImages} images allowed
                </p>
            )}
        </div>
    );
};

export default ImageUpload;
