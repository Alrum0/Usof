const BASE_URL = import.meta.env.VITE_API_URL;

import Logo from '../assets/Profile/Logo.jpg';

import { useState, useEffect } from 'react';
import { getUser } from '../http/userApi';
import { useNotification } from '../context/NotificationContext';
import { useSelector } from 'react-redux';

import CreatePostModel from './CreatePostModel';

export default function NewPostInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      <CreatePostModel isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <button
        className='w-full flex items-center  text-left outline-none'
        onClick={() => setIsOpen(true)}
      >
        <img
          src={userData?.avatar ? `${BASE_URL}/${userData.avatar}` : Logo}
          alt='logo profile'
          className='w-10 h-10 rounded-full flex-shrink-0'
        />
        <div className='flex-1'>
          <input
            type='text'
            placeholder='Що нового?'
            className='bg-transparent w-full border-[var(--color-border)] flex-1 py-2 px-3 text-[#777777] outline-none cursor-text'
            readOnly
          />
        </div>
        <span className='text-white px-4 py-2 border border-[var(--color-border)] rounded-lg cursor-pointer flex-shrink-0 '>
          Опублікувати
        </span>
      </button>
      <hr className='border-[var(--color-border)] mt-4 -mx-8' />
    </>
  );
}
