/**
 * ========================================
 * TYPES: Data Models and Factory Functions
 * ========================================
 * Factory functions for creating data objects with consistent structure
 * Used throughout the application for type safety and data consistency
 */

// ========================================
// USER DATA MODEL
// ========================================

/**
 * Create a user object with consistent structure
 * @param {string} id - Unique user identifier
 * @param {string} email - User email address
 * @param {string} name - User display name
 * @param {string} role - User role ('admin' | 'user')
 * @param {string} createdAt - ISO date string of account creation
 * @param {string} lastLogin - ISO date string of last login
 * @returns {Object} User object
 */
export const createUser = (id, email, name, role, createdAt, lastLogin) => ({
  id,
  email,
  name,
  role, // 'admin' | 'user'
  createdAt,
  lastLogin
});

// ========================================
// DOCUMENT DATA MODEL
// ========================================

/**
 * Create a document object with consistent structure
 * @param {string} id - Unique document identifier
 * @param {string} name - Document filename
 * @param {number} size - File size in bytes
 * @param {string} type - File MIME type or extension
 * @param {string} uploadedAt - ISO date string of upload
 * @param {string} uploadedBy - ID of user who uploaded
 * @param {string} description - Document description
 * @param {string} category - Document category
 * @param {boolean} encrypted - Whether document is encrypted
 * @param {boolean} shared - Whether document is shared
 * @param {number} accessCount - Number of times accessed
 * @param {string} lastAccessed - ISO date string of last access
 * @returns {Object} Document object
 */
export const createDocument = (
  id, 
  name, 
  size, 
  type, 
  uploadedAt, 
  uploadedBy, 
  description, 
  category, 
  encrypted, 
  shared, 
  accessCount, 
  lastAccessed
) => ({
  id,
  name,
  size,
  type,
  uploadedAt,
  uploadedBy,
  description,
  category,
  encrypted,
  shared,
  accessCount,
  lastAccessed
});

// ========================================
// SHARE LINK DATA MODEL
// ========================================

/**
 * Create a share link object with consistent structure
 * @param {string} id - Unique share link identifier
 * @param {string} documentId - ID of shared document
 * @param {string} token - Unique share token
 * @param {string} expiryDate - ISO date string of expiry (null if never expires)
 * @param {number} maxUses - Maximum number of uses (null if unlimited)
 * @param {number} usedCount - Current number of uses
 * @param {string} createdAt - ISO date string of creation
 * @param {boolean} isOneTime - Whether link is one-time use only
 * @returns {Object} Share link object
 */
export const createShareLink = (
  id, 
  documentId, 
  token, 
  expiryDate, 
  maxUses, 
  usedCount, 
  createdAt, 
  isOneTime
) => ({
  id,
  documentId,
  token,
  expiryDate,
  maxUses,
  usedCount,
  createdAt,
  isOneTime
});

// ========================================
// ACCESS LOG DATA MODEL
// ========================================

/**
 * Create an access log entry with consistent structure
 * @param {string} id - Unique log entry identifier
 * @param {string} documentId - ID of accessed document
 * @param {string} userId - ID of user who accessed (null for anonymous)
 * @param {string} action - Type of action ('view' | 'download' | 'share')
 * @param {string} timestamp - ISO date string of access
 * @param {string} ipAddress - IP address of accessor
 * @returns {Object} Access log object
 */
export const createAccessLog = (id, documentId, userId, action, timestamp, ipAddress) => ({
  id,
  documentId,
  userId,
  action, // 'view' | 'download' | 'share'
  timestamp,
  ipAddress
});

// ========================================
// ANALYTICS DATA MODEL
// ========================================

/**
 * Create an analytics object with consistent structure
 * @param {number} totalDocuments - Total number of documents
 * @param {number} totalUsers - Total number of users
 * @param {number} totalShares - Total number of shares
 * @param {number} storageUsed - Storage used in bytes
 * @param {Array} popularTags - Array of popular tags with counts
 * @param {Array} recentActivity - Array of recent access logs
 * @returns {Object} Analytics object
 */
export const createAnalytics = (
  totalDocuments, 
  totalUsers, 
  totalShares, 
  storageUsed, 
  popularTags, 
  recentActivity
) => ({
  totalDocuments,
  totalUsers,
  totalShares,
  storageUsed,
  popularTags, // Array<{ tag: string; count: number }>
  recentActivity // AccessLog[]
});

// ========================================
// API RESPONSE MODELS
// ========================================

/**
 * Create a standardized API response object
 * @param {boolean} success - Whether the operation was successful
 * @param {*} data - Response data
 * @param {string} message - Response message
 * @param {Array} errors - Array of error messages
 * @returns {Object} API response object
 */
export const createApiResponse = (success, data, message, errors = []) => ({
  success,
  data,
  message,
  errors
});

/**
 * Create a paginated response object
 * @param {Array} items - Array of items
 * @param {number} totalCount - Total number of items
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {number} limit - Items per page
 * @returns {Object} Paginated response object
 */
export const createPaginatedResponse = (items, totalCount, currentPage, totalPages, limit) => ({
  items,
  totalCount,
  currentPage,
  totalPages,
  limit,
  hasNextPage: currentPage < totalPages,
  hasPreviousPage: currentPage > 1
});

// ========================================
// FORM DATA MODELS
// ========================================

/**
 * Create upload metadata object
 * @param {string} description - Document description
 * @param {string} category - Document category
 * @param {Array} tags - Array of tags
 * @param {boolean} encrypted - Whether to encrypt the document
 * @returns {Object} Upload metadata object
 */
export const createUploadMetadata = (description, category, tags = [], encrypted = false) => ({
  description,
  category,
  tags,
  encrypted,
  uploadedAt: new Date().toISOString()
});

/**
 * Create share options object
 * @param {string} expiryType - Type of expiry ('never' | 'hours' | 'days' | 'date')
 * @param {string} expiryValue - Expiry value
 * @param {number} maxUses - Maximum number of uses
 * @param {boolean} isOneTime - Whether link is one-time use
 * @param {boolean} requirePassword - Whether link requires password
 * @param {string} password - Password for protected links
 * @returns {Object} Share options object
 */
export const createShareOptions = (
  expiryType, 
  expiryValue, 
  maxUses, 
  isOneTime, 
  requirePassword = false, 
  password = null
) => ({
  expiryType,
  expiryValue,
  maxUses: isOneTime ? 1 : maxUses,
  isOneTime,
  requirePassword,
  password,
  createdAt: new Date().toISOString()
});