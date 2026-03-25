/**
 * Format currency to Indian Rupees
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type (short, long, full)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
    if (!date) return 'N/A';
    const d = new Date(date);

    switch (format) {
        case 'long':
            return d.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        case 'full':
            return d.toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        case 'time':
            return d.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
            });
        case 'datetime':
            return d.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        default:
            return d.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
    }
};

/**
 * Format time ago
 * @param {string|Date} date - Date to format
 * @returns {string} Time ago string
 */
export const timeAgo = (date) => {
    if (!date) return 'N/A';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';

    return Math.floor(seconds) + ' seconds ago';
};

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number (10 digits)
 * @param {string} phone - Phone to validate
 * @returns {boolean} Is valid phone
 */
export const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
};

/**
 * Validate pincode (6 digits)
 * @param {string} pincode - Pincode to validate
 * @returns {boolean} Is valid pincode
 */
export const isValidPincode = (pincode) => {
    const pincodeRegex = /^[0-9]{6}$/;
    return pincodeRegex.test(pincode);
};

/**
 * Generate random OTP
 * @param {number} length - OTP length
 * @returns {string} Generated OTP
 */
export const generateOTP = (length = 6) => {
    return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 500) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 500) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
    if (!name) return '';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

/**
 * Generate random color from string
 * @param {string} str - Input string
 * @returns {string} HSL color
 */
export const stringToColor = (str) => {
    if (!str) return '#000000';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
};

/**
 * Download file from URL
 * @param {string} url - File URL
 * @param {string} filename - File name
 */
export const downloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy:', error);
        return false;
    }
};

/**
 * Get query params from URL
 * @returns {Object} Query params object
 */
export const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
        result[key] = value;
    }
    return result;
};

/**
 * Build query string from object
 * @param {Object} params - Query params object
 * @returns {string} Query string
 */
export const buildQueryString = (params) => {
    const filtered = Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '');
    return filtered.length ? '?' + new URLSearchParams(Object.fromEntries(filtered)).toString() : '';
};

/**
 * Calculate discount
 * @param {number} original - Original price
 * @param {number} discounted - Discounted price
 * @returns {number} Discount percentage
 */
export const calculateDiscountPercent = (original, discounted) => {
    if (!original || !discounted || original <= discounted) return 0;
    return Math.round(((original - discounted) / original) * 100);
};

/**
 * Calculate GST
 * @param {number} amount - Amount
 * @param {number} rate - GST rate (default 18%)
 * @returns {number} GST amount
 */
export const calculateGST = (amount, rate = 18) => {
    return (amount * rate) / 100;
};

/**
 * Calculate total with GST and delivery
 * @param {number} subtotal - Subtotal amount
 * @param {number} deliveryCharge - Delivery charge
 * @param {number} discount - Discount amount
 * @returns {Object} Total breakdown
 */
export const calculateTotal = (subtotal, deliveryCharge = 0, discount = 0) => {
    const gst = calculateGST(subtotal);
    const total = subtotal + gst + deliveryCharge - discount;
    return {
        subtotal,
        gst,
        deliveryCharge,
        discount,
        total: Math.max(0, total)
    };
};

/**
 * Get order status step index
 * @param {string} status - Order status
 * @returns {number} Step index
 */
export const getOrderStepIndex = (status) => {
    const steps = [
        'pending', 'confirmed', 'pickup_assigned', 'collected',
        'processing', 'quality_check', 'out_for_delivery', 'delivered'
    ];
    return steps.indexOf(status);
};

/**
 * Check if order is active (not delivered/cancelled)
 * @param {string} status - Order status
 * @returns {boolean} Is active order
 */
export const isOrderActive = (status) => {
    return !['delivered', 'cancelled'].includes(status);
};

/**
 * Get delivery estimate
 * @param {string} processingTime - Processing time
 * @param {Date} pickupDate - Pickup date
 * @returns {string} Estimated delivery date
 */
export const getDeliveryEstimate = (processingTime, pickupDate) => {
    if (!pickupDate) return 'N/A';
    const date = new Date(pickupDate);
    const hours = parseInt(processingTime) || 24;
    date.setHours(date.getHours() + hours);
    return formatDate(date, 'long');
};

/**
 * Scroll to top of page
 */
export const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

/**
 * Check if device is mobile
 * @returns {boolean} Is mobile device
 */
export const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Get device type
 * @returns {string} Device type
 */
export const getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'mobile';
    return 'desktop';
};

/**
 * Get window dimensions
 * @returns {Object} Window dimensions
 */
export const getWindowDimensions = () => {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
};