const BASE_URL = import.meta.env.VITE_API_URL;

import MoreHorizontalIcon from '../assets/Icon/more-horizontal-icon.svg?react';
import LikeIcon from '../assets/Icon/like-icon.svg?react';
import MessageIcon from '../assets/Icon/message-icon.svg?react';
import RepostIcon from '../assets/Icon/repost-icon.svg?react';
import UserTooltipWrapper from './UserTooltipWrapper';

import VerifiedIcon from '../assets/Icon/verified.png';
import VerifyAdminIcon from '../assets/Icon/verify-admin.png';

import { timeAgo } from '../utils/DateTime';
import { useState, useRef, useEffect } from 'react';
import { PROFILE_ROUTE } from '../utils/consts';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { POST_ROUTE } from '../utils/consts';
import {
  createLike,
  deleteLike,
  getAllCommentsForPost,
  getLikeStatus,
} from '../http/postApi';
import { useNotification } from '../context/NotificationContext';

export default function PostModel({ post }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const { showNotification } = useNotification();
  const isAdmin = useSelector((state) => state.auth.user?.role === 'ADMIN');
  const isOfficial = useSelector((state) => state.auth.user?.isOfficial);
  const currentUserId = useSelector((state) => state.auth.user?.id);

  const [likesCount, setLikesCount] = useState(post?.likes_count || 0);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(
    !!post?.liked_by_current_user
  );
  const [commentCount, setCommentCount] = useState(0);
  const hoverTimer = useRef(null);
  const leaveTimer = useRef(null);

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

  const images = post?.images
    ? post.images.filter(Boolean).map((img, index) => ({
        id: index,
        preview: `${BASE_URL}/${img}`,
      }))
    : [];

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!post?.id) return;

    if (!currentUserId) {
      showNotification('Please log in to like posts');
      return;
    }

    try {
      if (!likedByCurrentUser) {
        const response = await createLike(post.id);
        setLikesCount(
          response?.data?.likes_count || response?.data?.count || likesCount + 1
        );
        setLikedByCurrentUser(true);
      } else {
        const response = await deleteLike(post.id);
        setLikesCount(
          response?.data?.likes_count ||
            response?.data?.count ||
            Math.max(0, likesCount - 1)
        );
        setLikedByCurrentUser(false);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      showNotification(err?.response?.data?.message || 'Error toggling like');
    }
  };

  const handlePostClick = () => {
    window.location.href = `${POST_ROUTE}/${post.id}`;
  };

  useEffect(() => {
    if (!post?.id) return;

    const fetchCommentCount = async () => {
      try {
        const response = await getAllCommentsForPost(post.id);
        const count = Array.isArray(response?.data)
          ? response.data.length
          : response?.data?.count || 0;
        setCommentCount(count);
      } catch (error) {
        showNotification(
          error?.response?.data?.message || 'Error fetching comment count'
        );
      }
    };

    fetchCommentCount();
  }, [post?.id]);

  useEffect(() => {
    if (!post?.id) return;

    const fetchLikeStatus = async () => {
      try {
        const response = await getLikeStatus(post.id);
        setLikedByCurrentUser(!!response?.data?.liked);
      } catch (error) {
        showNotification(
          error?.response?.data?.message || 'Error fetching like status'
        );
      }
    };

    fetchLikeStatus();
  }, [post?.id]);

  return (
    <div className=' mt-5 cursor-pointer' onClick={handlePostClick}>
      <div className='flex justify-between '>
        <div className='flex items-center '>
          <img
            src={`${BASE_URL}/${post?.authorAvatar}`}
            alt='Logo'
            className='w-10 h-10 rounded-full flex-shrink-0'
          />
          <div
            className='relative'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <NavLink
              to={`${PROFILE_ROUTE}/${post?.authorId}`}
              className='text-white font-medium pl-3 hover:underline'
              onClick={(e) => e.stopPropagation()}
            >
              {post?.authorName}
            </NavLink>

            {showTooltip && (
              <div className='absolute top-6 left-0 z-50'>
                <UserTooltipWrapper
                  userData={post}
                  isVisible={showTooltip}
                  onClose={() => setShowTooltip(false)}
                />
              </div>
            )}
          </div>
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
                  isAdmin ? 'w-4 h-4 -mt-0.5' : isOfficial ? 'w-6 h-6' : ''
                }`}
              />
            ) : null}
          </div>

          <span className='text-[var(--color-text)] pl-2'>
            {timeAgo(post?.publishDate)}
          </span>
        </div>
        <button className='cursor-pointer'>
          <MoreHorizontalIcon className='w-5 h-5' />
        </button>
      </div>

      <div className='ml-13'>
        <div className='-mt-1'>
          <h2 className='text-white font-semibold'>{post?.title}</h2>
          <p className='text-white text-[15px] mt-2 mb-1'>{post?.content}</p>
        </div>

        {images.length > 0 && (
          <div
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'transparent',
            }}
            className={`flex justify-start gap-3 overflow-x-auto scrollbar-thin scrollbar-gray-600 ${
              images.length === 1 ? 'justify-center' : ''
            }`}
          >
            {images.map((img, index) => (
              <div
                key={index}
                className={`relative flex-shrink-0 ${
                  images.length === 1 ? 'max-w-full' : ''
                }`}
              >
                <img
                  src={img.preview}
                  alt={`preview-${index}`}
                  className={`object-cover rounded-md border border-[var(--color-border)] transition-all duration-500 mb-1 ${
                    images.length === 1
                      ? 'max-h-[320px] max-w-full w-auto'
                      : ' h-[160px]'
                  }`}
                />
              </div>
            ))}
          </div>
        )}
        <div>
          <span className='text-[var(--color-text)] text-[13px]'>
            Warsaw, Poland
          </span>
        </div>

        <div className='flex -ml-3.5 mt-1'>
          <button
            className={`text-[var(--color-text)] items-center flex gap-2 px-3 py-2 hover:bg-[#1e1e1e] rounded-3xl cursor-pointer active:scale-95 transition-transform duration-150 ${
              likedByCurrentUser ? 'text-red-600' : ''
            }`}
            onClick={handleLikeClick}
          >
            <LikeIcon
              className={`w-5.5 h-5.5 inline-block ${
                likedByCurrentUser ? 'fill-red-600' : ''
              }`}
            />
            <span>{likesCount}</span>
          </button>
          <button className='text-[var(--color-text)] items-center flex gap-1 cursor-pointer px-3 py-2 hover:bg-[#1e1e1e] rounded-3xl active:scale-95 transition-transform duration-150'>
            <MessageIcon className='w-5.5 h-5.5 inline-block' />
            <span>{commentCount}</span>
          </button>
          <button className='px-3 py-2 hover:bg-[#1e1e1e] rounded-3xl cursor-pointer active:scale-95 transition-transform duration-150'>
            <RepostIcon className='w-5.5 h-5.5 inline-block rotate-90' />
          </button>
        </div>
      </div>
      <hr className='border-[var(--color-border)] -mx-8 mt-2' />
    </div>
  );
}
