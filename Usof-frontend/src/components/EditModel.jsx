const BASE_URL = import.meta.env.VITE_API_URL;

import { useEffect } from 'react';
import { getUser } from '../http/userApi';
import { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useSelector } from 'react-redux';

import { updateUser, uploadAvatar } from '../http/userApi';

export default function EditModel({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [updateData, setUpdateData] = useState(null);

  const { showNotification } = useNotification();
  const userId = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
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
  }, [userId, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setUserData((prev) => ({
        ...prev,
        avatar: URL.createObjectURL(e.target.files[0]),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let updateMessage = '';

      const userUpdatePayload = {
        fullName: userData?.fullName,
        biography: userData?.biography,
        email: userData?.email,
      };

      const hasUserChanges =
        userData?.fullName || userData?.biography || userData?.email;

      if (hasUserChanges) {
        const response = await updateUser(userId, userUpdatePayload);
        updateMessage += response.data.message;
      }

      if (avatarFile) {
        const avatarResponse = await uploadAvatar(avatarFile);
        updateMessage += ' ' + avatarResponse.data.message;
      }

      showNotification(updateMessage || 'Дані профілю успішно оновлено!');
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

      <div className='absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/3 bg-[var(--color-notification)] px-8 pt-5 pb-6 rounded-lg z-50 w-2/5 border border-[var(--color-border)] ml-10'>
        <div className='flex gap-28 items-center'>
          <button
            onClick={onClose}
            className='text-white text-base cursor-pointer'
          >
            Скасувати
          </button>
          <h2 className='text-white text-base font-bold'>Редагувати профіль</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='mt-8'>
            <div className='-mt-2 flex items-center justify-between gap-4'>
              <div className='flex flex-col flex-1'>
                <span className='text-white ml-2'>Ім'я</span>
                <input
                  name='fullName'
                  type='text'
                  className='p-2 text-white outline-none'
                  placeholder={userData?.fullName || 'Full Name'}
                  value={userData?.fullName || ''}
                  onChange={handleChange}
                />
              </div>
              <div className='h-18 w-18'>
                <input
                  id='fileUpload'
                  type='file'
                  multiple
                  className='hidden'
                  onChange={handleAvatarChange}
                />
                <label
                  htmlFor='fileUpload'
                  className='cursor-pointer h-18 w-18'
                >
                  <img
                    src={`${BASE_URL}/${userData?.avatar}`}
                    alt='logo profile'
                    className='w-18 h-18 rounded-full object-cover'
                  />
                </label>
              </div>
            </div>

            <hr className='mt-2 text-[var(--color-border)] -mx-2' />

            <div className='mt-4 flex flex-col'>
              <span className='text-white ml-2'>Біографія</span>
              <textarea
                name='biography'
                className='p-3 text-white outline-none resize-y min-h-[60px] bg-transparent  rounded-md focus:border-white transition-colors'
                value={userData?.biography || ''}
                onChange={handleChange}
                placeholder={userData?.biography || '+ Написати біографію'}
                rows={3}
                maxLength={200}
              />
            </div>

            <hr className='mt-2 text-[var(--color-border)] -mx-2' />

            <div className='mt-4 flex flex-col'>
              <span className='text-white ml-2'>Пошта</span>
              <input
                name='email'
                type='text'
                className='p-2 text-white outline-none'
                placeholder={userData?.email || '+ Написати пошту'}
                value={userData?.email || ''}
                onChange={handleChange}
              />
            </div>

            <button
              className='mt-4 bg-white text-black py-3 px-4 rounded-lg font-semibold w-full'
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
