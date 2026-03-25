// Order Status Constants
const ORDER_STATUS = {
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

const ORDER_STATUS_LIST = Object.values(ORDER_STATUS);

const ORDER_STATUS_LABELS = {
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

// Payment Status Constants
const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded'
};

const PAYMENT_METHODS = {
    COD: 'cod',
    ONLINE: 'online',
    WALLET: 'wallet'
};

// User Roles
const USER_ROLES = {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
    STAFF: 'staff'
};

// Service Categories
const SERVICE_CATEGORIES = {
    SHIRTS: 'shirts',
    PANTS: 'pants',
    SUITS: 'suits',
    ETHNIC: 'ethnic',
    WINTER: 'winter',
    HOME: 'home',
    OTHER: 'other'
};

const SERVICE_CATEGORY_LABELS = {
    [SERVICE_CATEGORIES.SHIRTS]: 'Shirts & Tops',
    [SERVICE_CATEGORIES.PANTS]: 'Pants & Trousers',
    [SERVICE_CATEGORIES.SUITS]: 'Suits & Blazers',
    [SERVICE_CATEGORIES.ETHNIC]: 'Ethnic Wear',
    [SERVICE_CATEGORIES.WINTER]: 'Winter Wear',
    [SERVICE_CATEGORIES.HOME]: 'Home Furnishings',
    [SERVICE_CATEGORIES.OTHER]: 'Other Services'
};

// Processing Times
const PROCESSING_TIMES = {
    SAME_DAY: 'Same day',
    EXPRESS: 'Express',
    STANDARD_24: '24 hours',
    STANDARD_48: '48 hours',
    STANDARD_72: '72 hours'
};

// Delivery Vehicle Types
const VEHICLE_TYPES = {
    BIKE: 'bike',
    SCOOTER: 'scooter',
    CAR: 'car',
    BICYCLE: 'bicycle'
};

// Notification Types
const NOTIFICATION_TYPES = {
    ORDER: 'order',
    PAYMENT: 'payment',
    PROMOTION: 'promotion',
    DELIVERY: 'delivery',
    SYSTEM: 'system',
    REMINDER: 'reminder',
    REVIEW: 'review'
};

// Notification Priorities
const NOTIFICATION_PRIORITIES = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent'
};

// Coupon Applicable For
const COUPON_APPLICABLE = {
    ALL: 'all',
    NEW_USERS: 'new_users',
    EXISTING_USERS: 'existing_users',
    FIRST_ORDER: 'first_order'
};

// Discount Types
const DISCOUNT_TYPES = {
    PERCENTAGE: 'percentage',
    FIXED: 'fixed'
};

// Tax Constants
const GST_RATE = 0.18; // 18%
const DELIVERY_CHARGE = 50;
const EXPRESS_CHARGE = 100;
const FREE_DELIVERY_MIN_ORDER = 500;

// Loyalty Constants
const LOYALTY_POINTS_PER_RS = 1; // 1 point per ₹100 spent
const LOYALTY_POINTS_REDEMPTION_RATE = 0.5; // 1 point = ₹0.50

// Pagination Defaults
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

// File Upload Limits
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

// Cache Durations (in seconds)
const CACHE_DURATIONS = {
    SERVICES: 3600, // 1 hour
    CATEGORIES: 86400, // 24 hours
    ORDERS: 300, // 5 minutes
    REVIEWS: 1800 // 30 minutes
};

// Order Cancellation Rules
const CANCELLATION_ALLOWED_STATUSES = [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED];
const CANCELLATION_REFUND_DAYS = 7; // Refund within 7 days

// Delivery Time Slots
const TIME_SLOTS = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 05:00 PM',
    '05:00 PM - 07:00 PM'
];

// Weekdays
const WEEKDAYS = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
];

// Service Tags
const SERVICE_TAGS = {
    DRY_CLEAN: 'dry-clean',
    IRONING: 'ironing',
    WASH_FOLD: 'wash-fold',
    STAIN_REMOVAL: 'stain-removal',
    EXPRESS: 'express'
};

// Review Constants
const REVIEW_MIN_RATING = 1;
const REVIEW_MAX_RATING = 5;
const REVIEW_EDIT_DAYS_LIMIT = 30; // Can edit within 30 days

// Report Periods
const REPORT_PERIODS = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly'
};

// Express Shipping Charge
const getExpressCharge = (isExpress) => isExpress ? EXPRESS_CHARGE : 0;

// Delivery Charge based on distance (in km)
const getDeliveryCharge = (distance = 0) => {
    const baseCharge = DELIVERY_CHARGE;
    const extraCharge = Math.max(0, Math.floor(distance / 5) * 10);
    return baseCharge + extraCharge;
};

// Calculate GST
const calculateGST = (amount) => amount * GST_RATE;

// Calculate Loyalty Points
const calculateLoyaltyPoints = (amount) => Math.floor(amount / 100) * LOYALTY_POINTS_PER_RS;

// Calculate Discount
const calculateDiscount = (amount, discountType, discountValue, maxDiscount = null) => {
    let discount = 0;

    if (discountType === DISCOUNT_TYPES.PERCENTAGE) {
        discount = (amount * discountValue) / 100;
        if (maxDiscount) {
            discount = Math.min(discount, maxDiscount);
        }
    } else if (discountType === DISCOUNT_TYPES.FIXED) {
        discount = discountValue;
    }

    return Math.min(discount, amount);
};

// Validate Order Status Transition
const isValidStatusTransition = (currentStatus, newStatus) => {
    const transitions = {
        [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
        [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PICKUP_ASSIGNED, ORDER_STATUS.CANCELLED],
        [ORDER_STATUS.PICKUP_ASSIGNED]: [ORDER_STATUS.COLLECTED, ORDER_STATUS.CANCELLED],
        [ORDER_STATUS.COLLECTED]: [ORDER_STATUS.PROCESSING],
        [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.QUALITY_CHECK],
        [ORDER_STATUS.QUALITY_CHECK]: [ORDER_STATUS.OUT_FOR_DELIVERY],
        [ORDER_STATUS.OUT_FOR_DELIVERY]: [ORDER_STATUS.DELIVERED],
        [ORDER_STATUS.DELIVERED]: [],
        [ORDER_STATUS.CANCELLED]: []
    };

    return transitions[currentStatus]?.includes(newStatus) || false;
};

module.exports = {
    ORDER_STATUS,
    ORDER_STATUS_LIST,
    ORDER_STATUS_LABELS,
    PAYMENT_STATUS,
    PAYMENT_METHODS,
    USER_ROLES,
    SERVICE_CATEGORIES,
    SERVICE_CATEGORY_LABELS,
    PROCESSING_TIMES,
    VEHICLE_TYPES,
    NOTIFICATION_TYPES,
    NOTIFICATION_PRIORITIES,
    COUPON_APPLICABLE,
    DISCOUNT_TYPES,
    GST_RATE,
    DELIVERY_CHARGE,
    EXPRESS_CHARGE,
    FREE_DELIVERY_MIN_ORDER,
    LOYALTY_POINTS_PER_RS,
    LOYALTY_POINTS_REDEMPTION_RATE,
    DEFAULT_PAGE,
    DEFAULT_LIMIT,
    MAX_LIMIT,
    MAX_FILE_SIZE,
    ALLOWED_IMAGE_TYPES,
    CACHE_DURATIONS,
    CANCELLATION_ALLOWED_STATUSES,
    CANCELLATION_REFUND_DAYS,
    TIME_SLOTS,
    WEEKDAYS,
    SERVICE_TAGS,
    REVIEW_MIN_RATING,
    REVIEW_MAX_RATING,
    REVIEW_EDIT_DAYS_LIMIT,
    REPORT_PERIODS,
    getExpressCharge,
    getDeliveryCharge,
    calculateGST,
    calculateLoyaltyPoints,
    calculateDiscount,
    isValidStatusTransition
};