// components/modals/DeleteBookModal.js
import React from 'react';
import Modal from './Model.tsx';

const DeleteBookModal = ({ isOpen, onClose, onConfirm, book }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Book">
      <div>
        <p className="text-gray-700">
          Are you sure you want to delete <strong>"{book?.title}"</strong>? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete Book
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteBookModal;