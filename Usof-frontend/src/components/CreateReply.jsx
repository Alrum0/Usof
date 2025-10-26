import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';
const BASE_URL = import.meta.env.VITE_API_URL;
import { NavLink } from 'react-router-dom';
import { PROFILE_ROUTE } from '../utils/consts';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import VerifiedIcon from '../assets/Icon/verified.png';
import VerifyAdminIcon from '../assets/Icon/verify-admin.png';
import { timeAgo } from '../utils/DateTime';
import { createCommentForPost } from '../http/postApi';
import { getUser } from '../http/userApi';

export default function CreateReply({
  isOpen,
  onClose,
  comment,
  postId,
  onReplyAdded,
}) {
  const { showNotification } = useNotification();

  const [replyText, setReplyText] = useState('');
  const [userData, setUserData] = useState(null);
  const isFormValid = replyText.trim().length > 0;

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

  const isAdmin = comment?.role === 'ADMIN';
  const isOfficial = comment?.isOfficial;

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      await createCommentForPost(postId, replyText.trim(), comment.id);
      showNotification('Відповідь додано');
      setReplyText('');
      onClose();
      if (onReplyAdded) onReplyAdded();
    } catch (err) {
      showNotification(err?.response?.data?.message || 'Error adding reply');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div
          className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--color-notification)] px-4 md:px-6 pt-4 md:pt-6 pb-4 md:pb-6 rounded-lg flex flex-col items-start shadow-lg w-full max-w-[95%] md:max-w-[50%] max-h-[90vh] overflow-y-auto'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex w-full gap-3 md:gap-4'>
            <div className='flex flex-col items-center'>
              <img
                src={`${BASE_URL}/${comment?.avatar}`}
                alt='author'
                className='w-10 h-10 md:w-12 md:h-12 rounded-full flex-shrink-0 mb-1'
              />
              <div className='w-0.5 flex-1 bg-[var(--color-border)]' />
            </div>

            <div className='flex-1 min-w-0'>
              <div className='flex items-start gap-2 mb-4'>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <NavLink
                      to={`${PROFILE_ROUTE}/${comment?.authorId}`}
                      className='text-white text-sm md:text-base font-medium hover:underline truncate'
                      onClick={(e) => e.stopPropagation()}
                    >
                      {comment?.login}
                    </NavLink>

                    {isAdmin ? (
                      <img
                        src={VerifyAdminIcon}
                        alt='verified'
                        className='w-3 h-3 md:w-4 md:h-4 flex-shrink-0'
                      />
                    ) : isOfficial ? (
                      <img
                        src={VerifiedIcon}
                        alt='verified'
                        className='w-4 h-4 md:w-5 md:h-5 flex-shrink-0'
                      />
                    ) : null}

                    <span className='text-[var(--color-text)] text-xs md:text-sm'>
                      {timeAgo(comment?.publishDate)}
                    </span>
                  </div>

                  <p className='text-white text-sm md:text-[15px] mt-2 mb-2 break-words'>
                    {comment?.content}
                  </p>

                  <div className='text-[var(--color-text)] text-xs md:text-sm mt-2'>
                    Відповідь до{' '}
                    <span className='text-blue-400'>@{comment?.login}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reply form section */}
          <div className='w-full flex items-start gap-2 md:gap-3 mt-1 ml-1'>
            <img
              src={userData?.avatar ? `${BASE_URL}/${userData.avatar}` : ''}
              alt='me'
              className='w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 mt-0.5'
            />

            <div className='flex-1 min-w-0'>
              <div className='text-white font-medium text-sm md:text-base truncate'>
                {userData?.login}
              </div>
              <form onSubmit={handleSubmit} className='w-full'>
                <input
                  type='text'
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder='Напишіть відповідь...'
                  className='w-full rounded-md px-2 md:px-3 py-1.5 md:py-2 text-white outline-none bg-[var(--color-input)] -mt-2 -ml-2 md:-ml-3 text-sm md:text-[15px]'
                  autoFocus
                />
                <div className='flex flex-col md:flex-row justify-between mt-3 md:mt-4 gap-3 md:gap-0 items-start md:items-center'>
                  <span className='text-[var(--color-text)] text-xs md:text-sm'>
                    Будь-хто може відповідати й цитувати
                  </span>
                  <button
                    type='submit'
                    className={`bg-[var(--color-accent)] px-4 py-2 rounded-lg font-semibold border text-sm md:text-base w-full md:w-auto ${
                      isFormValid
                        ? 'text-white border-[var(--color-border)] cursor-pointer'
                        : 'border-[var(--color-border)] text-[var(--color-text)]'
                    }`}
                    disabled={!isFormValid}
                  >
                    Відповісти
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
