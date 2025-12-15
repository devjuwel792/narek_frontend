
import { useEffect, useRef } from "react";
import { FaEye } from "react-icons/fa6";

const ActionDropdown = ({
  transactionId,
  transaction,
  onAction,
  isOpen,
  onToggle,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handleActionClick = (action) => {
    onAction(transactionId, action);
    onToggle(null);
  };

  const dropdownItems = [
    {
      label: "Pending",
      action: "pending",
      className: "text-gray-700 hover:bg-gray-50",
    },
    {
      label: "Approve",
      action: "Approve",
      className: "text-gray-700 hover:bg-gray-50",
    },
    {
      label: "Cancel",
      action: "cancel",
      className: "text-gray-700 hover:bg-gray-50",
    },
  ];

  // Add cancel option for pending transactions
  if (transaction?.status === "Pending") {
    dropdownItems.push({
      label: "Cancel Transaction",
      action: "Cancel Transaction",
      icon: (
        <svg
          className="w-4 h-4"
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
      ),
      className: "text-red-600 hover:bg-red-50",
    });
  }

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-[50]"
    >
      <div className="py-1">
        {dropdownItems.map((item, index) => (
          <div key={index}>
            {item?.separator && (
              <div className="border-t border-gray-100 my-1"></div>
            )}
            <button
              onClick={() => handleActionClick(item?.action)}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors duration-200 ${item.className}`}
            >
              {item?.icon}
              {item?.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionDropdown;
