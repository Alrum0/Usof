import { useRef, useState, useEffect } from 'react';
import ChevronRight from '../assets/Icon/chevron-right.svg?react';

export default function CustomSelect({
  options = [],
  placeholder = 'Додайте тему',
  onSelect,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter((option) => {
    return option.label.toLowerCase().includes(inputValue.toLowerCase());
  });

  const displayOptions =
    inputValue === '' ? options.slice(0, 1) : filteredOptions;

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setInputValue(option.label);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div ref={wrapperRef} className='relative w-full'>
      <input
        type='text'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setIsOpen(true)}
        className='w-full py-2 bg-[var(--background-color)] text-white outline-none placeholder:text-[var(--color-text)]'
      />

      {isOpen && (
        <div className='absolute top-full left-0 right-0 mt-1 bg-[var(--color-background-profile)] border border-[var(--color-border)] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto'>
          {displayOptions.length > 0 ? (
            displayOptions.map((options) => (
              <div
                key={options.value}
                onClick={() => handleOptionSelect(options)}
                className={`px-4 py-2 hover:bg-[var(--color-border)] cursor-pointer text-white transition-colors ${
                  selectedOption?.value === options.value
                    ? 'bg-[var(--color-border)]'
                    : ''
                }`}
              >
                {options.label}
              </div>
            ))
          ) : (
            <div className='px-4 py-2 text-white text-center'>
              {inputValue ? 'Немає результатів' : 'Виберіть тему'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
