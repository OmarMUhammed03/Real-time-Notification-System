/**
 * ========================================
 * COMPONENT: SearchFilters
 * ========================================
 * Search and filter component for documents
 * Provides search input and various filter options
 */

import React from 'react';
import { Search, Filter, Calendar, Tag } from 'lucide-react';

export const SearchFilters = ({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  dateRange,
  onDateRangeChange,
  sortBy,
  onSortChange
}) => {
  // ========================================
  // COMPONENT RENDER
  // ========================================

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
      {/* Filter section header */}
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">Search & Filter</h3>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search documents by name, description, or content..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {/* TODO: Add search suggestions dropdown */}
        {/* TODO: Add advanced search options */}
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 inline mr-1" />
            Category
          </label>
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            <option value="legal">Legal</option>
            <option value="financial">Financial</option>
            <option value="hr">Human Resources</option>
            <option value="technical">Technical</option>
            <option value="marketing">Marketing</option>
            <option value="other">Other</option>
            {/* TODO: Load categories dynamically from API */}
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Date Range
          </label>
          <select
            value={dateRange}
            onChange={(e) => onDateRangeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            {/* TODO: Add custom date range picker */}
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="size">Size (Largest)</option>
            <option value="size-desc">Size (Smallest)</option>
            <option value="accessed">Most Accessed</option>
            <option value="modified">Recently Modified</option>
            {/* TODO: Add more sorting options */}
          </select>
        </div>
      </div>

      {/* TODO: Add advanced filters */}
      {/* 
      <div className="pt-4 border-t border-gray-200">
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">
            Advanced Filters
          </summary>
          <div className="mt-4 space-y-4">
            // File type filter
            // File size filter
            // Owner filter
            // Shared status filter
            // Encryption status filter
          </div>
        </details>
      </div>
      */}

      {/* Active Filters Display */}
      {(searchTerm || category || dateRange) && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Active filters:</span>
            {searchTerm && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                Search: "{searchTerm}"
              </span>
            )}
            {category && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                Category: {category}
              </span>
            )}
            {dateRange && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                Date: {dateRange}
              </span>
            )}
            {/* Clear all filters button */}
            <button
              onClick={() => {
                onSearchChange('');
                onCategoryChange('');
                onDateRangeChange('');
              }}
              className="text-red-600 hover:text-red-800 underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};