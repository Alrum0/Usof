import { useRef, useState, useEffect } from 'react';
import { getAllCategories } from '../http/categoriesApi';
import { useNotification } from '../context/NotificationContext';

import PlusIcon from '../assets/Icon/plus-icon.svg?react';

export default function CustomSelect({
  placeholder = 'Додайте тему',
  onSelect,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedOption, setSelectedOption] = useState([]);
  const [categories, setCategories] = useState([]);
  const wrapperRef = useRef(null);

  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(
          response.data.map((cat) => ({ id: cat.id, label: cat.title }))
        );
      } catch (err) {
        showNotification(err.response?.data?.message || err.message);
      }
    };
    fetchCategories();
  }, []);

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

  const filteredOptions = categories.filter(
    (category) =>
      category.label.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedOption.some((sel) => sel.id === category.id)
  );

  const displayOptions =
    inputValue === '' ? categories.slice(0, 1) : filteredOptions;

  const handleOptionSelect = (category) => {
    const newSelected = [...selectedOption, category];
    setSelectedOption(newSelected);
    setInputValue('');
    setIsOpen(false);

    onSelect?.(newSelected);
  };

  const handleRemove = (id) => {
    const updated = selectedOption.filter((c) => c.id !== id);
    setSelectedOption(updated);
    if (onSelect) {
      onSelect(updated);
    }
  };

  return (
    <div ref={wrapperRef} className='relative flex w-full'>
      <input
        type='text'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setIsOpen(true)}
        className='w-full bg-[var(--background-color)] text-white outline-none placeholder:text-[var(--color-text)]'
      />

      {selectedOption.length > 0 && (
        <div className='flex gap-2 justify-end'>
          {selectedOption.map((cat) => (
            <span
              key={cat.id}
              className='px-3 py-1 bg-[var(--color-border)] text-white rounded-full text-sm flex items-center gap-1'
            >
              {cat.label}
              <button
                type='button'
                onClick={() => handleRemove(cat.id)}
                className='text-white'
              >
                <PlusIcon className='w-4 h-4 rotate-45' />
              </button>
            </span>
          ))}
        </div>
      )}

      {isOpen && (
        <div className='absolute top-full left-0 right-0 mt-1 bg-[var(--color-background-profile)] border border-[var(--color-border)] rounded-lg shadow-lg z-10 max-h-60 w-50 overflow-y-auto'>
          {displayOptions.length > 0 ? (
            displayOptions.map((options) => (
              <div
                key={options.id}
                onClick={() => handleOptionSelect(options)}
                className={`px-4 py-2 hover:bg-[var(--color-border)] cursor-pointer text-white transition-colors text-center ${
                  selectedOption?.id === options.id
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
