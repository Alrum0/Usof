import { motion, AnimatePresence } from 'framer-motion';
import { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import TrashIcon from '../assets/Icon/trash-icon.svg?react';
import EditRectangleIcon from '../assets/Icon/edit-rectangle-icon.svg?react';

import { deletePostById } from '../http/postApi';
import { useNotification } from '../context/NotificationContext';

// Edit modal is controlled by parent (PostModel)

export default function PostSelector({
  isOpen,
  onClose,
  post,
  anchorRef,
  onOpenEdit,
}) {
  const menuRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const menuWidth = 224;
  const { showNotification } = useNotification();

  useLayoutEffect(() => {
    if (!isOpen || !anchorRef?.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const top = rect.bottom + window.scrollY + 8;
    const left = rect.right + window.scrollX - menuWidth;
    setPos({ top, left });
  }, [isOpen, anchorRef]);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const onMouseDown = (e) => {
      const menuEl = menuRef.current;
      if (menuEl && menuEl.contains(e.target)) return;
      if (anchorRef?.current && anchorRef.current.contains(e.target)) return;
      onClose();
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [isOpen, onClose, anchorRef]);

  const handleDelete = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      await deletePostById(post.id);
      onClose();
      try {
        const currentPath = window.location.pathname || '';
        if (currentPath.includes(`/post/${post.id}`)) {
          window.location.href = '/';
        } else {
          window.location.reload();
        }
      } catch (err) {
        window.location.reload();
      }
    } catch (error) {
      showNotification(
        error?.response?.data?.message || 'Сталася помилка при видаленні поста.'
      );
    }
  };

  if (!isOpen) return null;

  const menu = (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'absolute',
          top: `${pos.top}px`,
          left: `${pos.left}px`,
          width: `${menuWidth}px`,
          zIndex: 9999,
        }}
        className='bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl shadow-lg'
      >
        <ul className='flex flex-col py-2 px-2'>
          <li
            onClick={(e) => {
              e.stopPropagation();
              if (typeof onOpenEdit === 'function') onOpenEdit();
              onClose();
            }}
            className='px-4 py-2 text-white hover:bg-[#2f2f2f] hover:rounded-lg cursor-pointer font-light flex items-center gap-1 justify-center'
          >
            <EditRectangleIcon className='w-6 h-6' />
            <span>Редагувати</span>
          </li>
          <li
            onClick={handleDelete}
            className='px-4 py-2 hover:bg-[#2f2f2f] hover:rounded-lg cursor-pointer font-medium text-red-600 flex items-center gap-1 justify-center'
          >
            <TrashIcon className='w-6 h-6' />
            <span>Видалити</span>
          </li>
        </ul>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(menu, document.body);
}
