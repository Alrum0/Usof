import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { PROFILE_ROUTE } from '../utils/consts';
import { timeAgo } from '../utils/DateTime';
import VerifiedIcon from '../assets/Icon/verified.png';
import VerifyAdminIcon from '../assets/Icon/verify-admin.png';
import CreateReply from './CreateReply';
import EditCommentModal from './EditModel';
import {
  MessageCircle,
  MoreVertical,
  Pencil,
  Trash2,
  Heart,
} from 'lucide-react';
import {
  deleteComment,
  getRepliesForComment,
  createCommentLike,
  deleteCommentLike,
  getCommentLikes,
  getCommentLikeStatus,
} from '../http/postApi';
import { useSelector } from 'react-redux';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function ReplyItem({ reply, postId, onDelete, level = 0, isLast = false }) {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState(reply.replies || []);
  const [repliesCount, setRepliesCount] = useState(reply.repliesCount || 0);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const { user } = useSelector((state) => state.auth);
  const isOwner = user?.id === reply.authorId;
  const isAdmin = user?.role === 'ADMIN';
  const canManage = isOwner || isAdmin;

  const handleDelete = async () => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей коментар?')) {
      return;
    }

    try {
      await deleteComment(reply.id);
      if (onDelete) onDelete(reply.id);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleReplyClick = () => {
    setIsReplyOpen(true);
  };

  const fetchReplies = async () => {
    try {
      const response = await getRepliesForComment(reply.id);
      const repliesData = response.data || response;
      console.log('Fetched replies for comment', reply.id, ':', repliesData);
      setReplies(Array.isArray(repliesData) ? repliesData : []);
    } catch (error) {
      console.error('Failed to fetch replies:', error);
    }
  };

  const toggleReplies = () => {
    if (!showReplies) {
      fetchReplies();
    }
    setShowReplies(!showReplies);
  };

  const handleReplyAdded = () => {
    fetchReplies();
    setShowReplies(true);
    setRepliesCount((prev) => prev + 1);
  };

  const handleReplyDeleted = (deletedId) => {
    setReplies((prev) => prev.filter((r) => r.id !== deletedId));
    setRepliesCount((prev) => Math.max(0, prev - 1));
  };

  const handleLikeClick = async () => {
    try {
      if (liked) {
        await deleteCommentLike(reply.id);
        setLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        await createCommentLike(reply.id);
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const fetchLikes = async () => {
    try {
      // Fetch likes count
      const likesResponse = await getCommentLikes(reply.id);
      const likes = likesResponse.data;
      setLikesCount(likes.count || 0);

      // Fetch like status for current user
      if (user?.id) {
        const statusResponse = await getCommentLikeStatus(reply.id);
        setLiked(statusResponse.data.liked || false);
      }
    } catch (error) {
      console.error('Failed to fetch likes:', error);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [reply.id]);

  return (
    <div className='flex gap-3 '>
      <div className='flex flex-col items-center'>
        <div className='w-0.5 h-4 bg-[var(--color-border)]' />
        <img
          src={`${BASE_URL}/${reply.avatar}`}
          alt='Reply author'
          className='w-10 h-10 rounded-full flex-shrink-0'
        />
        {(!isLast || showReplies) && (
          <div className='w-0.5 flex-1 bg-[var(--color-border)] min-h-[20px]' />
        )}
      </div>
      <div className='flex-1 pt-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <NavLink
              to={`${PROFILE_ROUTE}/${reply.authorId}`}
              className='text-white font-medium hover:underline'
            >
              {reply.login}
            </NavLink>
            {reply.role === 'ADMIN' ? (
              <img src={VerifyAdminIcon} alt='verified' className='w-4 h-4' />
            ) : reply.isOfficial ? (
              <img src={VerifiedIcon} alt='verified' className='w-5 h-5' />
            ) : null}
            <span className='text-[var(--color-text)] text-sm'>
              {timeAgo(reply.publishDate)}
            </span>
          </div>

          <div className='relative'>
            {canManage && (
              <>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className='p-1 hover:bg-[var(--color-border)] rounded-full transition-colors'
                >
                  <MoreVertical
                    size={16}
                    className='text-[var(--color-text)]'
                  />
                </button>

                {showMenu && (
                  <div className='absolute right-0 mt-2 w-48 bg-[var(--background-secondary)] border border-[var(--color-border)] rounded-lg shadow-lg z-10'>
                    {isOwner && (
                      <button
                        onClick={() => {
                          setIsEditOpen(true);
                          setShowMenu(false);
                        }}
                        className='w-full px-4 py-2 text-left text-white hover:bg-[var(--color-border)] flex items-center gap-2 transition-colors'
                      >
                        <Pencil size={16} />
                        Редагувати
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleDelete();
                        setShowMenu(false);
                      }}
                      className='w-full px-4 py-2 text-left text-red-500 hover:bg-[var(--color-border)] flex items-center gap-2 transition-colors'
                    >
                      <Trash2 size={16} />
                      Видалити
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {reply.parentAuthorLogin && (
          <div className='text-[var(--color-text)] text-sm mb-1'>
            Відповідь до{' '}
            <span className='text-blue-400'>@{reply.parentAuthorLogin}</span>
          </div>
        )}

        <p className='text-white mb-2'>{reply.content}</p>

        <div className='flex gap-4 text-[var(--color-text)]'>
          <button
            onClick={handleLikeClick}
            className={`flex items-center gap-1 transition-colors ${
              liked ? 'text-red-500 hover:text-red-600' : 'hover:text-red-400'
            }`}
          >
            <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            <span className='text-sm'>{likesCount}</span>
          </button>

          <button
            onClick={handleReplyClick}
            className='flex items-center gap-1 hover:text-blue-400 transition-colors'
          >
            <MessageCircle size={16} />
            <span className='text-sm'>Відповісти</span>
          </button>

          {repliesCount > 0 && (
            <button
              onClick={toggleReplies}
              className='text-sm hover:text-blue-400 transition-colors'
            >
              {showReplies
                ? 'Сховати відповіді'
                : `Показати відповіді (${repliesCount})`}
            </button>
          )}
        </div>

        {/* Nested replies */}
        {showReplies && replies.length > 0 && (
          <div className='ml-0 mt-2'>
            {replies.map((nestedReply, index) => (
              <ReplyItem
                key={nestedReply.id}
                reply={nestedReply}
                postId={postId}
                onDelete={handleReplyDeleted}
                level={level + 1}
                isLast={index === replies.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      {isEditOpen && (
        <EditCommentModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          comment={reply}
        />
      )}
      {isReplyOpen && (
        <CreateReply
          isOpen={isReplyOpen}
          onClose={() => setIsReplyOpen(false)}
          comment={reply}
          postId={postId}
          onReplyAdded={handleReplyAdded}
        />
      )}
    </div>
  );
}

export default ReplyItem;
