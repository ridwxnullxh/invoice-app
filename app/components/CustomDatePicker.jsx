import { useState, useRef, useEffect } from "react";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function formatDateDisplay(dateStr) {
  if (!dateStr) return "Select date";
  const [y, m, d] = dateStr.split('-');
  return `${parseInt(d)} ${monthNames[parseInt(m) - 1]} ${y}`;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay(); // 0 is Sunday
}

export default function CustomDatePicker({ id, value, onChange, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const initialDate = value 
    ? new Date(value.split('-')[0], value.split('-')[1] - 1, value.split('-')[2]) 
    : new Date();
    
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (day) => {
    const yyyy = day.getFullYear();
    const mm = String(day.getMonth() + 1).padStart(2, '0');
    const dd = String(day.getDate()).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);

  const grid = [];
  
  for (let i = firstDay - 1; i >= 0; i--) {
    grid.push({
      date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    grid.push({
      date: new Date(currentYear, currentMonth, i),
      isCurrentMonth: true,
    });
  }
  
  const remainingCells = (7 - (grid.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    grid.push({
      date: new Date(currentYear, currentMonth + 1, i),
      isCurrentMonth: false,
    });
  }

  const selectedDateObj = value 
    ? new Date(value.split('-')[0], value.split('-')[1] - 1, value.split('-')[2]) 
    : null;

  const isSelected = (day) => {
    if (!selectedDateObj) return false;
    return (
      day.getDate() === selectedDateObj.getDate() &&
      day.getMonth() === selectedDateObj.getMonth() &&
      day.getFullYear() === selectedDateObj.getFullYear()
    );
  };

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
        <span>{formatDateDisplay(value)}</span>
        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" className="text-[#7E88C3]">
          <path d="M14 2h-.667V.667A.667.667 0 0012.667 0H12a.667.667 0 00-.667.667V2H4.667V.667A.667.667 0 004 0h-.667a.667.667 0 00-.666.667V2H2C.897 2 0 2.897 0 4v10c0 1.103.897 2 2 2h12c1.103 2 2 1.103 2-2V4c0-1.103-.897-2-2-2zm.667 12c0 .367-.3.667-.667.667H2A.668.668 0 011.333 14V6.693h13.334V14z" fill="currentColor" fillRule="nonzero"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 rounded-lg bg-white dark:bg-[#252945] shadow-[0_10px_20px_rgba(72,84,159,0.25)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.25)] p-5">
          <div className="flex justify-between items-center mb-6">
            <button type="button" onClick={handlePrevMonth} className="p-1 hover:opacity-80 transition-opacity">
              <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M6.342.886L2.114 5.114l4.228 4.228" stroke="#7C5DFA" strokeWidth="2" fill="none" fillRule="evenodd"/></svg>
            </button>
            <span className="text-sm font-bold text-[#0C0E16] dark:text-[#DFE3FA]">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button type="button" onClick={handleNextMonth} className="p-1 hover:opacity-80 transition-opacity">
              <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l4.228 4.228L1 9.456" stroke="#7C5DFA" strokeWidth="2" fill="none" fillRule="evenodd"/></svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-3">
            {grid.map((day, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleDateClick(day.date)}
                className={`text-sm font-bold transition-colors w-full flex items-center justify-center
                  ${!day.isCurrentMonth 
                    ? "text-[#DFE3FA] dark:text-[#494E6E] opacity-70 font-medium" 
                    : isSelected(day.date) 
                      ? "text-[#7C5DFA] dark:text-[#7C5DFA]" 
                      : "text-[#0C0E16] dark:text-[#DFE3FA] hover:text-[#7C5DFA] dark:hover:text-[#7C5DFA]"}
                `}
              >
                {day.date.getDate()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
