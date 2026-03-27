// Validate email format
const validateEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
};

// Validate phone number (10 digits)
const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
};

// Validate password strength
const validatePassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValid = password.length >= minLength;

    return {
        isValid,
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
        message: isValid ? 'Password is valid' : 'Password must be at least 6 characters'
    };
};

// Validate pincode (6 digits)
const validatePincode = (pincode) => {
    const pincodeRegex = /^[0-9]{6}$/;
    return pincodeRegex.test(pincode);
};

// Validate GST number
const validateGST = (gstNumber) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gstNumber);
};

// Validate PAN card
const validatePAN = (panNumber) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(panNumber);
};

// Validate Aadhar card
const validateAadhar = (aadharNumber) => {
    const aadharRegex = /^[0-9]{12}$/;
    return aadharRegex.test(aadharNumber);
};

// Validate URL
const validateURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

// Validate date is not in past
const validateFutureDate = (date) => {
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate >= today;
};

// Validate date range
const validateDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
};

// Validate time slot format (HH:MM)
const validateTimeSlot = (timeSlot) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(timeSlot);
};

// Validate quantity
const validateQuantity = (quantity, min = 1, max = 100) => {
    const num = parseInt(quantity);
    return !isNaN(num) && num >= min && num <= max;
};

// Validate price
const validatePrice = (price) => {
    const num = parseFloat(price);
    return !isNaN(num) && num >= 0;
};

// Validate discount percentage
const validateDiscountPercentage = (discount) => {
    const num = parseFloat(discount);
    return !isNaN(num) && num >= 0 && num <= 100;
};

// Validate order status
const validateOrderStatus = (status) => {
    const validStatuses = [
        'pending', 'confirmed', 'pickup_assigned', 'collected',
        'processing', 'quality_check', 'out_for_delivery',
        'delivered', 'cancelled'
    ];
    return validStatuses.includes(status);
};

// Validate payment method
const validatePaymentMethod = (method) => {
    const validMethods = ['cod', 'online', 'wallet'];
    return validMethods.includes(method);
};

// Validate role
const validateRole = (role) => {
    const validRoles = ['customer', 'admin', 'staff'];
    return validRoles.includes(role);
};

// Validate service category
const validateServiceCategory = (category) => {
    const validCategories = ['shirts', 'pants', 'suits', 'ethnic', 'winter', 'home', 'other'];
    return validCategories.includes(category);
};

// Validate coupon type
const validateCouponType = (type) => {
    const validTypes = ['percentage', 'fixed'];
    return validTypes.includes(type);
};

// Validate object ID (MongoDB)
const validateObjectId = (id) => {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
};

// Validate address fields
const validateAddress = (address) => {
    const requiredFields = ['name', 'address', 'city', 'state', 'pincode'];

    for (const field of requiredFields) {
        if (!address[field] || address[field].trim() === '') {
            return {
                isValid: false,
                message: `${field} is required`
            };
        }
    }

    if (!validatePincode(address.pincode)) {
        return {
            isValid: false,
            message: 'Invalid pincode'
        };
    }

    return {
        isValid: true,
        message: 'Address is valid'
    };
};

// Validate login data
const validateLogin = (email, password) => {
    const errors = [];

    if (!email || email.trim() === '') {
        errors.push('Email is required');
    } else if (!validateEmail(email)) {
        errors.push('Invalid email format');
    }

    if (!password || password.trim() === '') {
        errors.push('Password is required');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Validate registration data
const validateRegistration = (name, email, phone, password) => {
    const errors = [];

    if (!name || name.trim() === '') {
        errors.push('Name is required');
    } else if (name.length < 2) {
        errors.push('Name must be at least 2 characters');
    }

    if (!email || email.trim() === '') {
        errors.push('Email is required');
    } else if (!validateEmail(email)) {
        errors.push('Invalid email format');
    }

    if (!phone || phone.trim() === '') {
        errors.push('Phone number is required');
    } else if (!validatePhone(phone)) {
        errors.push('Phone number must be 10 digits');
    }

    if (!password || password.trim() === '') {
        errors.push('Password is required');
    } else {
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            errors.push('Password must be at least 6 characters');
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

// Validate order creation data
const validateOrderData = (items, pickupAddress, deliveryAddress, pickupDate) => {
    const errors = [];

    if (!items || items.length === 0) {
        errors.push('At least one item is required');
    }

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item.service) {
            errors.push(`Item ${i + 1}: Service is required`);
        }
        if (!validateQuantity(item.quantity)) {
            errors.push(`Item ${i + 1}: Quantity must be between 1 and 100`);
        }
    }

    const addressValidation = validateAddress(pickupAddress);
    if (!addressValidation.isValid) {
        errors.push(`Pickup address: ${addressValidation.message}`);
    }

    const deliveryAddressValidation = validateAddress(deliveryAddress);
    if (!deliveryAddressValidation.isValid) {
        errors.push(`Delivery address: ${deliveryAddressValidation.message}`);
    }

    if (!pickupDate) {
        errors.push('Pickup date is required');
    } else if (!validateFutureDate(pickupDate)) {
        errors.push('Pickup date cannot be in the past');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

module.exports = {
    validateEmail,
    validatePhone,
    validatePassword,
    validatePincode,
    validateGST,
    validatePAN,
    validateAadhar,
    validateURL,
    validateFutureDate,
    validateDateRange,
    validateTimeSlot,
    validateQuantity,
    validatePrice,
    validateDiscountPercentage,
    validateOrderStatus,
    validatePaymentMethod,
    validateRole,
    validateServiceCategory,
    validateCouponType,
    validateObjectId,
    validateAddress,
    validateLogin,
    validateRegistration,
    validateOrderData
};