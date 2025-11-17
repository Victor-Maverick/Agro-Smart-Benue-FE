'use client'

import React from 'react';

export interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    isDestructive?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    message = 'Please confirm this action',
    confirmText = 'Confirm',
    isDestructive = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
            <div className="relative bg-white h-[268px] rounded-[12px] shadow-lg w-[400px] z-50">
                <div className="p-6 flex flex-col gap-[20px]">
                    <div className="flex flex-col gap-[10px]">
                        <div className="w-[48px] h-[48px] p-1.5 rounded-full border-[8px] border-[#FFFAEB] bg-[#FEF0C7] flex items-center justify-center mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 9V14M12 21.41H5.94C2.47 21.41 1.02 18.93 2.7 15.9L5.82 10.28L8.76 5.01C10.54 1.79 13.46 1.79 15.24 5.01L18.18 10.29L21.3 15.91C22.98 18.94 21.52 21.42 18.06 21.42H12V21.41Z" stroke="#DC6803" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M11.995 17H12.004" stroke="#DC6803" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-[#101828] text-[18px]">{title}</p>
                            <p className="text-[14px] text-[#667085]">{message}</p>
                        </div>
                    </div>
                    <div className="flex w-[352px] h-[44px] gap-[12px]">
                        <div
                            onClick={onClose}
                            className="flex w-[170px] h-full justify-center items-center border text-[16px] border-[#D0D5DD] text-[#344054] font-medium rounded-[8px] cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </div>
                        <div
                            onClick={onConfirm}
                            className={`flex w-[170px] h-full justify-center items-center text-white font-medium rounded-[8px] cursor-pointer transition-colors ${
                                isDestructive 
                                    ? 'bg-[#FF5050] border border-[#FF5050] hover:bg-[#E04545]' 
                                    : 'bg-[#10b981] border border-[#10b981] hover:bg-[#059669]'
                            }`}
                        >
                            {confirmText}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
