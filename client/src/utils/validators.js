/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number (10 digits Indian format)
 * @param {string} phone - Phone to validate
 * @returns {boolean} Is valid phone
 */
export const isValidPhone = (phone) => {
    if (!phone) return false;
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
};

/**
 * Validate pincode (6 digits)
 * @param {string} pincode - Pincode to validate
 * @returns {boolean} Is valid pincode
 */
export const isValidPincode = (pincode) => {
    if (!pincode) return false;
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with details
 */
export const validatePassword = (password) => {
    const result = {
        isValid: false,
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
        message: ''
    };

    if (!password) {
        result.message = 'Password is required';
        return result;
    }

    result.minLength = password.length >= 6;
    result.hasUpperCase = /[A-Z]/.test(password);
    result.hasLowerCase = /[a-z]/.test(password);
    result.hasNumber = /[0-9]/.test(password);
    result.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    result.isValid = result.minLength && result.hasUpperCase && result.hasLowerCase && result.hasNumber;

    if (!result.minLength) {
        result.message = 'Password must be at least 6 characters';
    } else if (!result.hasUpperCase) {
        result.message = 'Password must contain at least one uppercase letter';
    } else if (!result.hasLowerCase) {
        result.message = 'Password must contain at least one lowercase letter';
    } else if (!result.hasNumber) {
        result.message = 'Password must contain at least one number';
    } else {
        result.message = 'Password is valid';
    }

    return result;
};

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {Object} Validation result
 */
export const validateName = (name) => {
    if (!name) {
        return { isValid: false, message: 'Name is required' };
    }
    if (name.length < 2) {
        return { isValid: false, message: 'Name must be at least 2 characters' };
    }
    if (name.length > 50) {
        return { isValid: false, message: 'Name cannot exceed 50 characters' };
    }
    return { isValid: true, message: '' };
};

/**
 * Validate address
 * @param {Object} address - Address object to validate
 * @returns {Object} Validation result with errors
 */
export const validateAddress = (address) => {
    const errors = {};

    if (!address.name || address.name.trim() === '') {
        errors.name = 'Recipient name is required';
    }

    if (!address.address || address.address.trim() === '') {
        errors.address = 'Address is required';
    }

    if (!address.city || address.city.trim() === '') {
        errors.city = 'City is required';
    }

    if (!address.state || address.state.trim() === '') {
        errors.state = 'State is required';
    }

    if (!address.pincode) {
        errors.pincode = 'Pincode is required';
    } else if (!isValidPincode(address.pincode)) {
        errors.pincode = 'Please enter a valid 6-digit pincode';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate login form
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {Object} Validation result
 */
export const validateLogin = (email, password) => {
    const errors = {};

    if (!email) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!password) {
        errors.password = 'Password is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate registration form
 * @param {Object} data - Registration data
 * @returns {Object} Validation result
 */
export const validateRegistration = (data) => {
    const errors = {};

    // Name validation
    const nameValidation = validateName(data.name);
    if (!nameValidation.isValid) {
        errors.name = nameValidation.message;
    }

    // Email validation
    if (!data.email) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!data.phone) {
        errors.phone = 'Phone number is required';
    } else if (!isValidPhone(data.phone)) {
        errors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Password validation
    const passwordValidation = validatePassword(data.password);
    if (!data.password) {
        errors.password = 'Password is required';
    } else if (!passwordValidation.isValid) {
        errors.password = passwordValidation.message;
    }

    // Confirm password validation
    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate checkout form
 * @param {Object} data - Checkout data
 * @returns {Object} Validation result
 */
export const validateCheckout = (data) => {
    const errors = {};

    // Address validation
    const addressValidation = validateAddress(data.pickupAddress);
    if (!addressValidation.isValid) {
        errors.pickupAddress = addressValidation.errors;
    }

    // Delivery address validation (if different)
    if (data.useDifferentDeliveryAddress) {
        const deliveryAddressValidation = validateAddress(data.deliveryAddress);
        if (!deliveryAddressValidation.isValid) {
            errors.deliveryAddress = deliveryAddressValidation.errors;
        }
    }

    // Pickup date validation
    if (!data.pickupDate) {
        errors.pickupDate = 'Please select a pickup date';
    } else {
        const selectedDate = new Date(data.pickupDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            errors.pickupDate = 'Pickup date cannot be in the past';
        }
    }

    // Pickup time slot validation
    if (!data.pickupTimeSlot) {
        errors.pickupTimeSlot = 'Please select a pickup time slot';
    }

    // Items validation
    if (!data.items || data.items.length === 0) {
        errors.items = 'Please add items to your cart';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate coupon code
 * @param {string} code - Coupon code
 * @returns {Object} Validation result
 */
export const validateCouponCode = (code) => {
    if (!code) {
        return { isValid: false, message: 'Please enter a coupon code' };
    }
    if (code.length < 3) {
        return { isValid: false, message: 'Invalid coupon code' };
    }
    return { isValid: true, message: '' };
};

/**
 * Validate review form
 * @param {Object} data - Review data
 * @returns {Object} Validation result
 */
export const validateReview = (data) => {
    const errors = {};

    if (!data.rating) {
        errors.rating = 'Please select a rating';
    } else if (data.rating < 1 || data.rating > 5) {
        errors.rating = 'Rating must be between 1 and 5';
    }

    if (!data.comment || data.comment.trim() === '') {
        errors.comment = 'Please write a review';
    } else if (data.comment.length < 10) {
        errors.comment = 'Review must be at least 10 characters';
    } else if (data.comment.length > 500) {
        errors.comment = 'Review cannot exceed 500 characters';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate quantity
 * @param {number} quantity - Quantity to validate
 * @param {number} min - Minimum quantity
 * @param {number} max - Maximum quantity
 * @returns {Object} Validation result
 */
export const validateQuantity = (quantity, min = 1, max = 50) => {
    const num = parseInt(quantity);

    if (isNaN(num)) {
        return { isValid: false, message: 'Invalid quantity' };
    }
    if (num < min) {
        return { isValid: false, message: `Minimum quantity is ${min}` };
    }
    if (num > max) {
        return { isValid: false, message: `Maximum quantity is ${max}` };
    }

    return { isValid: true, message: '' };
};

/**
 * Validate service form (admin)
 * @param {Object} data - Service data
 * @returns {Object} Validation result
 */
export const validateService = (data) => {
    const errors = {};

    if (!data.name || data.name.trim() === '') {
        errors.name = 'Service name is required';
    }

    if (!data.category) {
        errors.category = 'Please select a category';
    }

    if (!data.price || data.price <= 0) {
        errors.price = 'Please enter a valid price';
    }

    if (data.discountedPrice && data.discountedPrice >= data.price) {
        errors.discountedPrice = 'Discounted price must be less than original price';
    }

    if (!data.description || data.description.trim() === '') {
        errors.description = 'Description is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Validate coupon form (admin)
 * @param {Object} data - Coupon data
 * @returns {Object} Validation result
 */
export const validateCoupon = (data) => {
    const errors = {};

    if (!data.code || data.code.trim() === '') {
        errors.code = 'Coupon code is required';
    } else if (data.code.length < 3) {
        errors.code = 'Coupon code must be at least 3 characters';
    }

    if (!data.discountValue || data.discountValue <= 0) {
        errors.discountValue = 'Please enter a valid discount value';
    }

    if (data.discountType === 'percentage' && data.discountValue > 100) {
        errors.discountValue = 'Percentage discount cannot exceed 100%';
    }

    if (!data.validFrom) {
        errors.validFrom = 'Valid from date is required';
    }

    if (!data.validTill) {
        errors.validTill = 'Valid till date is required';
    } else if (data.validFrom && new Date(data.validTill) <= new Date(data.validFrom)) {
        errors.validTill = 'Valid till date must be after valid from date';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export default {
    isValidEmail,
    isValidPhone,
    isValidPincode,
    validatePassword,
    validateName,
    validateAddress,
    validateLogin,
    validateRegistration,
    validateCheckout,
    validateCouponCode,
    validateReview,
    validateQuantity,
    validateService,
    validateCoupon
};