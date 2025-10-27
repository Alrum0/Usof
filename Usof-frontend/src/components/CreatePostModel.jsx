const BASE_URL = import.meta.env.VITE_API_URL;

import ChevronRight from '../assets/Icon/chevron-right.svg?react';
import PlusIcon from '../assets/Icon/plus-icon.svg?react';
import ImageIcon from '../assets/Icon/image-icon.svg?react';
import LocationIcon from '../assets/Icon/location-icon.svg?react';
import EmojiIcon from '../assets/Icon/emoji-smile-icon.svg?react';

import { createPost } from '../http/postApi';
import { useSelector } from 'react-redux';
import { getUser } from '../http/userApi';
import { useState, useEffect, useRef } from 'react';
import { useNotification } from '../context/NotificationContext';

import CustomSelect from './CustomSelect';
import CustomInput from './CustomInput';
import Picker from 'emoji-picker-react';

export default function CreatePostModel({ isOpen, onClose }) {
  const [image, setImage] = useState([]);
  const [categories, setCategories] = useState([]);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [openLocationPicker, setOpenLocationPicker] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const { showNotification } = useNotification();
  const userId = useSelector((state) => state.auth.user?.id);

  const pickerRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      // Don't fetch if user is not authenticated
      if (!userId) return;

      try {
        setLoading(true);

        const response = await getUser(userId);
        setUserData(response.data);
      } catch (err) {
        showNotification(
          err?.response?.data?.message || 'Error fetching posts'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (!isOpen) return null;

  const isFormValid =
    categories.length > 0 && title.trim() !== '' && text.trim() !== '';

  const handleCategorySelect = (selectedCategories) => {
    setCategories(selectedCategories);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImage((prev) => [...prev, ...newImages]);
  };

  const handleCloseModal = () => {
    onClose();
    setText('');
    setTitle('');
    setLocation('');
    setImage([]);
    setCategories([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const categoryIds = categories.map((cat) => cat.id);
      const response = await createPost(
        title,
        text,
        location,
        image,
        categoryIds
      );

      if (response.status === 200) {
        showNotification(response.data.message);
        onClose();
        setText('');
        setTitle('');
        setLocation('');
        setImage([]);
        setCategories([]);
      }
    } catch (err) {
      showNotification(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const onEmojiClick = (emojiData, event) => {
    setText((prev) => prev + emojiData.emoji);
  };

  return (
    <section className='ml-0 md:ml-20 fixed inset-0 z-50'>
      <div
        className='absolute inset-0 bg-black opacity-50'
        onClick={handleCloseModal}
      />

      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--color-background-profile)] rounded-lg border border-[var(--color-border)] w-[95%] md:w-[70%] lg:w-[48%] max-h-[90vh] overflow-y-auto overflow-x-hidden'>
        <div className='px-4 md:px-8 py-4'>
          <div className='flex gap-10 md:gap-44 items-center justify-between'>
            <button
              onClick={handleCloseModal}
              className='text-white text-sm md:text-base cursor-pointer'
            >
              Скасувати
            </button>
            <h2 className='text-white text-sm md:text-base font-bold'>
              Новий ланцюжок
            </h2>
          </div>

          <hr className='border-[var(--color-border)] my-4 -mx-4 md:-mx-8' />

          <div className='flex items-center gap-3'>
            <img
              src={`${BASE_URL}/${userData.avatar}`}
              alt='logo профілю'
              className='w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 mt-1'
            />

            <div className='flex-1'>
              <div className='flex items-center gap-2'>
                <span className='text-white text-sm md:text-base font-medium'>
                  {userData.login}
                </span>
                <ChevronRight className='w-3 h-3 md:w-4 md:h-4 text-white flex-shrink-0' />
                <CustomSelect onSelect={handleCategorySelect} />
              </div>

              <input
                type='text'
                className='outline-none placeholder:text-[var(--color-text)] text-white w-full bg-transparent text-sm md:text-base'
                placeholder='Що у вас на думці?'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <hr className='border-[var(--color-border)] mt-3 -mx-4 md:-mx-9' />

          <div className='ml-8 md:ml-10 mt-6'>
            <CustomInput
              placeholder='Що нового?'
              value={text}
              onChange={setText}
            />
          </div>

          {image.length > 0 && (
            <div
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'transparent',
              }}
              className={`flex gap-3 justify-start ml-8 md:ml-12 overflow-x-auto scrollbar-thin scrollbar-gray-600 ${
                image.length === 1 ? 'justify-center' : ''
              }`}
            >
              {image.map((img, index) => (
                <div
                  key={index}
                  className={`relative flex-shrink-0 ${
                    image.length === 1 ? 'max-w-full' : ''
                  }`}
                >
                  <img
                    src={img.preview}
                    alt={`preview-${index}`}
                    className={`object-cover rounded-md border border-[var(--color-border)] transition-all duration-500 mb-1 ${
                      image.length === 1
                        ? 'max-h-[200px] md:max-h-[320px] max-w-full w-auto'
                        : 'h-[120px] md:h-[160px]'
                    }`}
                  />

                  <button
                    onClick={() =>
                      setImage((prev) => prev.filter((_, i) => i !== index))
                    }
                    className='absolute top-1 right-1'
                  >
                    <PlusIcon className='w-5 h-5 md:w-6 md:h-6 text-white rotate-45' />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div
            className={`ml-9 md:ml-13 flex gap-1 items-center ${
              image.length > 0 ? 'mt-2' : 'mt-0.5'
            }`}
          >
            <div>
              <input
                id='fileUpload'
                type='file'
                multiple
                accept='image/*'
                onChange={handleImageChange}
                className='hidden'
              />
              <label htmlFor='fileUpload' className='cursor-pointer'>
                <ImageIcon className='w-5 h-5 md:w-5.5 md:h-5.5' />
              </label>
            </div>
            <LocationIcon
              className='w-5 h-5 md:w-5.5 md:h-5.5 cursor-pointer'
              onClick={() => setOpenLocationPicker(true)}
            />
            <button onClick={() => setShowPicker((prev) => !prev)}>
              <EmojiIcon className='w-5 h-5 md:w-5.5 md:h-5.5 cursor-pointer' />
            </button>
            {showPicker && (
              <div
                ref={pickerRef}
                className={`absolute top-10 right-4 md:right-30 mt-2 z-50 transition-transform duration-150 ${
                  showPicker ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                }`}
              >
                <Picker
                  onEmojiClick={onEmojiClick}
                  lazyLoadEmojis
                  disableSearchBar
                  disableSkinTonePicker
                  theme='dark'
                />
              </div>
            )}

            {openLocationPicker && (
              <input
                type='text'
                className='outline-none placeholder:text-[var(--color-text)] text-white w-full bg-transparent border-b border-[var(--color-border)] text-sm md:text-base'
                placeholder='Введіть місцезнаходження'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onBlur={() => setOpenLocationPicker(false)}
                autoFocus
              />
            )}
          </div>

          <div className='flex flex-col md:flex-row justify-between mt-8 gap-4 md:gap-0 items-center'>
            <span className='text-[var(--color-text)] text-xs md:text-base text-center md:text-left'>
              Будь-хто може відповідати й цитувати
            </span>
            <button
              onClick={handleSubmit}
              className={`bg-[var(--color-accent)] px-4 py-2 rounded-lg font-semibold border text-sm md:text-base ${
                isFormValid
                  ? 'text-white border-[var(--color-border)] cursor-pointer'
                  : 'border-[var(--color-border)] text-[var(--color-text)]'
              }`}
              disabled={!isFormValid}
            >
              Опублікувати
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
