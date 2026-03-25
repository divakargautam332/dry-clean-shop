import { useContext } from 'react';
import CartContext from '../context/CartContext';

/**
 * Custom hook to access cart context
 * @returns {Object} Cart context value with cart state and methods
 */
const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }

    return context;
};

export default useCart;