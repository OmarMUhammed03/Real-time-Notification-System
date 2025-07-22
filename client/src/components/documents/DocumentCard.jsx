/**
 * ========================================
 * COMPONENT: DocumentCard
 * ========================================
 * Individual document card component
 * Displays document information and action buttons
 */

import React from 'react';
import { FileText, Download, Share2, Lock, Calendar, FileText as DescriptionIcon, Eye } from 'lucide-react';

export const DocumentCard = ({ 
  document, 
  onShare, 
  onDownload, 
  onDelete,
  loading = false 
}) => {
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

  /**
   * Format date string to readable format
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // ========================================
  // COMPONENT RENDER
  // ========================================

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Document header with icon and basic info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Document type icon */}
          <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          
          {/* Document name and type */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate" title={document.name}>
              {document.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {document.type.toUpperCase()} • {formatFileSize(document.size)}
            </p>
          </div>
        </div>
        
        {/* Document status indicators */}
        <div className="flex items-center space-x-1">
          {/* Encryption indicator */}
          {document.encrypted && (
            <div className="flex items-center justify-center w-6 h-6 bg-green-50 rounded" title="Encrypted">
              <Lock className="w-3 h-3 text-green-600" />
            </div>
          )}
          
          {/* Shared indicator */}
          {document.shared && (
            <div className="flex items-center justify-center w-6 h-6 bg-blue-50 rounded" title="Shared">
              <Share2 className="w-3 h-3 text-blue-600" />
            </div>
          )}
        </div>
      </div>

      {/* Document metadata */}
      <div className="space-y-2 mb-4">
        {/* Upload date */}
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          Uploaded {formatDate(document.uploadedAt)}
        </div>

        {/* Access count */}
        <div className="flex items-center text-xs text-gray-500">
          <Eye className="w-3 h-3 mr-1" />
          {document.accessCount} views
        </div>

        {/* Document description */}
        {document.description && (
          <div className="flex items-center space-x-1">
            <DescriptionIcon className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500 truncate" title={document.description}>
              {document.description}
            </span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex space-x-2">
        {/* Download button */}
        <button
          onClick={() => onDownload(document)}
          disabled={loading}
          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Download document"
        >
          <Download className="w-4 h-4" />
          <span>{loading ? 'Loading...' : 'Download'}</span>
        </button>
        
        {/* Share button */}
        <button
          onClick={() => onShare(document)}
          disabled={loading}
          className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Share document"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
        
        {/* Delete button (optional) */}
        {onDelete && (
          <button
            onClick={() => onDelete(document)}
            disabled={loading}
            className="px-3 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete document"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};