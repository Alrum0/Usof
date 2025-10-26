import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNotification } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

import CustomInput from './CustomInput';
import EmojiIcon from '../assets/Icon/emoji-smile-icon.svg?react';
import Picker from 'emoji-picker-react';

import { updateCommentById, deleteCommentById } from '../http/postApi';

const BASE_URL = import.meta.env.VITE_API_URL;

export default function EditCommentModal({ isOpen, onClose, comment }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [userData, setUserData] = useState(null);

  const { showNotification } = useNotification();
  const userId = useSelector((state) => state.auth.user?.id);
  const pickerRef = useRef();

  useEffect(() => {
    if (comment) {
      setContent(comment.content || '');
      setUserData({
        avatar: comment.avatar,
        login: comment.login,
      });
    }
  }, [comment, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen || !comment) return null;

  const isFormValid = content.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    try {
      await updateCommentById(comment.id, content.trim());
      showNotification('Коментар оновлено');
      onClose();
      window.location.reload();
    } catch (err) {
      showNotification(
        err?.response?.data?.message || 'Error updating comment'
      );
    } finally {
      setLoading(false);
    }
  };

  const onEmojiClick = (emojiData) => {
    setContent((prev) => prev + emojiData.emoji);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className='fixed inset-0 z-50 flex items-center justify-center'
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='absolute inset-0 bg-black opacity-50'
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='relative bg-[var(--color-background-profile)] rounded-2xl border border-[var(--color-border)] w-[90%] max-w-md px-6 py-6 flex flex-col'
          >
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-white text-lg font-bold'>
                Редагувати коментар
              </h2>
              <button
                onClick={onClose}
                className='text-[var(--color-text)] hover:text-white text-2xl leading-none'
              >
                ✕
              </button>
            </div>

            <hr className='border-[var(--color-border)] mb-4' />

            <div className='flex items-center gap-3 mb-4'>
              {userData?.avatar && (
                <img
                  src={`${BASE_URL}/${userData.avatar}`}
                  alt='avatar'
                  className='w-10 h-10 rounded-full flex-shrink-0'
                />
              )}
              <span className='text-white font-medium'>{userData?.login}</span>
            </div>
            <div className='ml-9 -mt-3'>
              <CustomInput
                placeholder='Оновіть текст коментаря'
                value={content}
                onChange={setContent}
              />
            </div>

            <div className='flex items-center gap-2 mt-2 mb-4 ml-8'>
              <div className='relative'>
                <button
                  onClick={() => setShowPicker((prev) => !prev)}
                  className='p-2 hover:bg-[#1e1e1e] rounded-lg transition-colors -mt-4 ml-2'
                >
                  <EmojiIcon className='w-5 h-5 cursor-pointer' />
                </button>

                {showPicker && (
                  <div
                    ref={pickerRef}
                    className='absolute top-12 left-0 z-50 transition-transform duration-150'
                  >
                    <Picker
                      onEmojiClick={onEmojiClick}
                      lazyLoadEmojis
                      disableSearchBar
                      disableSkinTonePicker
                      theme='dark'
                    />
                  </div>
                )}
              </div>
            </div>

            <div className='flex gap-3 justify-end mt-6'>
              <button
                onClick={onClose}
                className='px-4 py-2 text-[var(--color-text)] hover:bg-[#1e1e1e] rounded-lg transition-colors'
              >
                Скасувати
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isFormValid || loading}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
                  isFormValid
                    ? 'bg-[var(--color-accent)] text-white hover:opacity-90'
                    : 'bg-[var(--color-border)] text-[var(--color-text)]'
                }`}
              >
                {loading ? 'Збереження...' : 'Зберегти'}
              </button>
            </div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
