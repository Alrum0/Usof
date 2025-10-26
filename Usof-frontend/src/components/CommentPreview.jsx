const BASE_URL = import.meta.env.VITE_API_URL;

import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { timeAgo } from '../utils/DateTime';
import { PROFILE_ROUTE } from '../utils/consts';
import UserTooltipWrapper from './UserTooltipWrapper';
import { useSelector } from 'react-redux';

import MoreHorizontalIcon from '../assets/Icon/more-horizontal-icon.svg?react';
import VerifiedIcon from '../assets/Icon/verified.png';
import VerifyAdminIcon from '../assets/Icon/verify-admin.png';
import LikeIcon from '../assets/Icon/like-icon.svg?react';
import ReplyIcon from '../assets/Icon/message-icon.svg?react';

import EditCommentModal from './EditCommentModal';
import CommentSelector from './CommentSelector';
import CreateReply from './CreateReply';
import ReplyItem from './ReplyItem';
import {
  getRepliesForComment,
  createCommentLike,
  deleteCommentLike,
  getCommentLikes,
  getCommentLikeStatus,
} from '../http/postApi';

export default function CommentPreview({ comment, postId }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [clickedLike, setClickedLike] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [repliesCount, setRepliesCount] = useState(comment.repliesCount || 0);
  const selectorButtonRef = useRef(null);

  const isOfficial = comment.isOfficial;
  const isAdmin = comment.role === 'ADMIN';
  const hoverTimer = useRef(null);
  const leaveTimer = useRef(null);
  const userId = useSelector((state) => state.auth.user?.id);

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

  const handleLikeClick = async (e) => {
    try {
      if (clickedLike) {
        await deleteCommentLike(comment.id);
        setClickedLike(false);
        setLikesCount((prev) => Math.max(0, prev - 1));
      } else {
        await createCommentLike(comment.id);
        setClickedLike(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const fetchLikes = async () => {
    try {
      // Fetch likes count
      const likesResponse = await getCommentLikes(comment.id);
      const likes = likesResponse.data;
      setLikesCount(likes.count || 0);

      // Fetch like status for current user
      if (userId) {
        const statusResponse = await getCommentLikeStatus(comment.id);
        setClickedLike(statusResponse.data.liked || false);
      }
    } catch (err) {
      console.error('Error fetching likes:', err);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, [comment.id]);

  const fetchReplies = async () => {
    try {
      const response = await getRepliesForComment(comment.id);
      const repliesData = response.data || response;
      console.log('Fetched replies for comment', comment.id, ':', repliesData);
      setReplies(Array.isArray(repliesData) ? repliesData : []);
    } catch (err) {
      console.error('Error fetching replies:', err);
    }
  };

  useEffect(() => {
    if (showReplies && replies.length === 0) {
      fetchReplies();
    }
  }, [showReplies]);

  const handleReplyClick = () => {
    setIsReplyOpen(true);
  };

  const toggleReplies = () => {
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

  return (
    <>
      <div className='flex justify-between '>
        <div className='flex items-center '>
          <img
            src={`${BASE_URL}/${comment.avatar}`}
            alt='Logo'
            className='w-10 h-10 rounded-full flex-shrink-0'
          />
          <div
            className='relative'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <NavLink
              to={`${PROFILE_ROUTE}/${comment?.authorId}`}
              className='text-white font-medium pl-3 hover:underline'
            >
              {comment.login}
            </NavLink>

            {showTooltip && (
              <div className='absolute top-6 left-0 z-50'>
                <UserTooltipWrapper
                  userData={comment}
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
            {timeAgo(comment?.publishDate)}
          </span>
        </div>
        <div className='relative'>
          <button
            ref={selectorButtonRef}
            className='cursor-pointer'
            onClick={(e) => {
              e.stopPropagation();
              setIsSelectorOpen(!isSelectorOpen);
            }}
          >
            <MoreHorizontalIcon className='w-5 h-5' />
          </button>
          <CommentSelector
            isOpen={isSelectorOpen}
            onClose={() => setIsSelectorOpen(false)}
            comment={comment}
            anchorRef={selectorButtonRef}
            onOpenEdit={() => {
              setIsEditOpen(true);
              setIsSelectorOpen(false);
            }}
          />
        </div>
      </div>
      <div className='ml-13'>
        <p className='text-white'>{comment.content}</p>
      </div>
      <div className='mt-2 ml-10 flex gap-2'>
        <button
          className={`text-[var(--color-text)] items-center flex gap-2 px-3 py-2 hover:bg-[#1e1e1e] rounded-3xl cursor-pointer ${
            clickedLike ? 'text-red-600' : ''
          }`}
          onClick={handleLikeClick}
        >
          <LikeIcon
            className={`w-5.5 h-5.5 inline-block ${
              clickedLike ? 'fill-red-600' : ''
            }`}
          />
          <span>{likesCount}</span>
        </button>

        <button
          className='text-[var(--color-text)] items-center flex gap-2 px-3 py-2 hover:bg-[#1e1e1e] rounded-3xl cursor-pointer'
          onClick={handleReplyClick}
        >
          <ReplyIcon className='w-5.5 h-5.5 inline-block' />
        </button>

        {repliesCount > 0 && (
          <button
            className='text-blue-400 items-center flex gap-2 px-3 py-2 hover:bg-[#1e1e1e] rounded-3xl cursor-pointer text-sm'
            onClick={toggleReplies}
          >
            {showReplies
              ? 'Приховати відповіді'
              : `Показати відповіді (${repliesCount})`}
          </button>
        )}
      </div>

      {/* Replies section */}
      {showReplies && replies.length > 0 && (
        <div className='ml-6 mt-4'>
          {replies.map((reply, index) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              postId={postId}
              onDelete={handleReplyDeleted}
              isLast={index === replies.length - 1}
            />
          ))}
        </div>
      )}

      <hr className='border-[var(--color-border)] -mx-8 mt-2 mb-4' />
      {isEditOpen && (
        <EditCommentModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          comment={comment}
        />
      )}
      {isReplyOpen && (
        <CreateReply
          isOpen={isReplyOpen}
          onClose={() => setIsReplyOpen(false)}
          comment={comment}
          postId={postId}
          onReplyAdded={handleReplyAdded}
        />
      )}
    </>
  );
}
