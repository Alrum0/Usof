const BASE_URL = import.meta.env.VITE_API_URL;

import Logo from '../assets/Profile/Logo.jpg';
import ChevronRight from '../assets/Icon/chevron-right.svg?react';
import PlusIcon from '../assets/Icon/plus-icon.svg?react';
import ImageIcon from '../assets/Icon/image-icon.svg?react';

import { createPost } from '../http/postApi';
import { useSelector } from 'react-redux';
import { getUser } from '../http/userApi';
import { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';

import CustomSelect from './CustomSelect';
import CustomInput from './CustomInput';

export default function CreatePostModel({ isOpen, onClose }) {
  const [image, setImage] = useState([]);
  const [categories, setCategories] = useState([]);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const { showNotification } = useNotification();
  const userId = useSelector((state) => state.auth.user.id);

  useEffect(() => {
    const fetchUser = async () => {
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
    setImage([]);
    setCategories([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const categoryIds = categories.map((cat) => cat.id);
      const response = await createPost(title, text, image, categoryIds);

      if (response.status === 200) {
        showNotification(response.data.message);
        onClose();
        setText('');
        setTitle('');
        setImage([]);
        setCategories([]);
      }
    } catch (err) {
      showNotification(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className=' ml-20 fixed inset-0 z-50'>
      <div
        className='absolute inset-0 bg-black opacity-50'
        onClick={handleCloseModal}
      />

      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--color-background-profile)] rounded-lg border border-[var(--color-border)] w-[48%] px-8 py-4 flex flex-col'>
        <div className='flex gap-44 items-center'>
          <button
            onClick={handleCloseModal}
            className='text-white text-base cursor-pointer'
          >
            Скасувати
          </button>
          <h2 className='text-white text-base font-bold'>Новий ланцюжок</h2>
        </div>

        <hr className='border-[var(--color-border)] my-4 -mx-8' />

        <div className='flex items-center gap-3'>
          <img
            src={`${BASE_URL}/${userData.avatar}`}
            alt='logo профілю'
            className='w-10 h-10 rounded-full flex-shrink-0 mt-1'
          />

          <div className='flex-1'>
            <div className='flex items-center gap-2'>
              <span className='text-white text-base font-medium'>
                {userData.login}
              </span>
              <ChevronRight className='w-4 h-4 text-white flex-shrink-0' />
              <CustomSelect onSelect={handleCategorySelect} />
            </div>

            <input
              type='text'
              className='outline-none placeholder:text-[var(--color-text)] text-white w-full bg-transparent'
              placeholder='Що у вас на думці?'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        <hr className='border-[var(--color-border)] mt-3 -mx-9' />

        <div className='ml-10 mt-6'>
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
            className={`flex gap-3 justify-start ml-12 overflow-x-auto scrollbar-thin scrollbar-gray-600 ${
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
                      ? 'max-h-[320px] max-w-full w-auto'
                      : ' h-[160px]'
                  }`}
                />

                <button
                  onClick={() =>
                    setImage((prev) => prev.filter((_, i) => i !== index))
                  }
                  className='absolute top-1 right-1'
                >
                  <PlusIcon className='w-6 h-6 text-white rotate-45' />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={`ml-13 ${image.length > 0 ? 'mt-2' : 'mt-0.5'}`}>
          <input
            id='fileUpload'
            type='file'
            multiple
            accept='image/*'
            onChange={handleImageChange}
            className='hidden'
          />
          <label htmlFor='fileUpload' className='cursor-pointer'>
            <ImageIcon className='w-5.5 h-5.5' />
          </label>
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
            Опублікувати
          </button>
        </div>
      </div>
    </section>
  );
}
