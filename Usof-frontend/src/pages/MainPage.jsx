import { useEffect, useState } from 'react';
import { getAllPosts } from '../http/postApi';
import { useNotification } from '../context/NotificationContext';

import NewPostInput from '../components/NewPostInput';
import PostModel from '../components/PostModel';

export default function MainPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPosts();
        setPosts(Array.isArray(response) ? response : []);
      } catch (error) {
        showNotification(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-white'>Loading posts...</div>
      </div>
    );
  }

  return (
    <>
      <section className='flex justify-center items-center flex-col'>
        <div className='mt-10'>
          <h1 className='text-xl font-bold text-white'>For You</h1>
        </div>
        <div className='mt-6 bg-[var(--color-background-profile)] border border-[var(--color-border)] rounded-2xl p-8 pt-4 w-1/2'>
          <NewPostInput />

          {posts.map((post) => (
            <PostModel key={post.id} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
