import { useState, useRef, useEffect } from "react";

export default function CustomSelect({ id, value, options, onChange, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        id={id}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-5 py-4 rounded text-sm font-bold dark:text-white bg-white dark:bg-[#1E2139] border transition outline-none cursor-pointer flex justify-between items-center shadow-sm
          ${
            error
              ? "border-[#EC5757]"
              : isOpen
              ? "border-[#7C5DFA] dark:border-[#7C5DFA]"
              : "border-[#DFE3FA] dark:border-[#252945] hover:border-[#7C5DFA] dark:hover:border-[#7C5DFA]"
          }`}
      >
        <span>{selectedOption ? selectedOption.label : "Select option"}</span>
        <svg
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          width="11"
          height="7"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1l4.228 4.228L9.456 1" stroke="#7C5DFA" strokeWidth="2" fill="none" fillRule="evenodd"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 rounded-lg bg-white dark:bg-[#252945] shadow-[0_10px_20px_rgba(72,84,159,0.25)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.25)] overflow-hidden">
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-5 py-4 text-sm font-bold text-[#0C0E16] dark:text-[#DFE3FA] hover:text-[#7C5DFA] dark:hover:text-[#7C5DFA] transition-colors
                ${index !== options.length - 1 ? "border-b border-[#DFE3FA] dark:border-[#1E2139]" : ""}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
