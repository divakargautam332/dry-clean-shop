// Simulated SMS (No actual Twilio calls)
const sendSMS = async (phoneNumber, message) => {
    console.log(`📱 [SIMULATED] SMS to ${phoneNumber}: ${message}`);
    return { success: true, simulated: true };
};

const sendOrderConfirmationSMS = async (user, order) => {
    const message = `Order ${order.orderNumber} confirmed! Total: ₹${order.totalAmount}`;
    return sendSMS(user.phone, message);
};

const sendOrderStatusSMS = async (user, order, status) => {
    const message = `Order ${order.orderNumber} status updated to: ${status}`;
    return sendSMS(user.phone, message);
};

const sendPickupReminderSMS = async (user, order) => {
    const message = `Reminder: Pickup for order ${order.orderNumber} on ${order.pickupDate}`;
    return sendSMS(user.phone, message);
};

const sendDeliveryNotificationSMS = async (user, order) => {
    const message = `Order ${order.orderNumber} is out for delivery!`;
    return sendSMS(user.phone, message);
};

const sendOTPSMS = async (phoneNumber, otp) => {
    const message = `Your OTP is: ${otp}`;
    return sendSMS(phoneNumber, message);
};

const sendWelcomeSMS = async (user) => {
    const message = `Welcome to DryCleanPro, ${user.name}!`;
    return sendSMS(user.phone, message);
};

const sendPromotionalSMS = async (phoneNumber, offer) => {
    const message = `Special offer: ${offer.title}`;
    return sendSMS(phoneNumber, message);
};

const sendCancellationSMS = async (user, order, reason) => {
    const message = `Order ${order.orderNumber} cancelled. Reason: ${reason}`;
    return sendSMS(user.phone, message);
};

const sendStaffAssignmentSMS = async (staff, order) => {
    const message = `New order ${order.orderNumber} assigned to you.`;
    return sendSMS(staff.phone, message);
};

const sendBulkSMS = async (phoneNumbers, message) => {
    const results = [];
    for (const phone of phoneNumbers) {
        const result = await sendSMS(phone, message);
        results.push({ phone, ...result });
    }
    return results;
};

const formatPhoneNumber = (phone) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        cleaned = '+91' + cleaned;
    }
    return cleaned;
};

module.exports = {
    sendSMS,
    sendOrderConfirmationSMS,
    sendOrderStatusSMS,
    sendPickupReminderSMS,
    sendDeliveryNotificationSMS,
    sendOTPSMS,
    sendWelcomeSMS,
    sendPromotionalSMS,
    sendCancellationSMS,
    sendStaffAssignmentSMS,
    sendBulkSMS,
    formatPhoneNumber
};