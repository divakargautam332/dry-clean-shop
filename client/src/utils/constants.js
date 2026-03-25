// Order Status Constants
export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PICKUP_ASSIGNED: 'pickup_assigned',
    COLLECTED: 'collected',
    PROCESSING: 'processing',
    QUALITY_CHECK: 'quality_check',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

export const ORDER_STATUS_LABELS = {
    [ORDER_STATUS.PENDING]: 'Order Placed',
    [ORDER_STATUS.CONFIRMED]: 'Order Confirmed',
    [ORDER_STATUS.PICKUP_ASSIGNED]: 'Pickup Assigned',
    [ORDER_STATUS.COLLECTED]: 'Items Collected',
    [ORDER_STATUS.PROCESSING]: 'Processing',
    [ORDER_STATUS.QUALITY_CHECK]: 'Quality Check',
    [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Out for Delivery',
    [ORDER_STATUS.DELIVERED]: 'Delivered',
    [ORDER_STATUS.CANCELLED]: 'Cancelled'
};

export const ORDER_STATUS_COLORS = {
    [ORDER_STATUS.PENDING]: 'yellow',
    [ORDER_STATUS.CONFIRMED]: 'blue',
    [ORDER_STATUS.PICKUP_ASSIGNED]: 'purple',
    [ORDER_STATUS.COLLECTED]: 'indigo',
    [ORDER_STATUS.PROCESSING]: 'orange',
    [ORDER_STATUS.QUALITY_CHECK]: 'pink',
    [ORDER_STATUS.OUT_FOR_DELIVERY]: 'cyan',
    [ORDER_STATUS.DELIVERED]: 'green',
    [ORDER_STATUS.CANCELLED]: 'red'
};

export const ORDER_STATUS_ICONS = {
    [ORDER_STATUS.PENDING]: '📝',
    [ORDER_STATUS.CONFIRMED]: '✅',
    [ORDER_STATUS.PICKUP_ASSIGNED]: '🚗',
    [ORDER_STATUS.COLLECTED]: '📦',
    [ORDER_STATUS.PROCESSING]: '🧺',
    [ORDER_STATUS.QUALITY_CHECK]: '🔍',
    [ORDER_STATUS.OUT_FOR_DELIVERY]: '🚚',
    [ORDER_STATUS.DELIVERED]: '🏠',
    [ORDER_STATUS.CANCELLED]: '❌'
};

// Payment Status Constants
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded'
};

export const PAYMENT_STATUS_LABELS = {
    [PAYMENT_STATUS.PENDING]: 'Pending',
    [PAYMENT_STATUS.PAID]: 'Paid',
    [PAYMENT_STATUS.FAILED]: 'Failed',
    [PAYMENT_STATUS.REFUNDED]: 'Refunded'
};

export const PAYMENT_STATUS_COLORS = {
    [PAYMENT_STATUS.PENDING]: 'yellow',
    [PAYMENT_STATUS.PAID]: 'green',
    [PAYMENT_STATUS.FAILED]: 'red',
    [PAYMENT_STATUS.REFUNDED]: 'orange'
};

// Payment Methods
export const PAYMENT_METHODS = {
    COD: 'cod',
    ONLINE: 'online',
    WALLET: 'wallet'
};

export const PAYMENT_METHOD_LABELS = {
    [PAYMENT_METHODS.COD]: 'Cash on Delivery',
    [PAYMENT_METHODS.ONLINE]: 'Online Payment',
    [PAYMENT_METHODS.WALLET]: 'Wallet'
};

// User Roles
export const USER_ROLES = {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
    STAFF: 'staff'
};

export const USER_ROLE_LABELS = {
    [USER_ROLES.CUSTOMER]: 'Customer',
    [USER_ROLES.ADMIN]: 'Administrator',
    [USER_ROLES.STAFF]: 'Staff'
};

// Service Categories
export const SERVICE_CATEGORIES = {
    SHIRTS: 'shirts',
    PANTS: 'pants',
    SUITS: 'suits',
    ETHNIC: 'ethnic',
    WINTER: 'winter',
    HOME: 'home',
    OTHER: 'other'
};

export const SERVICE_CATEGORY_LABELS = {
    [SERVICE_CATEGORIES.SHIRTS]: 'Shirts & Tops',
    [SERVICE_CATEGORIES.PANTS]: 'Pants & Trousers',
    [SERVICE_CATEGORIES.SUITS]: 'Suits & Blazers',
    [SERVICE_CATEGORIES.ETHNIC]: 'Ethnic Wear',
    [SERVICE_CATEGORIES.WINTER]: 'Winter Wear',
    [SERVICE_CATEGORIES.HOME]: 'Home Furnishings',
    [SERVICE_CATEGORIES.OTHER]: 'Other Services'
};

export const SERVICE_CATEGORY_ICONS = {
    [SERVICE_CATEGORIES.SHIRTS]: 'fa-shirt',
    [SERVICE_CATEGORIES.PANTS]: 'fa-pants',
    [SERVICE_CATEGORIES.SUITS]: 'fa-user-tie',
    [SERVICE_CATEGORIES.ETHNIC]: 'fa-sari',
    [SERVICE_CATEGORIES.WINTER]: 'fa-snowflake',
    [SERVICE_CATEGORIES.HOME]: 'fa-home',
    [SERVICE_CATEGORIES.OTHER]: 'fa-tshirt'
};

export const SERVICE_CATEGORY_COLORS = {
    [SERVICE_CATEGORIES.SHIRTS]: 'blue',
    [SERVICE_CATEGORIES.PANTS]: 'green',
    [SERVICE_CATEGORIES.SUITS]: 'purple',
    [SERVICE_CATEGORIES.ETHNIC]: 'orange',
    [SERVICE_CATEGORIES.WINTER]: 'cyan',
    [SERVICE_CATEGORIES.HOME]: 'red',
    [SERVICE_CATEGORIES.OTHER]: 'gray'
};

// Processing Times
export const PROCESSING_TIMES = {
    SAME_DAY: 'Same day',
    EXPRESS: 'Express',
    STANDARD_24: '24 hours',
    STANDARD_48: '48 hours',
    STANDARD_72: '72 hours'
};

// Delivery Vehicle Types
export const VEHICLE_TYPES = {
    BIKE: 'bike',
    SCOOTER: 'scooter',
    CAR: 'car',
    BICYCLE: 'bicycle'
};

export const VEHICLE_TYPE_LABELS = {
    [VEHICLE_TYPES.BIKE]: 'Bike',
    [VEHICLE_TYPES.SCOOTER]: 'Scooter',
    [VEHICLE_TYPES.CAR]: 'Car',
    [VEHICLE_TYPES.BICYCLE]: 'Bicycle'
};

// Notification Types
export const NOTIFICATION_TYPES = {
    ORDER: 'order',
    PAYMENT: 'payment',
    PROMOTION: 'promotion',
    DELIVERY: 'delivery',
    SYSTEM: 'system',
    REMINDER: 'reminder',
    REVIEW: 'review'
};

// Time Slots
export const TIME_SLOTS = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 05:00 PM',
    '05:00 PM - 07:00 PM'
];

// Weekdays
export const WEEKDAYS = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
];

export const WEEKDAY_LABELS = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
};

// Service Tags
export const SERVICE_TAGS = {
    DRY_CLEAN: 'dry-clean',
    IRONING: 'ironing',
    WASH_FOLD: 'wash-fold',
    STAIN_REMOVAL: 'stain-removal',
    EXPRESS: 'express'
};

export const SERVICE_TAG_LABELS = {
    [SERVICE_TAGS.DRY_CLEAN]: 'Dry Clean',
    [SERVICE_TAGS.IRONING]: 'Ironing',
    [SERVICE_TAGS.WASH_FOLD]: 'Wash & Fold',
    [SERVICE_TAGS.STAIN_REMOVAL]: 'Stain Removal',
    [SERVICE_TAGS.EXPRESS]: 'Express'
};

// Pricing Constants
export const GST_RATE = 0.18;
export const DELIVERY_CHARGE = 50;
export const EXPRESS_CHARGE = 100;
export const FREE_DELIVERY_MIN_ORDER = 500;

// Loyalty Constants
export const LOYALTY_POINTS_PER_RS = 1;
export const LOYALTY_POINTS_REDEMPTION_RATE = 0.5;

// Pagination Defaults
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

// Form Validation
export const VALIDATION_RULES = {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 50,
    PASSWORD_MIN_LENGTH: 6,
    PHONE_LENGTH: 10,
    PINCODE_LENGTH: 6
};

// API Endpoints
export const API_ENDPOINTS = {
    AUTH: '/auth',
    SERVICES: '/services',
    ORDERS: '/orders',
    ADMIN: '/admin',
    USER: '/user',
    COUPONS: '/coupons',
    DELIVERY: '/delivery',
    REVIEWS: '/reviews'
};

// Local Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    CART: 'cart'
};

// Route Paths
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    SERVICES: '/services',
    CART: '/cart',
    CHECKOUT: '/checkout',
    DASHBOARD: '/dashboard',
    MY_ORDERS: '/my-orders',
    TRACK_ORDER: '/track-order',
    PROFILE: '/profile',
    ADDRESS_BOOK: '/address-book',
    CONTACT: '/contact',
    FAQ: '/faq',
    ADMIN: {
        DASHBOARD: '/admin',
        ORDERS: '/admin/orders',
        SERVICES: '/admin/services',
        CUSTOMERS: '/admin/customers',
        COUPONS: '/admin/coupons',
        DELIVERY_STAFF: '/admin/delivery-staff',
        REVIEWS: '/admin/reviews',
        REPORTS: '/admin/reports',
        SETTINGS: '/admin/settings'
    }
};

// Toast Messages
export const TOAST_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful! Welcome back.',
    REGISTER_SUCCESS: 'Registration successful! Welcome to Dry Clean Shop.',
    LOGOUT_SUCCESS: 'Logged out successfully.',
    ORDER_SUCCESS: 'Order placed successfully!',
    ORDER_CANCELLED: 'Order cancelled successfully.',
    CART_ADDED: 'Item added to cart.',
    CART_REMOVED: 'Item removed from cart.',
    PROFILE_UPDATED: 'Profile updated successfully.',
    PASSWORD_CHANGED: 'Password changed successfully.',
    ADDRESS_ADDED: 'Address added successfully.',
    ADDRESS_UPDATED: 'Address updated successfully.',
    ADDRESS_DELETED: 'Address deleted successfully.',
    REVIEW_ADDED: 'Review added successfully.',
    COUPON_APPLIED: 'Coupon applied successfully!',
    COUPON_INVALID: 'Invalid coupon code.',
    PAYMENT_SUCCESS: 'Payment successful!',
    PAYMENT_FAILED: 'Payment failed. Please try again.'
};