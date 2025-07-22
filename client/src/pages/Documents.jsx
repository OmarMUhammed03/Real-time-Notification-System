/**
 * ========================================
 * COMPONENT: App (Main Application)
 * ========================================
 * Main application component that manages the overall layout and state
 * Handles navigation, document management, and modal interactions
 */

import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DocumentCard } from '../../Real-time-Notification-System/client/src/components/documents/DocumentCard';
import { UploadArea } from '../../Real-time-Notification-System/client/src/components/documents/UploadArea';
import { SearchFilters } from '../../Real-time-Notification-System/client/src/components/documents/SearchFilters';
import { ShareModal } from '../../Real-time-Notification-System/client/src/components/sharing/ShareModal';
import { useDocuments } from '../../Real-time-Notification-System/client/src/components/hooks/useDocuments';

function Documents() {
  // ========================================
  // STATE MANAGEMENT
  // ========================================

  // Navigation state - tracks which tab is currently active
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modal and selection states - manages document sharing modal
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // Search and filter states - controls document filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // ========================================
  // API INTEGRATION HOOK
  // ========================================

  // Custom hook for document management with API integration
  // TODO: Replace with your actual API endpoints
  const {
    documents,
    loading: documentsLoading,
    error: documentsError,
    uploadDocument,
    downloadDocument,
    deleteDocument,
    uploadLoading,
    uploadError
  } = useDocuments({
    search: searchTerm,
    category,
    dateRange,
    sortBy
  });

  // Show user-friendly message when API is not available
  const isApiUnavailable = documentsError && documentsError.includes('Network error');

  // ========================================
  // EVENT HANDLERS
  // ========================================

  /**
   * Handle document sharing - opens share modal with selected document
   * @param {Object} document - Document object to share
   */
  const handleShare = (document) => {
    setSelectedDocument(document);
    setShowShareModal(true);
  };

  /**
   * Handle document download with error handling
   * @param {Object} document - Document object to download
   */
  const handleDownload = async (document) => {
    try {
      await downloadDocument(document.id, document.name);
    } catch (error) {
      console.error('Download failed:', error);
      // TODO: Add user-friendly error notification
    }
  };

  /**
   * Handle file upload with metadata
   * @param {FileList} files - Files to upload
   * @param {Object} metadata - Additional metadata for files
   */
  const handleUpload = async (files, metadata) => {
    try {
      // Upload each file individually with provided metadata
      for (const file of files) {
        await uploadDocument(file, metadata);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      // TODO: Add user-friendly error notification
      throw error;
    }
  };

  /**
   * Handle document deletion with error handling
   * @param {Object} document - Document object to delete
   */
  const handleDelete = async (document) => {
    try {
      // TODO: Add confirmation dialog before deletion
      await deleteDocument(document.id);
    } catch (error) {
      console.error('Delete failed:', error);
      // TODO: Add user-friendly error notification
    }
  };

  // ========================================
  // RENDER CONTENT BASED ON ACTIVE TAB
  // ========================================

  /**
   * Render content based on active tab selection
   * @returns {JSX.Element} Content for the active tab
   */
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Dashboard header with document statistics */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Documents</h2>
                <p className="text-gray-600 mt-1">
                  {documents.length} documents • {documents.filter(d => d.shared).length} shared
                </p>
              </div>
            </div>

            {/* Search and filter controls */}
            <SearchFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              category={category}
              onCategoryChange={setCategory}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Error display for document loading issues */}
            {documentsError && !isApiUnavailable && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">Error loading documents: {documentsError}</p>
              </div>
            )}

            {/* API Unavailable Notice */}
            {isApiUnavailable && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      API Server Not Available
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        The backend API is not running. Showing sample data for demonstration.
                        To connect to your API, please:
                      </p>
                      <ul className="mt-2 list-disc list-inside">
                        <li>Start your backend server</li>
                        <li>Set VITE_API_BASE_URL in your .env file</li>
                        <li>Ensure CORS is configured on your backend</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading state or document grid display */}
            {documentsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* Document grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documents.map((document) => (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      onShare={handleShare}
                      onDownload={handleDownload}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>

                {/* Empty state when no documents match criteria */}
                {documents.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No documents found matching your criteria.</p>
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 'upload':
        return (
          <div className="max-w-4xl">
            {/* Upload page header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upload Documents</h2>
              <p className="text-gray-600 mt-1">Securely upload and organize your documents</p>
            </div>

            {/* Upload area component with loading and error states */}
            <UploadArea
              onUpload={handleUpload}
              loading={uploadLoading}
              error={uploadError}
            />
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            {/* Settings page header */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              <p className="text-gray-600 mt-1">Configure your document preferences</p>
            </div>

            {/* Document settings panel */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Settings</h3>
              <div className="space-y-4">
                {/* Auto-encrypt setting toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Auto-encrypt uploaded documents</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>

                {/* File preview setting toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Show file previews</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>

                {/* Notifications setting toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Enable notifications</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ========================================
  // MAIN COMPONENT RENDER
  // ========================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main application header */}
      <Header />

      {/* Main layout with sidebar and content area */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Navigation sidebar */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main content area with scrolling */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* Share modal - conditionally rendered when document is selected */}
      {showShareModal && selectedDocument && (
        <ShareModal
          document={selectedDocument}
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            setSelectedDocument(null);
          }}
        />
      )}
    </div>
  );
}

export default Documents;