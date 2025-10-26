const BASE_URL = import.meta.env.VITE_API_URL;

import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getFollowers } from '../http/userApi';

import VerifyAdminIcon from '../assets/Icon/verify-admin.png';
import VerifiedIcon from '../assets/Icon/verified.png';

export default function UserTooltip({
  userData,
  onMouseEnter,
  onMouseLeave,
  following,
  loading,
  onFollow,
  onOpenUnfollow,
  isVisible,
}) {
  if (!isVisible) return null;

  const [followers, setFollowers] = useState([]);

  const targetId = userData?.authorId || userData?.id;

  const isAdmin = (userData?.authorRole || userData?.role) === 'ADMIN';
  const isOfficial = userData?.authorIsOfficial || userData?.isOfficial;
  const isSelf = useSelector(
    (state) => state.auth.user?.id === Number(targetId)
  );

  const getFullName = () => {
    return userData?.authorFullName || userData?.fullName || 'User';
  };
  const getLoginName = () => {
    return userData?.authorName || userData?.login || 'login';
  };
  const getAvatar = () => {
    return userData?.authorAvatar || userData?.avatar || 'default-avatar.png';
  };

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const followersResponse = await getFollowers(targetId);
        setFollowers(followersResponse.data);
      } catch (err) {
        showNotification(
          err?.response?.data?.message || 'Error fetching followers'
        );
      }
    };
    if (targetId) {
      fetchFollowers();
    }
  }, [targetId]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className='bg-[var(--color-background-profile)] border border-[var(--color-border)] rounded-md shadow-lg p-4 w-[360px] absolute top-10 z-[60]'
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className='flex justify-between items-center px-3'>
        <div className='flex flex-col gap-0.5'>
          <h2 className='text-white text-xl font-medium'>{getFullName()}</h2>
          <h3 className='text-white text-[14px] font-normal'>
            {getLoginName()}
          </h3>
        </div>
        <div className='relative w-18 h-18'>
          <img
            src={`${BASE_URL}/${getAvatar()}`}
            alt='logo profile'
            className='w-18 h-18 rounded-full object-cover'
          />
          {isAdmin ? (
            <img
              src={VerifyAdminIcon}
              alt='verified admin'
              className='absolute -bottom-1 left-0 w-5 h-5'
            />
          ) : isOfficial ? (
            <img
              src={VerifiedIcon}
              alt='verified'
              className='absolute -bottom-1 -left-1 w-7 h-7'
            />
          ) : null}
        </div>
      </div>

      <div className='-mt-1 px-3'>
        <div
          className={`text-[var(--color-text)] text-[14px] font-normal cursor-pointer flex ${
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
          {followers.length} читачів
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          following ? onOpenUnfollow() : onFollow();
        }}
        className={`text-x py-2 border border-[var(--color-border)] mt-2 rounded-lg w-full cursor-pointer 
    ${
      isSelf
        ? 'hidden'
        : following
        ? 'text-white bg-transparent'
        : 'text-black bg-white'
    }
  `}
        disabled={loading}
      >
        {following ? 'Відстежується' : 'Follow'}
      </button>
    </motion.section>
  );
}
