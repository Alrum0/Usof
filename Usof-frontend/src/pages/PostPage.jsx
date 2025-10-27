import { useEffect, useState } from 'react';
import { getPostById } from '../http/postApi';
import { useParams } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { getAllCommentsForPost } from '../http/postApi';
import CommentPreview from '../components/CommentPreview';
import { motion, AnimatePresence } from 'framer-motion';

import PostModel from '../components/PostModel';

export default function PostPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [comments, setComments] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const { id } = useParams();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getPostById(id);
        setPost(response.data);
      } catch (err) {
        console.error(err);
        showNotification(err?.response?.data?.message || 'Error fetching post');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const response = await getAllCommentsForPost(
          id,
          'createdAt',
          sortOrder
        );
        setComments(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(err);
        showNotification(
          err?.response?.data?.message || 'Error fetching comments'
        );
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [id, sortOrder]);
  return (
    <section className='flex justify-center items-center flex-col px-4 md:px-0'>
      <div className='mt-6 md:mt-10'>
        <h1 className='text-xl font-bold text-white'>Ланцюжок</h1>
      </div>
      <div className='mt-6 bg-[var(--color-background-profile)] border border-[var(--color-border)] rounded-2xl p-4 md:p-8 w-full max-w-2xl'>
        {loading && (
          <div className='text-[var(--color-text)] mt-4 text-sm italic'>
            Завантаження...
          </div>
        )}
        <PostModel post={post} />

        <div className='mt-4 mb-4 flex items-center justify-between'>
          <h3 className='text-white font-semibold text-sm md:text-base'>
            Коментарі
          </h3>

          <div className='relative'>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className='px-2 md:px-3 py-1.5 bg-[var(--color-input)] text-white text-xs md:text-sm rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent)] focus:outline-none focus:border-[var(--color-accent)] transition-colors cursor-pointer'
            >
              {sortOrder === 'asc' ? 'Найстарші' : 'Найновіші'}
            </button>
            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.12 }}
                  className='absolute top-12 right-0 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-xl shadow-lg w-48 md:w-56 z-50 p-3'
                >
                  <div className='text-xs text-[var(--color-text)] font-medium mb-2'>
                    Сортування коментарів
                  </div>
                  <ul className='flex flex-col gap-1'>
                    <li
                      className={`px-3 py-2 rounded-lg cursor-pointer text-white text-sm hover:bg-[#2f2f2f] transition-all ${
                        sortOrder === 'asc'
                          ? 'bg-[#2b2b2b] ring-1 ring-[var(--color-border)]'
                          : ''
                      }`}
                      onClick={() => {
                        setSortOrder('asc');
                        setIsSortOpen(false);
                      }}
                    >
                      Найстарші першими
                    </li>
                    <li
                      className={`px-3 py-2 rounded-lg cursor-pointer text-white text-sm hover:bg-[#2f2f2f] transition-all ${
                        sortOrder === 'desc'
                          ? 'bg-[#2b2b2b] ring-1 ring-[var(--color-border)]'
                          : ''
                      }`}
                      onClick={() => {
                        setSortOrder('desc');
                        setIsSortOpen(false);
                      }}
                    >
                      Найновіші першими
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <hr className='border-[var(--color-border)] -mx-4 md:-mx-8 mt-2 mb-4' />
        <div className='flex flex-col'>
          {loadingComments && (
            <div className='text-[var(--color-text)] mt-4 text-sm italic'>
              Завантаження коментарів...
            </div>
          )}
          {comments.length === 0 && (
            <div className='text-[var(--color-text)] mt-2 text-center text-sm md:text-base'>
              <span className='italic'>Немає коментарів</span> 😔
            </div>
          )}
          {comments.map((comment) => (
            <CommentPreview
              key={comment.id}
              comment={comment}
              postId={post?.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
