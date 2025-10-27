const BASE_URL = import.meta.env.VITE_API_URL;

import { useEffect } from 'react';
import { getUser } from '../http/userApi';
import { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useSelector } from 'react-redux';

import { updateUser, uploadAvatar } from '../http/userApi';

export default function EditModel({ isOpen, onClose, onUpdate }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const { showNotification } = useNotification();
  const userId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setAvatarFile(null);
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
      setAvatarPreview(null);
      return;
    }

    const fetchUser = async () => {
      // Don't fetch if user is not authenticated
      if (!userId) return;

      try {
        setInitialLoading(true);
        const response = await getUser(userId);
        setUserData(response.data);
      } catch (err) {
        console.error(err);
        showNotification(
          err?.response?.data?.message || 'Error fetching user data'
        );
        onClose();
      } finally {
        setInitialLoading(false);
      }
    };
    fetchUser();
  }, [isOpen, userId, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (avatarFile) {
        await uploadAvatar(avatarFile);
      }

      const userUpdatePayload = {
        fullName: userData?.fullName,
        biography: userData?.biography,
        email: userData?.email,
      };

      const hasUserChanges =
        userData?.fullName || userData?.biography || userData?.email;

      if (hasUserChanges) {
        await updateUser(userId, userUpdatePayload);
      }

      showNotification('Дані профілю успішно оновлено!');

      if (typeof onUpdate === 'function') {
        await onUpdate();
      }

      onClose();
    } catch (err) {
      console.error('Update error:', err);
      showNotification(
        err?.response?.data?.message || 'Error updating profile'
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
        <div className='text-white text-lg'>Завантаження даних профілю...</div>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 z-50'>
      <div className='absolute inset-0 bg-black opacity-50' onClick={onClose} />

      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--color-notification)] px-4 md:px-8 pt-4 md:pt-5 pb-4 md:pb-6 rounded-lg z-50 w-[95%] max-w-[500px] md:max-w-[70%] lg:max-w-[500px] border border-[var(--color-border)] md:ml-10 max-h-[90vh] overflow-y-auto'>
        <div className='flex gap-10 md:gap-28 items-center justify-between md:justify-start'>
          <button
            onClick={onClose}
            className='text-white text-sm md:text-base cursor-pointer'
          >
            Скасувати
          </button>
          <h2 className='text-white text-sm md:text-base font-bold'>
            Редагувати профіль
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='mt-6 md:mt-8'>
            <div className='-mt-2 flex items-center justify-between gap-4'>
              <div className='flex flex-col flex-1 min-w-0'>
                <span className='text-white ml-2 text-sm md:text-base'>
                  Ім'я
                </span>
                <input
                  name='fullName'
                  type='text'
                  className='p-2 text-white outline-none bg-transparent text-sm md:text-base'
                  placeholder={userData?.fullName || 'Full Name'}
                  value={userData?.fullName || ''}
                  onChange={handleChange}
                />
              </div>
              <div className='h-16 w-16 md:h-18 md:w-18 flex-shrink-0'>
                <input
                  id='fileUpload'
                  type='file'
                  multiple
                  className='hidden'
                  onChange={handleAvatarChange}
                />
                <label
                  htmlFor='fileUpload'
                  className='cursor-pointer block h-16 w-16 md:h-18 md:w-18'
                >
                  <img
                    src={
                      avatarPreview
                        ? avatarPreview
                        : `${BASE_URL}/${userData?.avatar}`
                    }
                    alt='logo profile'
                    className='w-full h-full rounded-full object-cover'
                  />
                </label>
              </div>
            </div>

            <hr className='mt-2 text-[var(--color-border)] -mx-2' />

            <div className='mt-4 flex flex-col'>
              <span className='text-white ml-2 text-sm md:text-base'>
                Біографія
              </span>
              <textarea
                name='biography'
                className='p-2 md:p-3 text-white outline-none resize-y min-h-[60px] bg-transparent rounded-md focus:border-white transition-colors text-sm md:text-base'
                value={userData?.biography || ''}
                onChange={handleChange}
                placeholder={userData?.biography || '+ Написати біографію'}
                rows={3}
                maxLength={200}
              />
            </div>

            <hr className='mt-2 text-[var(--color-border)] -mx-2' />

            <div className='mt-4 flex flex-col'>
              <span className='text-white ml-2 text-sm md:text-base'>
                Пошта
              </span>
              <input
                name='email'
                type='text'
                className='p-2 text-white outline-none bg-transparent text-sm md:text-base'
                placeholder={userData?.email || '+ Написати пошту'}
                value={userData?.email || ''}
                onChange={handleChange}
              />
            </div>

            <button
              className='mt-4 bg-white text-black py-2.5 md:py-3 px-4 rounded-lg font-semibold w-full text-sm md:text-base'
              disabled={loading}
            >
              {loading ? 'Збереження...' : 'Готово'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
