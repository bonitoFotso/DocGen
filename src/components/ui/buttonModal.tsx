import React from 'react';
import { useModal } from '../../hooks/useModal';

interface ButtonModalProps {
    title: string;
    children: React.ReactNode;
}

const ButtonModal: React.FC<ButtonModalProps> = ({ title, children }) => {
    const { showModal } = useModal();
    
      const handleOpenModal = () => {
        showModal(
          <div>
           {children}
          </div>,
            title
        );
      };
    return (
        <>
            <button
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
      onClick={handleOpenModal}
    >
      {title}
    </button>

            
        </>
    );
};

export default ButtonModal;