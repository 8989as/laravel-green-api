import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

/**
 * Hook to handle authentication requirements for specific actions
 * Returns a function that checks auth and shows modal if needed
 */
export const useRequireAuth = () => {
    const { isAuthenticated } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    // Execute pending action when user becomes authenticated
    useEffect(() => {
        if (isAuthenticated && pendingAction) {
            pendingAction();
            setPendingAction(null);
            setShowAuthModal(false);
        }
    }, [isAuthenticated, pendingAction]);

    /**
     * Require authentication before executing an action
     * @param {Function} action - The action to execute if authenticated
     * @param {string} initialTab - The initial tab to show in auth modal ('login' or 'register')
     */
    const requireAuth = (action, initialTab = 'login') => {
        if (isAuthenticated) {
            // User is authenticated, execute action immediately
            action();
        } else {
            // User is not authenticated, store action and show auth modal
            setPendingAction(() => action);
            setShowAuthModal(true);
        }
    };

    const closeAuthModal = () => {
        setShowAuthModal(false);
        setPendingAction(null);
    };

    return {
        requireAuth,
        showAuthModal,
        closeAuthModal,
        isAuthenticated
    };
};

export default useRequireAuth;