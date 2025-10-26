const BASE_URL = import.meta.env.VITE_API_URL;

import VerifyOfficialIcon from '../assets/Icon/verified.png';
import VerifyAdminIcon from '../assets/Icon/verify-admin.png';

import { useState, useEffect } from 'react';
import { getPostsByUser, getUserReposts } from '../http/postApi';
import { useNotification } from '../context/NotificationContext';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  getUser,
  followUser,
  getFollowing,
  unfollowUser,
  getFollowers,
} from '../http/userApi';

import NewPostInput from '../components/NewPostInput';
import PostModel from '../components/PostModel';
import UnfollowModel from '../components/UnfollowModel';
import EditModel from '../components/EditModel';

export default function ProfilePage() {
  const { showNotification } = useNotification();
  const { id } = useParams();

  const [posts, setPosts] = useState([]);
  const [reposts, setReposts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [following, setFollowing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [activeTab, setActiveTab] = useState('chains');

  const userId = useSelector((state) => state.auth.user?.id);
  // const isOfficial = useSelector((state) => state.auth.user?.isOfficial);
  // const isAdmin = useSelector((state) => state.auth.user?.role === 'ADMIN');
  const isSelf = userId === Number(id);
  const isAdmin = userData?.role === 'ADMIN';
  const isOfficial = userData?.isOfficial;

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

        // Only fetch following status if user is authenticated
        if (userId) {
          const followingResponse = await getFollowing(userId);
          setFollowing(followingResponse.data.some((u) => u.id === Number(id)));
        }
      } catch (err) {
        showNotification(
          err?.response?.data?.message || 'Error fetching posts'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, userId]);

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

    const fetchReposts = async () => {
      try {
        const response = await getUserReposts(id);
        setReposts(
          Array.isArray(response.data?.data)
            ? response.data.data
            : Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (err) {
        showNotification(
          err?.response?.data?.message || 'Error fetching reposts'
        );
      }
    };

    fetchPosts();
    fetchReposts();
  }, [userId, id]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const followersResponse = await getFollowers(id);
        setFollowers(followersResponse.data);
      } catch (err) {
        showNotification(
          err?.response?.data?.message || 'Error fetching followers'
        );
      }
    };
    fetchFollowers();
  }, [id]);

  return (
    <>
      <section className='flex justify-center items-center flex-col'>
        <div className='mt-10'>
          <h1 className='text-xl font-bold text-white'>Профіль</h1>
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
              {isAdmin ? (
                <img
                  src={VerifyAdminIcon}
                  alt='verified'
                  className='absolute bottom-1 -left-2 w-7 h-7'
                />
              ) : isOfficial ? (
                <img
                  src={VerifyOfficialIcon}
                  alt='verified'
                  className='absolute -bottom-1 -left-1 w-7 h-7'
                />
              ) : null}
            </div>
          </div>

          <div className='-mt-1 mr-20'>
            <span style={{ whiteSpace: 'pre-line' }} className=' text-white'>
              {userData?.biography}
            </span>
          </div>

          <div className='mt-3'>
            <button
              className={`text-[var(--color-text)] text-[14px] font-normal hover:underline cursor-pointer flex ${
                followers.length > 0 ? 'gap-1.5' : ''
              }`}
            >
              <div className='flex -space-x-1.5 overflow-hidden items-center'>
                {followers.slice(0, 3).map((follower, index) => {
                  return (
                    <img
                      key={index}
                      src={`${BASE_URL}/${follower.avatar}`}
                      className='w-4.5 h-4.5 border border-[var(--color-border)] rounded-full'
                    />
                  );
                })}
              </div>
              {followers.length} followers
            </button>
          </div>
          <div className='mt-6'>
            <button
              onClick={
                isSelf
                  ? () => setIsOpenEdit(true)
                  : following
                  ? () => setIsOpen(true)
                  : handleFollow
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
          <div className='mt-6 -mx-8 grid grid-cols-4 place-items-center text-[var(--color-text)] text-xl font-normal '>
            <button
              onClick={() => setActiveTab('chains')}
              className={`border-b w-full text-center pb-4 transition-colors duration-200 cursor-pointer 
      ${
        activeTab === 'chains'
          ? 'border-white text-white'
          : 'border-[var(--color-border)] text-[var(--color-text)]'
      }`}
            >
              Ланцюжки
            </button>
            <button
              onClick={() => setActiveTab('replies')}
              className={`border-b w-full text-center pb-4 transition-colors duration-200 cursor-pointer
      ${
        activeTab === 'replies'
          ? 'border-white text-white'
          : 'border-[var(--color-border)] text-[var(--color-text)]'
      }`}
            >
              Відповіді
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`border-b w-full text-center pb-4 transition-colors duration-200 cursor-pointer
      ${
        activeTab === 'media'
          ? 'border-white text-white'
          : 'border-[var(--color-border)] text-[var(--color-text)]'
      }`}
            >
              Медіафайли
            </button>
            <button
              onClick={() => setActiveTab('reposts')}
              className={`border-b w-full text-center pb-4 transition-colors duration-200 cursor-pointer
      ${
        activeTab === 'reposts'
          ? 'border-white text-white'
          : 'border-[var(--color-border)] text-[var(--color-text)]'
      }`}
            >
              Репости
            </button>
          </div>
          {isSelf && (
            <div className='mt-4'>
              <NewPostInput />
            </div>
          )}
          <div>
            {activeTab === 'chains' &&
              posts.map((post) => <PostModel key={post.id} post={post} />)}
            {activeTab === 'reposts' &&
              reposts.map((post) => <PostModel key={post.id} post={post} />)}
          </div>
        </div>
      </section>
      <UnfollowModel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userData={userData}
        handleUnfollow={handleUnfollow}
      />
      <EditModel
        isOpen={isSelf && isOpenEdit}
        onClose={() => setIsOpenEdit(false)}
      />
    </>
  );
}
