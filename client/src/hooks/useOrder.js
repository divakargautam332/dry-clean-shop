import { useContext } from 'react';
import OrderContext from '../context/OrderContext';

/**
 * Custom hook to access order context
 * @returns {Object} Order context value with order state and methods
 */
const useOrder = () => {
    const context = useContext(OrderContext);

    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider');
    }

    return context;
};

export default useOrder;