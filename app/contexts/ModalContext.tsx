// src/app/contexts/ModalContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';

interface ConfirmOptions {
    title?: string;
    message: ReactNode;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
}

interface ModalContextType {
    showConfirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        options: ConfirmOptions;
        resolve: ((value: boolean) => void) | null;
    }>({
        isOpen: false,
        options: { message: '' },
        resolve: null,
    });

    const showConfirm = useCallback((options: ConfirmOptions) => {
        return new Promise<boolean>((resolve) => {
            setModalState({
                isOpen: true,
                options,
                resolve,
            });
        });
    }, []);

    const handleConfirm = useCallback(() => {
        if (modalState.resolve) {
            modalState.resolve(true);
        }
        setModalState((prev) => ({ ...prev, isOpen: false }));
    }, [modalState]);

    const handleCancel = useCallback(() => {
        if (modalState.resolve) {
            modalState.resolve(false);
        }
        setModalState((prev) => ({ ...prev, isOpen: false }));
    }, [modalState]);

    return (
        <ModalContext.Provider value={{ showConfirm }}>
            {children}
            <ConfirmModal
                isOpen={modalState.isOpen}
                title={modalState.options.title}
                message={modalState.options.message}
                confirmText={modalState.options.confirmText}
                cancelText={modalState.options.cancelText}
                isDanger={modalState.options.isDanger}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
}
