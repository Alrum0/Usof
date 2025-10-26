const BASE_URL = import.meta.env.VITE_API_URL;

import MoreHorizontalIcon from '../assets/Icon/more-horizontal-icon.svg?react';
import LikeIcon from '../assets/Icon/like-icon.svg?react';
import MessageIcon from '../assets/Icon/message-icon.svg?react';
import RepostIcon from '../assets/Icon/repost-icon.svg?react';
import UserTooltipWrapper from './UserTooltipWrapper';
import AnimatedStar from '../components/AnimatedStar/AnimatedStar';
import PostSelector from './PostSelector';
import EditPostModal from './EditPostModal';
import CreateComment from './CreateComment';
import AuthRequiredModel from './AuthRequiredModel';

import VerifiedIcon from '../assets/Icon/verified.png';
import VerifyAdminIcon from '../assets/Icon/verify-admin.png';

import { timeAgo } from '../utils/DateTime';
import { motion, AnimatePresence } from 'framer-motion';
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
  createRepost,
  deleteRepost,
  getRepostStatus,
} from '../http/postApi';
import { useNotification } from '../context/NotificationContext';

export default function PostModel({ post }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likes_count || 0);
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(
    !!post?.liked_by_current_user
  );
  const [commentCount, setCommentCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const hoverTimer = useRef(null);
  const leaveTimer = useRef(null);
  const selectorButtonRef = useRef(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOpenComments, setIsOpenComments] = useState(false);
  const [isAuthModelOpen, setIsAuthModelOpen] = useState(false);
  const [repostedByCurrentUser, setRepostedByCurrentUser] = useState(false);
  const [repostsCount, setRepostsCount] = useState(post?.repostsCount || 0);

  const { showNotification } = useNotification();

  const currentUserId = useSelector((state) => state.auth.user?.id);
  const isAuth = useSelector((state) => state.auth.isAuth);

  const isAdmin = post?.authorRole === 'ADMIN';
  const isOfficial = post?.authorIsOfficial;

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
      showNotification('Будь ласка, увійдіть, щоб ставити вподобання');
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
  }, [post?.id, showNotification]);

  useEffect(() => {
    if (!post?.id || !currentUserId) return;

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
  }, [post?.id, currentUserId, showNotification]);

  useEffect(() => {
    if (!post?.id || !currentUserId) return;

    const fetchRepostStatus = async () => {
      try {
        const response = await getRepostStatus(post.id);
        setRepostedByCurrentUser(!!response?.data?.reposted);
      } catch (error) {
        showNotification(
          error?.response?.data?.message || 'Error fetching repost status'
        );
      }
    };

    fetchRepostStatus();
  }, [post?.id, currentUserId, showNotification]);

  const handleRepostClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!post?.id) return;

    if (!currentUserId) {
      showNotification('Будь ласка, увійдіть, щоб зробити репост');
      return;
    }

    try {
      if (!repostedByCurrentUser) {
        await createRepost(post.id);
        setRepostedByCurrentUser(true);
        setRepostsCount((prev) => prev + 1);
        showNotification('Репост створено');
      } else {
        await deleteRepost(post.id);
        setRepostedByCurrentUser(false);
        setRepostsCount((prev) => Math.max(0, prev - 1));
        showNotification('Репост видалено');
      }
    } catch (err) {
      console.error('Error toggling repost:', err);
      showNotification(err?.response?.data?.message || 'Error toggling repost');
    }
  };

  return (
    <>
      <div
        className={`mt-5 cursor-pointer ${
          selectedImage ? 'pointer-events-none' : ''
        }`}
        onClick={handlePostClick}
      >
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
                {post?.authorLogin}
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
                  className={`inline-block cursor-none ${
                    isAdmin
                      ? 'w-4 h-4 -mt-0.5 ml-1.5'
                      : isOfficial
                      ? 'w-6 h-6'
                      : ''
                  }`}
                />
              ) : null}
            </div>

            <span className='text-[var(--color-text)] pl-2'>
              {timeAgo(post?.publishDate)}
            </span>
          </div>
          <div className='relative'>
            <button
              ref={selectorButtonRef}
              className='cursor-pointer'
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
            >
              <MoreHorizontalIcon className='w-5 h-5' />
            </button>
            <PostSelector
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              post={post}
              anchorRef={selectorButtonRef}
              onOpenEdit={() => setIsEditOpen(true)}
            />
          </div>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(img.preview);
                  }}
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
              {post?.location}
            </span>
          </div>

          <div className='flex -ml-3.5 mt-1 items-center'>
            <AnimatedStar onClick={(e) => e.stopPropagation()} post={post} />
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
            <button
              className='text-[var(--color-text)] items-center flex gap-1 cursor-pointer px-3 py-2 hover:bg-[#1e1e1e] rounded-3xl active:scale-95 transition-transform duration-150'
              onClick={(e) => {
                e.stopPropagation();
                if (!isAuth) {
                  setIsAuthModelOpen(true);
                  return;
                }
                setIsOpenComments((prev) => !prev);
              }}
            >
              <MessageIcon className='w-5.5 h-5.5 inline-block' />
              <span>{commentCount}</span>
            </button>
            <button
              className={`text-[var(--color-text)] items-center flex gap-1 cursor-pointer px-3 py-2 hover:bg-[#1e1e1e] rounded-3xl active:scale-95 transition-transform duration-150 ${
                repostedByCurrentUser ? 'text-[var(--color-text)]' : ''
              }`}
              onClick={handleRepostClick}
            >
              <RepostIcon
                className={`w-5.5 h-5.5 inline-block rotate-90 ${
                  repostedByCurrentUser ? 'fill-green-600' : ''
                }`}
              />
              <span>{repostsCount}</span>
            </button>
          </div>
        </div>
        <hr className='border-[var(--color-border)] -mx-8 mt-2' />
      </div>
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              src={selectedImage}
              alt='Full view'
              className='max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg cursor-zoom-out'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {isEditOpen && (
        <EditPostModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          postId={post?.id}
        />
      )}
      <CreateComment
        post={post}
        onClose={() => setIsOpenComments(false)}
        isOpen={isOpenComments}
      />
      <AuthRequiredModel
        isOpen={isAuthModelOpen}
        onClose={() => setIsAuthModelOpen(false)}
      />
    </>
  );
}
