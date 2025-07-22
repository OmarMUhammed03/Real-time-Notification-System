/**
 * ========================================
 * COMPONENT: ShareModal
 * ========================================
 * Modal component for sharing documents
 * Handles share link generation and configuration
 */

import React, { useState } from 'react';
import { X, Share2, Clock, Users, Copy, Check } from 'lucide-react';

export const ShareModal = ({ document, isOpen, onClose }) => {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // Share configuration state
  const [expiryType, setExpiryType] = useState('never');
  const [expiryValue, setExpiryValue] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [isOneTime, setIsOneTime] = useState(false);
  
  // Generated share link state
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  // ========================================
  // SHARE LINK GENERATION
  // ========================================

  /**
   * Generate a shareable link for the document
   * TODO: Replace with actual API call to create share link
   */
  const generateShareLink = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await apiService.createShareLink(document.id, {
      //   expiryType,
      //   expiryValue,
      //   maxUses: isOneTime ? 1 : maxUses,
      //   isOneTime
      // });
      
      // Mock implementation - replace with actual API response
      const token = Math.random().toString(36).substr(2, 9);
      const link = `${window.location.origin}/shared/${token}`;
      setShareLink(link);
      
      // TODO: Store share link configuration in backend
      console.log('Share configuration:', {
        documentId: document.id,
        expiryType,
        expiryValue,
        maxUses: isOneTime ? 1 : maxUses,
        isOneTime
      });
    } catch (error) {
      console.error('Failed to generate share link:', error);
      // TODO: Show error message to user
    }
  };

  // ========================================
  // CLIPBOARD FUNCTIONALITY
  // ========================================

  /**
   * Copy share link to clipboard
   */
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // TODO: Fallback copy method for older browsers
    }
  };

  // ========================================
  // COMPONENT RENDER
  // ========================================

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Share2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Share Document</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Document Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-1">{document.name}</h3>
            <p className="text-sm text-gray-600">{document.type.toUpperCase()}</p>
            {document.description && (
              <p className="text-sm text-gray-500 mt-1">{document.description}</p>
            )}
          </div>

          {/* Share Configuration Options */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Share Settings</h4>
            
            {/* Expiry Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Link Expiry
              </label>
              <div className="space-y-2">
                {/* Never expires option */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="never"
                    checked={expiryType === 'never'}
                    onChange={(e) => setExpiryType(e.target.value)}
                    className="mr-2"
                  />
                  Never expires
                </label>
                
                {/* Expires in hours option */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="hours"
                    checked={expiryType === 'hours'}
                    onChange={(e) => setExpiryType(e.target.value)}
                    className="mr-2"
                  />
                  Expires in hours
                </label>
                {expiryType === 'hours' && (
                  <input
                    type="number"
                    value={expiryValue}
                    onChange={(e) => setExpiryValue(e.target.value)}
                    placeholder="Hours"
                    min="1"
                    max="168"
                    className="ml-6 px-3 py-1 border border-gray-300 rounded w-24"
                  />
                )}
                
                {/* Expires in days option */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="days"
                    checked={expiryType === 'days'}
                    onChange={(e) => setExpiryType(e.target.value)}
                    className="mr-2"
                  />
                  Expires in days
                </label>
                {expiryType === 'days' && (
                  <input
                    type="number"
                    value={expiryValue}
                    onChange={(e) => setExpiryValue(e.target.value)}
                    placeholder="Days"
                    min="1"
                    max="365"
                    className="ml-6 px-3 py-1 border border-gray-300 rounded w-24"
                  />
                )}
                
                {/* Expires on specific date option */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="date"
                    checked={expiryType === 'date'}
                    onChange={(e) => setExpiryType(e.target.value)}
                    className="mr-2"
                  />
                  Expires on date
                </label>
                {expiryType === 'date' && (
                  <input
                    type="date"
                    value={expiryValue}
                    onChange={(e) => setExpiryValue(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="ml-6 px-3 py-1 border border-gray-300 rounded"
                  />
                )}
              </div>
            </div>

            {/* Usage Limits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Usage Limits
              </label>
              <div className="space-y-2">
                {/* One-time use option */}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isOneTime}
                    onChange={(e) => setIsOneTime(e.target.checked)}
                    className="mr-2"
                  />
                  One-time use only
                </label>
                
                {/* Maximum uses option */}
                {!isOneTime && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Max uses:</span>
                    <input
                      type="number"
                      value={maxUses}
                      onChange={(e) => setMaxUses(e.target.value)}
                      placeholder="Unlimited"
                      min="1"
                      max="1000"
                      className="px-3 py-1 border border-gray-300 rounded w-24"
                    />
                    <span className="text-xs text-gray-500">(leave empty for unlimited)</span>
                  </div>
                )}
              </div>
            </div>

            {/* TODO: Add more sharing options */}
            {/* 
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Permissions
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Allow download
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Require password
                </label>
              </div>
            </div>
            */}
          </div>

          {/* Generate/Display Share Link */}
          {!shareLink ? (
            <button
              onClick={generateShareLink}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Generate Share Link
            </button>
          ) : (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Share Link
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-600">Link copied to clipboard!</p>
              )}
              
              {/* Share link information */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Link will {expiryType === 'never' ? 'never expire' : `expire ${expiryType === 'date' ? 'on' : 'in'} ${expiryValue} ${expiryType !== 'date' ? expiryType : ''}`}</p>
                <p>• {isOneTime ? 'One-time use only' : maxUses ? `Maximum ${maxUses} uses` : 'Unlimited uses'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};