const BASE_URL = import.meta.env.VITE_API_URL;

import { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';

import { timeAgo } from '../utils/DateTime';
import { PROFILE_ROUTE } from '../utils/consts';
import UserTooltipWrapper from './UserTooltipWrapper';

import MoreHorizontalIcon from '../assets/Icon/more-horizontal-icon.svg?react';
import VerifiedIcon from '../assets/Icon/verified.png';
import VerifyAdminIcon from '../assets/Icon/verify-admin.png';
import LikeIcon from '../assets/Icon/like-icon.svg?react';

import EditCommentModal from './EditCommentModal';
import CommentSelector from './CommentSelector';

export default function CommentPreview({ comment }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [clickedLike, setClickedLike] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const selectorButtonRef = useRef(null);

  const isOfficial = comment.isOfficial;
  const isAdmin = comment.role === 'ADMIN';
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

  const handleLikeClick = async (e) => {
    setClickedLike(!clickedLike);
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
      <div className='mt-2 ml-10'>
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
          <span>{clickedLike ? 1 : 0}</span>
        </button>
      </div>

      <hr className='border-[var(--color-border)] -mx-8 mt-2 mb-4' />
      {isEditOpen && (
        <EditCommentModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          comment={comment}
        />
      )}
    </>
  );
}
