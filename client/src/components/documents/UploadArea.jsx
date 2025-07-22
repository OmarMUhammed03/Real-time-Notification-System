/**
 * ========================================
 * COMPONENT: UploadArea
 * ========================================
 * File upload component with drag & drop functionality
 * Handles file selection, metadata input, and upload process
 */

import React, { useState, useRef } from 'react';
import { Upload, File, X, FileText } from 'lucide-react';

export const UploadArea = ({ onUpload, loading = false, error }) => {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // UI state for drag and drop
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Selected files and metadata
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // File input reference
  const fileInputRef = useRef(null);

  // ========================================
  // DRAG & DROP HANDLERS
  // ========================================

  /**
   * Handle drag over event
   * @param {DragEvent} e - Drag event
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  /**
   * Handle drag leave event
   * @param {DragEvent} e - Drag event
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  /**
   * Handle file drop event
   * @param {DragEvent} e - Drop event
   */
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  // ========================================
  // FILE SELECTION HANDLERS
  // ========================================

  /**
   * Handle file selection from input
   * @param {Event} e - Input change event
   */
  const handleFileSelect = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  /**
   * Remove file from selection
   * @param {number} index - Index of file to remove
   */
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // ========================================
  // UPLOAD HANDLER
  // ========================================

  /**
   * Handle file upload process
   */
  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      setUploading(true);
      try {
        // TODO: Replace with your actual upload API call
        // Upload files one by one with metadata
        for (const file of selectedFiles) {
          await onUpload([file], {
            description,
            category,
            // TODO: Add additional metadata fields as needed
            // uploadedBy: currentUser.id,
            // tags: selectedTags,
            // permissions: selectedPermissions
          });
        }
        
        // Reset form on successful upload
        setSelectedFiles([]);
        setDescription('');
        setCategory('');
      } catch (error) {
        console.error('Upload failed:', error);
        // TODO: Add user-friendly error notification
      } finally {
        setUploading(false);
      }
    }
  };

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  /**
   * Format file size from bytes to human readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // ========================================
  // COMPONENT RENDER
  // ========================================

  return (
    <div className="space-y-6">
      {/* Drag & Drop Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {/* Upload icon */}
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        
        {/* Upload instructions */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Documents</h3>
        <p className="text-gray-600 mb-4">
          Drag and drop files here, or{' '}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            browse
          </button>
        </p>
        <p className="text-sm text-gray-500">Supports PDF, DOCX, TXT, and more</p>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          // TODO: Add more file types as needed
        />
      </div>

      {/* Selected Files Display */}
      {selectedFiles.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">
            Selected Files ({selectedFiles.length})
          </h4>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                {/* File info */}
                <div className="flex items-center space-x-3">
                  <File className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                {/* Remove file button */}
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata Form */}
      <div className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select category</option>
            <option value="legal">Legal</option>
            <option value="financial">Financial</option>
            <option value="hr">Human Resources</option>
            <option value="technical">Technical</option>
            <option value="marketing">Marketing</option>
            <option value="other">Other</option>
            {/* TODO: Load categories from API */}
          </select>
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description for your document..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {/* TODO: Add more metadata fields */}
        {/* 
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            placeholder="Enter tags separated by commas"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        */}
      </div>

      {/* Upload Button and Error Display */}
      {selectedFiles.length > 0 && (
        <>
          {/* Error message display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={uploading || loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading || loading 
              ? 'Uploading...' 
              : `Upload ${selectedFiles.length} ${selectedFiles.length === 1 ? 'File' : 'Files'}`
            }
          </button>
        </>
      )}
    </div>
  );
};