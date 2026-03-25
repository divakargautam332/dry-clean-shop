import React, { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    showCloseButton = true,
    closeOnOverlayClick = true,
    className = '',
    titleClassName = '',
    contentClassName = '',
}) => {
    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        full: 'max-w-full mx-4',
    };

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={closeOnOverlayClick ? onClose : () => { }}
            >
                {/* Backdrop */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                </Transition.Child>

                {/* Modal Panel */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className={`w-full ${sizes[size]} transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all ${className}`}
                            >
                                {/* Header */}
                                {(title || showCloseButton) && (
                                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                        {title && (
                                            <Dialog.Title
                                                as="h3"
                                                className={`text-lg font-semibold leading-6 text-gray-900 ${titleClassName}`}
                                            >
                                                {title}
                                            </Dialog.Title>
                                        )}
                                        {showCloseButton && (
                                            <button
                                                onClick={onClose}
                                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                            >
                                                <svg
                                                    className="h-5 w-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Content */}
                                <div className={`px-6 py-4 ${contentClassName}`}>
                                    {children}
                                </div>

                                {/* Footer */}
                                {footer && (
                                    <div className="border-t border-gray-200 px-6 py-4">
                                        {footer}
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

// Confirmation Modal
export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmVariant = 'danger',
    loading = false,
}) => {
    const buttonColors = {
        primary: 'bg-blue-600 hover:bg-blue-700',
        danger: 'bg-red-600 hover:bg-red-700',
        success: 'bg-green-600 hover:bg-green-700',
        warning: 'bg-yellow-500 hover:bg-yellow-600',
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        disabled={loading}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${buttonColors[confirmVariant]} disabled:opacity-50`}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            }
        >
            <p className="text-gray-600">{message}</p>
        </Modal>
    );
};

// Alert Modal
export const AlertModal = ({
    isOpen,
    onClose,
    title = 'Alert',
    message,
    type = 'info',
    buttonText = 'OK',
}) => {
    const typeStyles = {
        info: 'text-blue-600 bg-blue-100',
        success: 'text-green-600 bg-green-100',
        warning: 'text-yellow-600 bg-yellow-100',
        error: 'text-red-600 bg-red-100',
    };

    const icons = {
        info: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        success: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        warning: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        error: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            footer={
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {buttonText}
                    </button>
                </div>
            }
        >
            <div className="flex items-center space-x-3">
                <div className={`flex-shrink-0 p-2 rounded-full ${typeStyles[type]}`}>
                    {icons[type]}
                </div>
                <div>
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{message}</p>
                </div>
            </div>
        </Modal>
    );
};

export default Modal;