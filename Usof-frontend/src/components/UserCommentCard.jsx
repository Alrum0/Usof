const BASE_URL = import.meta.env.VITE_API_URL;

import { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { timeAgo } from '../utils/DateTime';
import { PROFILE_ROUTE, POST_ROUTE } from '../utils/consts';

import VerifiedIcon from '../assets/Icon/verified.png';
import VerifyAdminIcon from '../assets/Icon/verify-admin.png';

export default function UserCommentCard({ comment }) {
  const navigate = useNavigate();
  const isOfficial = comment.isOfficial;
  const isAdmin = comment.role === 'ADMIN';

  const handlePostClick = () => {
    navigate(`${POST_ROUTE}/${comment.postId}`);
  };

  return (
    <div className='mt-5 cursor-pointer' onClick={handlePostClick}>
      <div className='flex items-center'>
        <img
          src={`${BASE_URL}/${comment.avatar}`}
          alt='Logo'
          className='w-10 h-10 rounded-full flex-shrink-0'
        />
        <div>
          <NavLink
            to={`${PROFILE_ROUTE}/${comment.authorId}`}
            className='text-white font-medium pl-3 hover:underline'
            onClick={(e) => e.stopPropagation()}
          >
            {comment.login}
          </NavLink>
          {isAdmin ? (
            <img
              src={VerifyAdminIcon}
              alt='verified'
              className='inline-block ml-1.5 w-4 h-4 -mt-1'
            />
          ) : isOfficial ? (
            <img
              src={VerifiedIcon}
              alt='verified'
              className='inline-block ml-1.5 w-6 h-6'
            />
          ) : null}
        </div>
        <span className='text-[var(--color-text)] pl-2'>
          {timeAgo(comment?.publishDate)}
        </span>
      </div>

      <div className='ml-13 -mt-1'>
        <div className='text-[var(--color-text)] text-sm mb-1'>
          Відповідь до{' '}
          <NavLink
            to={`${PROFILE_ROUTE}/${comment.postAuthorId}`}
            className='text-blue-400 hover:underline'
            onClick={(e) => e.stopPropagation()}
          >
            @{comment.postAuthorLogin}
          </NavLink>
        </div>
        <p className='text-white mb-2'>{comment.content}</p>

        {/* Post preview */}
        <div className='bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg p-3 mt-2'>
          <div className='flex items-center mb-2'>
            <img
              src={`${BASE_URL}/${comment.postAuthorAvatar}`}
              alt='Post author'
              className='w-6 h-6 rounded-full flex-shrink-0'
            />
            <span className='text-white text-sm ml-2 font-medium'>
              {comment.postAuthorLogin}
            </span>
          </div>
          <h3 className='text-white font-semibold text-sm mb-1'>
            {comment.postTitle}
          </h3>
          <p className='text-[var(--color-text)] text-sm line-clamp-2'>
            {comment.postContent}
          </p>
        </div>
      </div>

      <hr className='border-[var(--color-border)] mt-4' />
    </div>
  );
}
