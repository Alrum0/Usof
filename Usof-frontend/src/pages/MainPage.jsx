import ChevronRight from '../assets/Icon/chevron-right.svg?react';
import SortIcon from '../assets/Icon/sort.png';
import MenuIcon from '../assets/Icon/menu.png';

import { useEffect, useState } from 'react';
import { getAllPosts, getFollowingPosts } from '../http/postApi';
import { useNotification } from '../context/NotificationContext';
import { useSelector } from 'react-redux';
import { getAllCategories, getPostsForCategory } from '../http/categoriesApi';

import NewPostInput from '../components/NewPostInput';
import PostModel from '../components/PostModel';
import ContentSourceSelector from '../components/ContentSourceSelector';
import SortSourceSelector from '../components/SortSourceSelector';
import CategoriesModel from '../components/CategoriesModel';

export default function MainPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [sortModal, setSortModal] = useState(false);
  const [activeSource, setActiveSource] = useState('Для вас');
  const [activeSort, setActiveSort] = useState('date_desc');
  const [openCategoriesModal, setOpenCategoriesModal] = useState(false);
  const [categoriesList, setCategoryList] = useState([]);

  const { showNotification } = useNotification();
  const isAuth = useSelector((state) => state.auth.isAuth);

  const fetchPosts = async (source, sort = activeSort, categoryId = null) => {
    setLoading(true);
    try {
      let response;

      if (categoryId) {
        const categoryData = await getPostsForCategory(categoryId);
        // categoryData shape: { page, limit, count, posts }
        response = Array.isArray(categoryData?.posts) ? categoryData.posts : [];
      } else if (source === 'Відстежуються') {
        response = await getFollowingPosts();
      } else {
        response = await getAllPosts();
      }

      const postsArray = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      let sortedPosts = [...postsArray];

      const getDate = (p) =>
        new Date(p?.publishDate ?? p?.createdAt ?? 0).getTime();
      const getLikes = (p) => Number(p?.likes_count ?? p?.likes ?? 0);

      if (sort === 'date_desc')
        sortedPosts.sort((a, b) => getDate(b) - getDate(a));
      else if (sort === 'date_asc')
        sortedPosts.sort((a, b) => getDate(a) - getDate(b));
      else if (sort === 'likes_desc')
        sortedPosts.sort((a, b) => getLikes(b) - getLikes(a));
      else if (sort === 'likes_asc')
        sortedPosts.sort((a, b) => getLikes(a) - getLikes(b));

      setPosts(sortedPosts);

      if (categoryId) {
        const category = categoriesList.find((c) => c.id === categoryId);
        setActiveSource(category?.title || 'Категорія');
      } else {
        setActiveSource(source);
      }
    } catch (error) {
      showNotification(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts('Для вас');
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategoryList(Array.isArray(data) ? data : []);
      } catch (err) {
        showNotification(
          err.response?.data?.message || 'Не вдалося завантажити категорії.'
        );
        setCategoryList([]);
      }
    };

    if (openCategoriesModal) {
      fetchCategories();
    }
  }, [openCategoriesModal]);

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
      <button
        className='absolute right-6 top-6 cursor-pointer active:scale-95 transition-transform duration-150'
        onClick={() => setOpenCategoriesModal(true)}
      >
        <img src={MenuIcon} alt='Menu Icon' className='w-6 h-6 invert' />
      </button>
      <CategoriesModel
        isOpen={openCategoriesModal}
        onClose={() => setOpenCategoriesModal(false)}
        categories={categoriesList}
        onSelectCategory={(cat) => {
          setOpenCategoriesModal(false);
          fetchPosts('Для вас', activeSort, cat.id); // 🔹 завантажуємо пости категорії
        }}
      />
    </>
  );
}
