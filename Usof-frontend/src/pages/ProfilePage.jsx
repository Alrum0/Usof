const BASE_URL = import.meta.env.VITE_API_URL;

import Logo from '../assets/Profile/Logo.jpg';
import VerifiedIcon from '../assets/Icon/verified.png';
import VerifyAdminIcon from '../assets/Icon/verify-admin.png';

import { useState, useEffect } from 'react';
import { getPostsByUser } from '../http/postApi';
import { useNotification } from '../context/NotificationContext';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  getUser,
  followUser,
  getFollowing,
  unfollowUser,
} from '../http/userApi';

import NewPostInput from '../components/NewPostInput';
import PostModel from '../components/PostModel';
import UnfollowModel from '../components/UnfollowModel';

export default function ProfilePage() {
  const { showNotification } = useNotification();
  const { id } = useParams();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [following, setFollowing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const userId = useSelector((state) => state.auth.user.id);
  // const isVerified = useSelector((state) => state.auth.user.isVerified);
  const isVerified = true;
  const isSelf = userId === Number(id);

  const handleFollow = async () => {
    try {
      const response = await followUser(id);
      showNotification(response.data.message);
      setFollowing(true);
    } catch (err) {
      showNotification(err?.response?.data?.message || 'Error fetching posts');
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await unfollowUser(userData.id);
      showNotification(response.data.message);
      setFollowing(false);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      showNotification(
        err?.response?.data?.message || 'Error unfollowing user'
      );
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const response = await getUser(id);
        setUserData(response.data);

        const followingResponse = await getFollowing(userId);
        setFollowing(followingResponse.data.some((u) => u.id === Number(id)));
      } catch (err) {
        showNotification(
          err?.response?.data?.message || 'Error fetching posts'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userPosts = await getPostsByUser(id);
        setPosts(Array.isArray(userPosts) ? userPosts : []);
      } catch (err) {
        showNotification(
          err?.response?.data?.message || 'Error fetching posts'
        );
      }
    };

    fetchPosts();
  }, [userId, id]);

  return (
    <>
      <section className='flex justify-center items-center flex-col'>
        <div className='mt-10'>
          <h1 className='text-xl font-bold text-white'>Profile</h1>
        </div>
        <div className='mt-6 bg-[var(--color-background-profile)] border border-[var(--color-border)] rounded-2xl p-8 w-1/2'>
          <div className='flex justify-between items-center'>
            <div className='flex flex-col gap-0.5'>
              <h2 className='text-white text-2xl font-medium'>
                {userData?.fullName}
              </h2>
              <h3 className='text-white text-[14px] font-normal'>
                {userData?.login}
              </h3>
            </div>
            <div className='relative w-22 h-22'>
              <img
                src={`${BASE_URL}/${userData?.avatar}`}
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
            <button
              onClick={
                isSelf ? null : following ? () => setIsOpen(true) : handleFollow
              }
              className={`text-x py-2 border border-[var(--color-border)] rounded-lg w-full cursor-pointer 
              ${
                isSelf
                  ? 'text-white'
                  : following
                  ? 'text-white bg-transparent'
                  : 'text-black bg-white'
              }`}
            >
              {isSelf ? 'Edit Profile' : following ? 'Відстежується' : 'Follow'}
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
          {isSelf && (
            <div className='mt-4'>
              <NewPostInput />
            </div>
          )}
          <div>
            {posts.map((post) => (
              <PostModel key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
      <UnfollowModel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userData={userData}
        handleUnfollow={handleUnfollow}
      />
    </>
  );
}
