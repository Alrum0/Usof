import { useState, useEffect, useRef } from 'react';

export default function CustomInput({
  placeholder,
  onChange,
  maxHeight = 200,
}) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [value, maxHeight]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className='w-full px-4 -mt-2 bg-transparent text-white outline-none placeholder:text-[var(--color-text)] resize-none overflow-hidden'
      rows={1}
      style={{ minHeight: '20px', maxHeight: `${maxHeight}px` }}
    />
  );
}
