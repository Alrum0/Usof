import ChevronRight from '../assets/Icon/chevron-right.svg?react';
import SortIcon from '../assets/Icon/sort.png';
import MenuIcon from '../assets/Icon/menu.png';

import { useEffect, useState } from 'react';
import { getAllPosts, getFollowingPosts } from '../http/postApi';
import { useNotification } from '../context/NotificationContext';
import { useSelector } from 'react-redux';

import NewPostInput from '../components/NewPostInput';
import PostModel from '../components/PostModel';
import ContentSourceSelector from '../components/ContentSourceSelector';
import SortSourceSelector from '../components/SortSourceSelector';

export default function MainPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [sortModal, setSortModal] = useState(false);
  const [activeSource, setActiveSource] = useState('Для вас');
  const [activeSort, setActiveSort] = useState('date_desc');

  const { showNotification } = useNotification();
  const isAuth = useSelector((state) => state.auth.isAuth);

  const fetchPosts = async (source, sort = activeSort) => {
    setLoading(true);
    try {
      const response =
        source === 'Відстежуються'
          ? await getFollowingPosts()
          : await getAllPosts();

      let sortedPosts = Array.isArray(response) ? [...response] : [];

      if (sort === 'date_desc') {
        sortedPosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else if (sort === 'date_asc') {
        sortedPosts.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      } else if (sort === 'likes_desc') {
        sortedPosts.sort((a, b) => b.likes - a.likes);
      } else if (sort === 'likes_asc') {
        sortedPosts.sort((a, b) => a.likes - b.likes);
      }

      setPosts(sortedPosts);
      setActiveSource(source);
    } catch (error) {
      showNotification(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts('Для вас');
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
        <div className='flex justify-end gap-70 items-center w-1/2 mt-6'>
          <div className='flex gap-2'>
            <h1 className='text-xl font-semibold text-white'>{activeSource}</h1>

            <div className='relative items-center'>
              <button
                onClick={() => setOpenModal((prev) => !prev)}
                className='active:scale-95 transition-transform duration-150'
              >
                <div className='bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-full h-6 w-6 relative hover:scale-115 cursor-pointer transition-all'>
                  <ChevronRight className='rotate-90 absolute inset-0 m-auto' />
                </div>
              </button>

              <ContentSourceSelector
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                onSelectSource={(source) => {
                  fetchPosts(source);
                  setOpenModal(false);
                }}
              />
            </div>
          </div>
          <div className='relative'>
            <button
              className='bg-[var(--color-background-secondary)] border border-[var(--color-border)] py-2 px-3 rounded-full flex items-center gap-2 cursor-pointer active:scale-95 transition-transform duration-150'
              onClick={() => setSortModal((prev) => !prev)}
            >
              <span className='text-white'>Сортування</span>
              <img src={SortIcon} alt='sort icon' className='w-6 h-6 invert' />
            </button>
            <SortSourceSelector
              isOpen={sortModal}
              onClose={() => setSortModal(false)}
              selectedSort={activeSort}
              onSelect={(sort) => {
                setActiveSort(sort);
                fetchPosts(activeSource, sort);
              }}
            />
          </div>
        </div>

        <div className='mt-6 bg-[var(--color-background-profile)] border border-[var(--color-border)] rounded-2xl p-8 pt-4 w-1/2'>
          {isAuth && <NewPostInput />}
          {posts.map((post) => (
            <PostModel key={post.id} post={post} />
          ))}
        </div>
      </section>
      <button className='absolute right-6 top-6 cursor-pointer active:scale-95 transition-transform duration-150'>
        <img src={MenuIcon} alt='Menu Icon' className='w-6 h-6 invert' />
      </button>
    </>
  );
}
