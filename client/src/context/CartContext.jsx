import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [itemCount, setItemCount] = useState(0);

    // Load cart from localStorage on initial render
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCartItems(parsedCart);
                updateTotals(parsedCart);
            } catch (error) {
                console.error('Failed to load cart:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateTotals(cartItems);
    }, [cartItems]);

    const updateTotals = (items) => {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartTotal(total);
        setItemCount(count);
    };

    // Add item to cart
    const addToCart = (service, quantity = 1, specialInstructions = '') => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.serviceId === service._id);

            if (existingItem) {
                // Update quantity if item already exists
                const newQuantity = existingItem.quantity + quantity;
                if (newQuantity > (service.maxOrderQuantity || 50)) {
                    toast.error(`Maximum ${service.maxOrderQuantity || 50} items allowed for ${service.name}`);
                    return prevItems;
                }

                toast.success(`Updated ${service.name} quantity to ${newQuantity}`);
                return prevItems.map(item =>
                    item.serviceId === service._id
                        ? { ...item, quantity: newQuantity, specialInstructions }
                        : item
                );
            } else {
                // Add new item
                const price = service.discountedPrice || service.price;
                toast.success(`${service.name} added to cart!`);
                return [...prevItems, {
                    serviceId: service._id,
                    serviceName: service.name,
                    price: price,
                    originalPrice: service.price,
                    quantity: quantity,
                    image: service.image,
                    category: service.category,
                    processingTime: service.processingTime,
                    specialInstructions: specialInstructions,
                    isOnDiscount: service.discountedPrice !== null,
                    discountPercentage: service.discountPercentage || 0
                }];
            }
        });
    };

    // Remove item from cart
    const removeFromCart = (serviceId) => {
        setCartItems(prevItems => {
            const item = prevItems.find(item => item.serviceId === serviceId);
            if (item) {
                toast.info(`${item.serviceName} removed from cart`);
            }
            return prevItems.filter(item => item.serviceId !== serviceId);
        });
    };

    // Update item quantity
    const updateQuantity = (serviceId, quantity, maxQuantity = 50) => {
        if (quantity < 1) {
            removeFromCart(serviceId);
            return;
        }

        if (quantity > maxQuantity) {
            toast.error(`Maximum ${maxQuantity} items allowed`);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.serviceId === serviceId
                    ? { ...item, quantity: quantity }
                    : item
            )
        );
    };

    // Update special instructions for an item
    const updateInstructions = (serviceId, instructions) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.serviceId === serviceId
                    ? { ...item, specialInstructions: instructions }
                    : item
            )
        );
    };

    // Clear entire cart
    const clearCart = () => {
        setCartItems([]);
        toast.info('Cart cleared');
    };

    // Get cart item count
    const getCartItemCount = () => {
        return itemCount;
    };

    // Get cart subtotal
    const getCartSubtotal = () => {
        return cartTotal;
    };

    // Get cart items for checkout
    const getCartItemsForCheckout = () => {
        return cartItems.map(item => ({
            service: item.serviceId,
            quantity: item.quantity,
            price: item.price,
            specialInstructions: item.specialInstructions
        }));
    };

    // Check if cart is empty
    const isCartEmpty = () => {
        return cartItems.length === 0;
    };

    // Get total items count (including quantities)
    const getTotalItemsCount = () => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    };

    // Calculate delivery charge based on subtotal
    const getDeliveryCharge = () => {
        const subtotal = getCartSubtotal();
        if (subtotal >= 500) return 0;
        return 50;
    };

    // Calculate GST (18%)
    const getGST = () => {
        return getCartSubtotal() * 0.18;
    };

    // Calculate final total
    const getFinalTotal = () => {
        const subtotal = getCartSubtotal();
        const delivery = getDeliveryCharge();
        const gst = getGST();
        return subtotal + delivery + gst;
    };

    const value = {
        cartItems,
        cartTotal,
        itemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateInstructions,
        clearCart,
        getCartItemCount,
        getCartSubtotal,
        getCartItemsForCheckout,
        isCartEmpty,
        getTotalItemsCount,
        getDeliveryCharge,
        getGST,
        getFinalTotal
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;