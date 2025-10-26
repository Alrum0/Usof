const BASE_URL = import.meta.env.VITE_API_URL;

import { NavLink } from 'react-router-dom';
import { PROFILE_ROUTE } from '../utils/consts';
import { useState, useRef, useEffect } from 'react';
import {
  getFollowers,
  followUser,
  unfollowUser,
  getFollowing,
} from '../http/userApi';
import { useNotification } from '../context/NotificationContext';
import { useSelector } from 'react-redux';

import VerifiedIcon from '../assets/Icon/verified.png';
import VerifyAdminIcon from '../assets/Icon/verify-admin.png';

import UserTooltipWrapper from './UserTooltipWrapper';
import UnfollowModel from './UnfollowModel';
import AuthRequiredModel from './AuthRequiredModel';

export default function UserPreview({ user }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthModelOpen, setIsAuthModelOpen] = useState(false);

  const { showNotification } = useNotification();
  const hoverTimer = useRef(null);
  const leaveTimer = useRef(null);

  const isOfficial = user.isOfficial;
  const isAdmin = user.role === 'ADMIN';
  const userId = useSelector((state) => state.auth.user?.id);
  const isAuth = useSelector((state) => state.auth.isAuth);

  const isSelf = user.id === userId;

  useEffect(() => {
    const fetchFollow = async () => {
      try {
        const res = await getFollowing(userId);
        setFollowing(res.data.some((u) => u.id === Number(user.id)));
      } catch (err) {
        showNotification(
          err?.response?.data?.message || 'Error fetching follow'
        );
      }
    };

    if (userId && user.id && user.id !== userId) {
      fetchFollow();
    }
  }, [userId, user.id]);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const followersResponse = await getFollowers(user.id);
        setFollowers(followersResponse.data);
      } catch (err) {
        showNotification(
          err?.response?.data?.message || 'Error fetching followers'
        );
      }
    };
    if (user?.id) {
      fetchFollowers();
    }
  }, [user?.id]);

  const handleFollow = async () => {
    if (!isAuth) {
      setIsAuthModelOpen(true);
      return;
    }

    try {
      const response = await followUser(user.id);
      showNotification(response.data.message);
      setFollowing(true);
    } catch (err) {
      showNotification(err?.response?.data?.message || 'Error fetching posts');
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await unfollowUser(user.id);
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

  const handleMouseEnter = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
    }

    hoverTimer.current = setTimeout(() => {
      setShowTooltip(true);
    }, 600);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
    }

    leaveTimer.current = setTimeout(() => {
      setShowTooltip(false);
    }, 400);
  };

  return (
    <>
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <img
            src={`${BASE_URL}/${user.avatar}`}
            alt='User Avatar'
            className='w-10 h-10 rounded-full'
          />
          <div className='flex flex-col gap-0.5'>
            <div
              className='relative'
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className='flex items-center'>
                <NavLink to={`${PROFILE_ROUTE}/${user.id}`}>
                  <div className='text-white font-medium hover:underline'>
                    {user.login}
                  </div>
                </NavLink>
                <div>
                  {isAdmin ? (
                    <img
                      src={VerifyAdminIcon}
                      alt='verified'
                      className={`inline-block ml-1.5 cursor-none ${
                        isAdmin ? 'w-4 h-4 -mt-1' : isOfficial ? 'w-6 h-6' : ''
                      }`}
                    />
                  ) : isOfficial ? (
                    <img
                      src={VerifiedIcon}
                      alt='verified'
                      className={`inline-block ml-1.5 cursor-none ${
                        isAdmin
                          ? 'w-4 h-4 -mt-0.5'
                          : isOfficial
                          ? 'w-6 h-6'
                          : ''
                      }`}
                    />
                  ) : null}
                </div>
              </div>

              {showTooltip && (
                <div className='absolute top-2 left-0 z-50'>
                  <UserTooltipWrapper
                    userData={user}
                    isVisible={showTooltip}
                    onClose={() => setShowTooltip(false)}
                  />
                </div>
              )}
            </div>
            <h3 className='-mt-1 text-[var(--color-text)]'>{user.fullName}</h3>
          </div>
        </div>

        <button
          onClick={following ? () => setIsOpen(true) : handleFollow}
          className={`px-4 py-1 rounded-lg cursor-pointer border border-[var(--color-border)] 
              ${
                isSelf
                  ? 'hidden'
                  : following
                  ? 'text-white bg-transparent'
                  : 'text-black bg-white'
              }`}
        >
          {following ? 'Відстежується' : 'Стежити'}
        </button>
      </div>
      <div className='ml-14 mb-4'>
        <div className='mt-1 '>
          <span
            className='text-white line-clamp-3'
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {user.biography}
          </span>
        </div>

        <div className='mt-4'>
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

        <hr className='border-[var(--color-border)] mt-4 -mr-8' />
      </div>
      <UnfollowModel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userData={user}
        handleUnfollow={handleUnfollow}
      />
      <AuthRequiredModel
        isOpen={isAuthModelOpen}
        onClose={() => setIsAuthModelOpen(false)}
      />
    </>
  );
}
