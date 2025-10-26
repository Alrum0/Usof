import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNotification } from '../context/NotificationContext';

import ChevronRight from '../assets/Icon/chevron-right.svg?react';
import PlusIcon from '../assets/Icon/plus-icon.svg?react';
import ImageIcon from '../assets/Icon/image-icon.svg?react';
import LocationIcon from '../assets/Icon/location-icon.svg?react';
import EmojiIcon from '../assets/Icon/emoji-smile-icon.svg?react';

import CustomSelect from './CustomSelect';
import CustomInput from './CustomInput';
import Picker from 'emoji-picker-react';

import {
  getPostById,
  updatePost,
  deletePostById,
  getCategoriesForPost,
} from '../http/postApi';
import { getUser } from '../http/userApi';

const BASE_URL = import.meta.env.VITE_API_URL;

export default function EditPostModal({ isOpen, onClose, postId }) {
  const [image, setImage] = useState([]);
  const [categories, setCategories] = useState([]);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [openLocationPicker, setOpenLocationPicker] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [originalImages, setOriginalImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

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
      try {
        const response = await getUser(userId);
        setUserData(response.data);
      } catch (err) {
        showNotification(err?.response?.data?.message || 'Error fetching user');
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await getPostById(postId);
        const data = res.data;
        setTitle(data.title);
        setText(data.content);
        setLocation(data.location || '');
        setOriginalImages(
          data.images?.map((img) => ({
            fileName: img,
            preview: `${BASE_URL}/${img}`,
            isExisting: true,
          })) || []
        );
        // fetch categories for this post
        try {
          const cats = await getCategoriesForPost(postId);
          setCategories(
            (cats || []).map((c) => ({ id: c.id, label: c.title }))
          );
        } catch (err) {
          // ignore
        }
      } catch (err) {
        showNotification('Error loading post');
      } finally {
        setLoading(false);
      }
    };
    if (postId && isOpen) fetchPost();
  }, [postId, isOpen]);

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
      isExisting: false,
    }));
    setImage((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index, isExisting) => {
    if (isExisting) {
      setOriginalImages((prev) => {
        const removed = prev[index];
        if (removed && removed.fileName) {
          setRemovedImages((r) => [...r, removed.fileName]);
        }
        return prev.filter((_, i) => i !== index);
      });
    } else {
      // index here is relative to combined [...originalImages, ...image]
      // non-existing images start after originalImages.length
      setImage((prevImage) => {
        const origLen = originalImages.length;
        const imgIndex = index - origLen;
        if (imgIndex >= 0) {
          return prevImage.filter((_, i) => i !== imgIndex);
        }
        return prevImage;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const categoryIds = categories.map((cat) => cat.id);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', text);
      formData.append('location', location);
      formData.append('status', 'ACTIVE');

      categoryIds.forEach((id) => formData.append('categories', id));
      image.forEach((img) => formData.append('image', img.file));
      // include removed existing images so backend can delete them
      removedImages.forEach((fn) => formData.append('removedImages', fn));

      const response = await updatePost(postId, formData);

      if (response.status === 200) {
        showNotification('Пост оновлено успішно');
        onClose();
      }
    } catch (err) {
      showNotification(err.response?.data?.message || 'Error updating post');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('Ви впевнені, що хочете видалити цей пост?')) return;
    try {
      await deletePostById(postId);
      showNotification('Пост видалено');
      onClose();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Error deleting post');
    }
  };

  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  return (
    <section className='ml-20 fixed inset-0 z-50'>
      <div className='absolute inset-0 bg-black opacity-50' onClick={onClose} />

      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--color-background-profile)] rounded-lg border border-[var(--color-border)] w-[48%] px-8 py-4 flex flex-col'>
        <div className='flex justify-between items-center'>
          <button
            onClick={onClose}
            className='text-white text-base cursor-pointer'
          >
            Скасувати
          </button>
          <h2 className='text-white text-base font-bold'>Редагувати пост</h2>
          <button
            onClick={handleDeletePost}
            className='text-red-500 text-sm hover:underline'
          >
            Видалити
          </button>
        </div>

        <hr className='border-[var(--color-border)] my-4 -mx-8' />

        <div className='flex items-center gap-3'>
          {userData?.avatar && (
            <img
              src={`${BASE_URL}/${userData.avatar}`}
              alt='avatar'
              className='w-10 h-10 rounded-full flex-shrink-0 mt-1'
            />
          )}

          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <span className='text-white text-base font-medium'>
                {userData?.login}
              </span>
              <ChevronRight className='w-4 h-4 text-white flex-shrink-0' />
              <CustomSelect
                onSelect={handleCategorySelect}
                defaultValue={categories}
                minSelected={1}
              />
            </div>

            <input
              type='text'
              className='outline-none placeholder:text-[var(--color-text)] text-white w-full bg-transparent'
              placeholder='Заголовок'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        <hr className='border-[var(--color-border)] mt-3 -mx-9' />

        <div className='ml-10 mt-6'>
          <CustomInput
            placeholder='Оновіть текст поста'
            value={text}
            onChange={setText}
          />
        </div>

        {(originalImages.length > 0 || image.length > 0) && (
          <div
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'transparent' }}
            className='flex gap-3 justify-start ml-12 overflow-x-auto scrollbar-thin scrollbar-gray-600'
          >
            {[...originalImages, ...image].map((img, index) => (
              <div key={index} className='relative flex-shrink-0'>
                <img
                  src={img.preview}
                  alt={`preview-${index}`}
                  className='object-cover rounded-md border border-[var(--color-border)] h-[160px] transition-all duration-500 mb-1'
                />
                <button
                  onClick={() => handleRemoveImage(index, img.isExisting)}
                  className='absolute top-1 right-1'
                >
                  <PlusIcon className='w-6 h-6 text-white rotate-45' />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className='ml-13 flex gap-1 items-center mt-2'>
          <label htmlFor='fileUpload' className='cursor-pointer'>
            <ImageIcon className='w-5.5 h-5.5' />
          </label>
          <input
            id='fileUpload'
            type='file'
            multiple
            accept='image/*'
            onChange={handleImageChange}
            className='hidden'
          />

          <LocationIcon
            className='w-5.5 h-5.5 cursor-pointer'
            onClick={() => setOpenLocationPicker(true)}
          />
          <button onClick={() => setShowPicker((prev) => !prev)}>
            <EmojiIcon className='w-5.5 h-5.5 cursor-pointer' />
          </button>

          {showPicker && (
            <div
              ref={pickerRef}
              className='absolute top-10 right-30 mt-2 z-50 transition-transform duration-150'
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
              className='outline-none placeholder:text-[var(--color-text)] text-white w-full bg-transparent border-b border-[var(--color-border)]'
              placeholder='Оновіть місцезнаходження'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onBlur={() => setOpenLocationPicker(false)}
              autoFocus
            />
          )}
        </div>

        <div className='flex justify-between mt-8 items-center'>
          <span className='text-[var(--color-text)]'>
            Будь-хто може відповідати й цитувати
          </span>
          <button
            onClick={handleSubmit}
            className={`bg-[var(--color-accent)] px-4 py-2 rounded-lg font-semibold border ${
              isFormValid
                ? 'text-white border-[var(--color-border)] cursor-pointer'
                : 'border-[var(--color-border)] text-[var(--color-text)]'
            }`}
            disabled={!isFormValid}
          >
            Зберегти зміни
          </button>
        </div>
      </div>
    </section>
  );
}
