import { useEffect, useState } from 'react';
import { getPostById } from '../http/postApi';
import { useParams } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { getAllCommentsForPost } from '../http/postApi';
import CommentPreview from '../components/CommentPreview';

import PostModel from '../components/PostModel';

export default function PostPage() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [comments, setComments] = useState([]);
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
        const response = await getAllCommentsForPost(id, 'createdAt', 'asc');
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
  }, [id]);

  //   alert(`Comments length: ${comments.length}`);
  //   alert(`Post ID: ${id}`);

  return (
    <section className='flex justify-center items-center flex-col'>
      <div className='mt-10'>
        <h1 className='text-xl font-bold text-white'>Ланцюжок</h1>
      </div>
      <div className='mt-6 bg-[var(--color-background-profile)] border border-[var(--color-border)] rounded-2xl p-8 w-1/2'>
        {loading && (
          <div className='text-[var(--color-text)] mt-4 text-sm italic'>
            Завантаження...
          </div>
        )}
        <PostModel post={post} />

        <hr />
        <div className='mt-4 flex flex-col'>
          {loadingComments && (
            <div className='text-[var(--color-text)] mt-4 text-sm italic'>
              Завантаження коментарів...
            </div>
          )}
          {comments.length === 0 && (
            <div className='text-[var(--color-text)] mt-2  text-center'>
              <span className='italic'>Немає коментарів</span> 😔
            </div>
          )}
          {comments.map((comment) => (
            <CommentPreview key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </section>
  );
}
