import { useEffect, useRef } from "react";

/**
 * Accessible delete confirmation modal.
 * - role="alertdialog"
 * - Focus trap
 * - ESC key to cancel
 */
export default function DeleteModal({ invoiceId, onConfirm, onCancel }) {
  const cancelRef = useRef(null);
  const deleteRef = useRef(null);
  const overlayRef = useRef(null);

  // Focus the cancel button on mount
  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  // ESC key handler + focus trap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel();
        return;
      }
      if (e.key === "Tab") {
        const focusable = [cancelRef.current, deleteRef.current].filter(Boolean);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
      aria-hidden="false"
      onClick={(e) => { if (e.target === overlayRef.current) onCancel(); }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-desc"
        className="bg-white dark:bg-[#1E2139] rounded-lg p-8 max-w-[480px] w-full shadow-2xl"
      >
        <h2
          id="delete-modal-title"
          className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Confirm Deletion
        </h2>
        <p
          id="delete-modal-desc"
          className="text-gray-500 dark:text-[#888EB0] mb-8 text-sm leading-relaxed"
        >
          Are you sure you want to delete invoice{" "}
          <span className="font-bold text-gray-700 dark:text-white">#{invoiceId}</span>?
          This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-4">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="px-6 py-3 rounded-full text-sm font-bold text-[#7E88C3] dark:text-[#DFE3FA] bg-[#F9FAFE] dark:bg-[#252945] hover:bg-[#DFE3FA] dark:hover:bg-[#0C0E16] transition"
          >
            Cancel
          </button>
          <button
            ref={deleteRef}
            onClick={onConfirm}
            className="px-6 py-3 rounded-full text-sm font-bold text-white bg-[#EC5757] hover:bg-[#FF9797] transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
