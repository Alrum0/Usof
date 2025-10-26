import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';
const BASE_URL = import.meta.env.VITE_API_URL;
import { NavLink } from 'react-router-dom';
import { PROFILE_ROUTE } from '../utils/consts';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import MoreHorizontalIcon from '../assets/Icon/more-horizontal-icon.svg?react';
import VerifiedIcon from '../assets/Icon/verified.png';
import VerifyAdminIcon from '../assets/Icon/verify-admin.png';
import PostSelector from './PostSelector';
import { timeAgo } from '../utils/DateTime';
import { createCommentForPost } from '../http/postApi';
import { getUser } from '../http/userApi';

export default function CreateComment({ isOpen, onClose, post }) {
  const { showNotification } = useNotification();

  const [showTooltip, setShowTooltip] = useState(false);
  const selectorButtonRef = useRef(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [userData, setUserData] = useState(null);
  const isFormValid = commentText.trim().length > 0;

  const id = useSelector((state) => state.auth.user?.id);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const response = await getUser(id);
        setUserData(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [id]);

  const isAdmin = post?.isAuthorAdmin;
  const isOfficial = post?.isAuthorOfficial;

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await createCommentForPost(post.id, commentText.trim());
      showNotification('Коментар додано');
      setCommentText('');
      onClose();
    } catch (err) {
      showNotification(err?.response?.data?.message || 'Error adding comment');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div
          className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--color-notification)] px-6 pt-6 pb-6 rounded-lg flex flex-col items-start shadow-lg w-1/2'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex w-full gap-6'>
            {/* Left column: author avatar and connecting line to comment form */}
            <div className='flex flex-col items-center'>
              {/* Author avatar */}
              <img
                src={`${BASE_URL}/${post?.authorAvatar}`}
                alt='author'
                className='w-12 h-12 rounded-full flex-shrink-0 mb-1'
              />

              {/* Vertical connecting line - flexible */}
              <div className='w-0.5 flex-1 bg-[var(--color-border)]' />
            </div>

            {/* Right column: post and comment form */}
            <div className='flex-1'>
              <div className='flex items-start gap-2 mb-4'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    <NavLink
                      to={`${PROFILE_ROUTE}/${post?.authorId}`}
                      className='text-white font-medium hover:underline'
                      onClick={(e) => e.stopPropagation()}
                    >
                      {post?.authorName}
                    </NavLink>

                    {isAdmin ? (
                      <img
                        src={VerifyAdminIcon}
                        alt='verified'
                        className='w-4 h-4'
                      />
                    ) : isOfficial ? (
                      <img
                        src={VerifiedIcon}
                        alt='verified'
                        className='w-5 h-5'
                      />
                    ) : null}

                    <span className='text-[var(--color-text)] pl-2'>
                      {timeAgo(post?.publishDate)}
                    </span>
                  </div>

                  <h2 className='text-white font-semibold mt-2'>
                    {post?.title}
                  </h2>

                  <p className='text-white text-[15px] mt-2 mb-2'>
                    {post?.content}
                  </p>

                  {post?.images && post.images.length > 0 && (
                    <div className='flex gap-3 mt-2'>
                      {post.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={`${BASE_URL}/${img}`}
                          alt={`img-${idx}`}
                          className={`object-cover rounded-md border border-[var(--color-border)] transition-all duration-500 mb-1 ${
                            post.images.length === 1
                              ? 'max-h-[320px] max-w-full w-auto'
                              : ' h-[160px]'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {post?.location && (
                    <div className='text-[var(--color-text)] mt-2'>
                      {post.location}
                    </div>
                  )}
                </div>

                {/* Selector button */}
                <div className='relative ml-2 mt-2'>
                  <button
                    ref={selectorButtonRef}
                    className='cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditOpen(true);
                    }}
                  >
                    <MoreHorizontalIcon className='w-5 h-5 text-white' />
                  </button>

                  <PostSelector
                    isOpen={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    post={post}
                    anchorRef={selectorButtonRef}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Comment form section */}
          <div className='w-full flex items-start gap-3 mt-1 ml-1'>
            {/* Comment user avatar */}
            <img
              src={userData?.avatar ? `${BASE_URL}/${userData.avatar}` : ''}
              alt='me'
              className='w-10 h-10 rounded-full flex-shrink-0 mt-0.5'
            />

            <div className='flex-1'>
              <div className='text-white font-medium '>{userData?.login}</div>
              <form onSubmit={handleSubmit} className='w-full'>
                <input
                  type='text'
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder='Напишіть коментар...'
                  className='w-full rounded-md px-3 py-2 text-white outline-none bg-[var(--color-input)] -mt-2 -ml-3 text-[15px]'
                />
                <div className='flex justify-between mt-4 items-center'>
                  <span className='text-[var(--color-text)] text-sm'>
                    Будь-хто може відповідати й цитувати
                  </span>
                  <button
                    onClick={handleSubmit}
                    className={`bg-[var(--color-accent)] px-4 py-2 rounded-lg font-semibold border ${
                      isFormValid
                        ? 'text-white border-[var(--color-border)] cursor-pointer'
                        : 'border-[var(--color-border)] text-[var(--color-text)]'
                    }`}
                    disabled={!isFormValid}
                  >
                    Опублікувати
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
