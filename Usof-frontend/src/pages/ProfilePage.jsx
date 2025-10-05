import Logo from '../assets/Profile/Logo.jpg';
import VerifiedIcon from '../assets/Icon/verified.png';
import VerifyAdminIcon from '../assets/Icon/verify-admin.png';

import { useState, useEffect } from 'react';
import { getPostsByUser } from '../http/postApi';
import { useNotification } from '../context/NotificationContext';
import { useSelector } from 'react-redux';

import NewPostInput from '../components/NewPostInput';
import PostModel from '../components/PostModel';

export default function ProfilePage() {
  const [posts, setPosts] = useState([]);
  const userId = useSelector((state) => state.auth.user.id);
  const { showNotification } = useNotification();

  // const isVerified = useSelector((state) => state.auth.user.isVerified);
  const isVerified = true;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userPosts = await getPostsByUser(userId);
        setPosts(Array.isArray(userPosts) ? userPosts : []);
      } catch (err) {
        showNotification(
          err?.response?.data?.message || 'Error fetching posts'
        );
      }
    };

    fetchPosts();
  }, [userId]);

  return (
    <section className='flex justify-center items-center flex-col'>
      <div className='mt-10'>
        <h1 className='text-xl font-bold text-white'>Profile</h1>
      </div>
      <div className='mt-6 bg-[var(--color-background-profile)] border border-[var(--color-border)] rounded-2xl p-8 w-1/2'>
        <div className='flex justify-between items-center'>
          <div className='flex flex-col gap-0.5'>
            <h2 className='text-white text-2xl font-medium'>Andrii</h2>
            <h3 className='text-white text-[14px] font-normal'>
              staviyskiiandrii
            </h3>
          </div>
          <div className='relative w-22 h-22'>
            <img
              src={Logo}
              alt='logo profile'
              className='w-22 h-22 rounded-full object-cover'
            />
            {isVerified && (
              <img
                src={VerifyAdminIcon}
                alt='verified'
                className='absolute -bottom-1 -left-1 w-7 h-7'
              />
            )}
          </div>
        </div>

        <div className='mt-2'>
          <button className='text-[var(--color-text)] text-[14px] font-normal hover:underline cursor-pointer'>
            252 followers
          </button>
        </div>
        <div className='mt-6'>
          <button className='text-white text-x py-2 border border-[var(--color-border)] rounded-lg w-full cursor-pointer'>
            Edit Profile
          </button>
        </div>
        <div className='mt-6 -mx-8 grid grid-cols-4 place-items-center text-[var(--color-text)] text-xl font-normal'>
          <button className='border-b w-full border-[var(--color-border)] text-center pb-4 focus:border-white focus:text-white'>
            Ланцюжки
          </button>
          <button className='border-b w-full border-[var(--color-border)] text-center pb-4 focus:border-white focus:text-white'>
            Відповіді
          </button>
          <button className='border-b w-full border-[var(--color-border)] text-center pb-4 focus:border-white focus:text-white'>
            Медіафайли
          </button>
          <button className='border-b w-full border-[var(--color-border)] text-center pb-4 focus:border-white focus:text-white'>
            Репости
          </button>
        </div>
        <div className='mt-4'>
          <NewPostInput />
        </div>
        <div>
          {posts.map((post) => (
            <PostModel key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
