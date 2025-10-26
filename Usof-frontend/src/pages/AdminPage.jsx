const BASE_URL = import.meta.env.VITE_API_URL;

import { useState, useEffect, useRef } from 'react';
import { useNotification } from '../context/NotificationContext';
import { getAllUsers, updateUser, getFollowers } from '../http/userApi';
import { getAllPosts, getAllComments } from '../http/postApi';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../http/categoriesApi';
import { $authHost } from '../http/index';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { PROFILE_ROUTE } from '../utils/consts';

import VerifyOfficialIcon from '../assets/Icon/verified.png';
import VerifyAdminIcon from '../assets/Icon/verify-admin.png';
import MoreHorizontalIcon from '../assets/Icon/more-horizontal-icon.svg?react';
import UserTooltipWrapper from '../components/UserTooltipWrapper';
import EditPostModal from '../components/EditPostModal';

export default function AdminPage() {
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
  });
  const [editingUser, setEditingUser] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    // Фільтруємо користувачів за пошуком
    if (searchQuery.trim()) {
      const filtered = allUsers.filter(
        (user) =>
          user.login.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setUsers(filtered);
    } else {
      setUsers(allUsers);
    }
  }, [searchQuery, allUsers]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (activeTab === 'dashboard' || activeTab === 'users') {
        const usersResponse = await getAllUsers();
        const usersData = Array.isArray(usersResponse.data)
          ? usersResponse.data
          : usersResponse.data.data || [];
        setAllUsers(usersData);
        setUsers(usersData);
        setStats((prev) => ({ ...prev, totalUsers: usersData.length }));
      }

      if (activeTab === 'dashboard' || activeTab === 'posts') {
        const postsResponse = await getAllPosts();
        const postsData = Array.isArray(postsResponse) ? postsResponse : [];
        setPosts(postsData);
        setStats((prev) => ({ ...prev, totalPosts: postsData.length }));
      }

      if (activeTab === 'dashboard' || activeTab === 'categories') {
        const categoriesResponse = await getAllCategories();
        const categoriesData = Array.isArray(categoriesResponse)
          ? categoriesResponse
          : [];
        setCategories(categoriesData);
      }

      if (activeTab === 'dashboard') {
        try {
          const commentsResponse = await getAllComments();
          const commentsData = Array.isArray(commentsResponse.data)
            ? commentsResponse.data
            : [];
          setStats((prev) => ({ ...prev, totalComments: commentsData.length }));
        } catch (err) {
          console.error('Error fetching comments:', err);
        }
      }
    } catch (err) {
      showNotification(err?.response?.data?.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      await updateUser(userId, userData);
      showNotification('Користувача оновлено');
      setEditingUser(null);
      fetchData();
    } catch (err) {
      showNotification(err?.response?.data?.message || 'Error updating user');
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const response = await $authHost.post('/api/users', userData);
      showNotification('Користувача успішно створено');
      setIsCreatingUser(false);
      fetchData();
    } catch (err) {
      showNotification(err?.response?.data?.message || 'Error creating user');
    }
  };

  const handleCreateCategory = async (categoryData) => {
    try {
      await createCategory(categoryData.title, categoryData.description);
      showNotification('Категорія успішно створена');
      setIsCreatingCategory(false);
      fetchData();
    } catch (err) {
      showNotification(
        err?.response?.data?.message || 'Error creating category'
      );
    }
  };

  const handleUpdateCategory = async (categoryId, categoryData) => {
    try {
      await updateCategory(
        categoryId,
        categoryData.title,
        categoryData.description
      );
      showNotification('Категорія оновлена');
      setEditingCategory(null);
      fetchData();
    } catch (err) {
      showNotification(
        err?.response?.data?.message || 'Error updating category'
      );
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю категорію?')) {
      try {
        await deleteCategory(categoryId);
        showNotification('Категорія видалена');
        fetchData();
      } catch (err) {
        showNotification(
          err?.response?.data?.message || 'Error deleting category'
        );
      }
    }
  };

  return (
    <>
      <section className='flex justify-center items-center flex-col'>
        <div className='mt-10'>
          <h1 className='text-xl font-bold text-white'>Адмін Панель</h1>
        </div>
        <div className='mt-6 bg-[var(--color-background-profile)] border border-[var(--color-border)] rounded-2xl w-4/5'>
          {/* Табі */}
          <div className='-mx-0 grid grid-cols-4 place-items-center text-[var(--color-text)] text-lg font-normal border-b border-[var(--color-border)]'>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`border-b-2 w-full text-center py-4 transition-colors duration-200 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'border-white text-white'
                  : 'border-transparent text-[var(--color-text)]'
              }`}
            >
              Дашборд
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`border-b-2 w-full text-center py-4 transition-colors duration-200 cursor-pointer ${
                activeTab === 'users'
                  ? 'border-white text-white'
                  : 'border-transparent text-[var(--color-text)]'
              }`}
            >
              Користувачі
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`border-b-2 w-full text-center py-4 transition-colors duration-200 cursor-pointer ${
                activeTab === 'posts'
                  ? 'border-white text-white'
                  : 'border-transparent text-[var(--color-text)]'
              }`}
            >
              Пости
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`border-b-2 w-full text-center py-4 transition-colors duration-200 cursor-pointer ${
                activeTab === 'categories'
                  ? 'border-white text-white'
                  : 'border-transparent text-[var(--color-text)]'
              }`}
            >
              Категорії
            </button>
          </div>

          {/* Вміст табів */}
          <div className='p-8'>
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className='text-white text-2xl font-bold mb-6'>
                  Статистика
                </h2>
                <div className='grid grid-cols-3 gap-4'>
                  <div className='bg-[#2b2b2b] border border-[var(--color-border)] rounded-lg p-6'>
                    <div className='text-[var(--color-text)] text-sm'>
                      Всього користувачів
                    </div>
                    <div className='text-white text-4xl font-bold mt-2'>
                      {stats.totalUsers}
                    </div>
                  </div>
                  <div className='bg-[#2b2b2b] border border-[var(--color-border)] rounded-lg p-6'>
                    <div className='text-[var(--color-text)] text-sm'>
                      Всього постів
                    </div>
                    <div className='text-white text-4xl font-bold mt-2'>
                      {stats.totalPosts}
                    </div>
                  </div>
                  <div className='bg-[#2b2b2b] border border-[var(--color-border)] rounded-lg p-6'>
                    <div className='text-[var(--color-text)] text-sm'>
                      Всього коментарів
                    </div>
                    <div className='text-white text-4xl font-bold mt-2'>
                      {stats.totalComments}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Users */}
            {activeTab === 'users' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-white text-2xl font-bold'>
                    Управління користувачами
                  </h2>
                  <button
                    onClick={() => setIsCreatingUser(true)}
                    className='px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity'
                  >
                    + Новий користувач
                  </button>
                </div>

                {/* Пошук */}
                <div className='mb-6'>
                  <input
                    type='text'
                    placeholder='Пошук за логіном або іменем...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full px-4 py-2 bg-[#1e1e1e] text-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors placeholder:text-[var(--color-text)]'
                  />
                  {searchQuery && (
                    <div className='text-[var(--color-text)] text-sm mt-2'>
                      Знайдено: {users.length} користувачів
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className='text-[var(--color-text)]'>
                    Завантаження...
                  </div>
                ) : users.length === 0 ? (
                  <div className='text-[var(--color-text)] text-center py-8'>
                    {searchQuery
                      ? 'Користувачів не знайдено'
                      : 'Немає користувачів'}
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {users.map((user) => (
                      <UserRow
                        key={user.id}
                        user={user}
                        onEdit={setEditingUser}
                        openMenuId={openMenuId}
                        setOpenMenuId={setOpenMenuId}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Posts */}
            {activeTab === 'posts' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className='text-white text-2xl font-bold mb-6'>
                  Управління постами
                </h2>
                {loading ? (
                  <div className='text-[var(--color-text)]'>
                    Завантаження...
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {posts.map((post) => (
                      <PostRow
                        key={post.id}
                        post={post}
                        onEdit={setEditingPostId}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Categories */}
            {activeTab === 'categories' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-white text-2xl font-bold'>
                    Управління категоріями
                  </h2>
                  <button
                    onClick={() => setIsCreatingCategory(true)}
                    className='px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity'
                  >
                    + Нова категорія
                  </button>
                </div>

                {loading ? (
                  <div className='text-[var(--color-text)]'>
                    Завантаження...
                  </div>
                ) : categories.length === 0 ? (
                  <div className='text-[var(--color-text)] text-center py-8'>
                    Немає категорій
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {categories.map((category) => (
                      <CategoryRow
                        key={category.id}
                        category={category}
                        onEdit={setEditingCategory}
                        onDelete={handleDeleteCategory}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Edit User Modal */}
      <EditUserModal
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onUpdate={handleUpdateUser}
      />

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreatingUser}
        onClose={() => setIsCreatingUser(false)}
        onCreate={handleCreateUser}
      />

      {/* Edit Post Modal */}
      <EditPostModal
        isOpen={!!editingPostId}
        onClose={() => setEditingPostId(null)}
        postId={editingPostId}
      />

      {/* Create Category Modal */}
      <CreateCategoryModal
        isOpen={isCreatingCategory}
        onClose={() => setIsCreatingCategory(false)}
        onCreate={handleCreateCategory}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
        onUpdate={handleUpdateCategory}
      />
    </>
  );
}

function UserRow({ user, onEdit, openMenuId, setOpenMenuId }) {
  const menuRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [followers, setFollowers] = useState(0);
  const hoverTimer = useRef(null);
  const leaveTimer = useRef(null);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await getFollowers(user.id);
        setFollowers(Array.isArray(res.data) ? res.data.length : 0);
      } catch (err) {
        console.error('Error fetching followers:', err);
      }
    };
    fetchFollowers();
  }, [user.id]);

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

  return (
    <div className='flex items-center justify-between p-4 bg-[#2b2b2b] border border-[var(--color-border)] rounded-lg hover:bg-[#333] transition-colors'>
      <div className='flex items-center gap-4 flex-1'>
        <img
          src={`${BASE_URL}/${user.avatar}`}
          alt={user.login}
          className='w-12 h-12 rounded-full object-cover flex-shrink-0'
        />
        <div className='flex-1'>
          <div className='flex items-center gap-2'>
            <div
              className='relative'
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <NavLink
                to={`${PROFILE_ROUTE}/${user.id}`}
                className='text-white font-semibold hover:underline'
                onClick={(e) => e.stopPropagation()}
              >
                {user.login}
              </NavLink>

              {showTooltip && (
                <div className='absolute top-6 left-0 z-50'>
                  <UserTooltipWrapper
                    userData={user}
                    isVisible={showTooltip}
                    onClose={() => setShowTooltip(false)}
                  />
                </div>
              )}
            </div>
            {user.role === 'ADMIN' ? (
              <img src={VerifyAdminIcon} alt='admin' className='w-4 h-4' />
            ) : user.isOfficial ? (
              <img
                src={VerifyOfficialIcon}
                alt='official'
                className='w-6 h-6 -ml-1.5'
              />
            ) : null}
          </div>
          <div className='flex items-center gap-4 mt-1'>
            <span className='text-[var(--color-text)] text-sm'>
              {user.fullName}
            </span>
            <span className='text-[var(--color-text)] text-xs'>
              👥 {followers} підписників
            </span>
          </div>
        </div>
      </div>

      <div className='relative'>
        <button
          ref={menuRef}
          onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
          className='p-2 hover:bg-[#1e1e1e] rounded-lg transition-colors'
        >
          <MoreHorizontalIcon className='w-5 h-5 text-[var(--color-text)]' />
        </button>

        <AnimatePresence>
          {openMenuId === user.id && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='absolute top-10 right-0 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg shadow-lg w-48 z-50 py-2'
            >
              <button
                onClick={() => {
                  onEdit(user);
                  setOpenMenuId(null);
                }}
                className='w-full text-left px-4 py-2 text-white hover:bg-[#2f2f2f] transition-colors'
              >
                ✏️ Редагувати
              </button>
              <button className='w-full text-left px-4 py-2 text-red-600 hover:bg-[#2f2f2f] transition-colors'>
                🚫 Забанити
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EditUserModal({ user, onClose, onUpdate }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [biography, setBiography] = useState('');
  const [starsBalance, setStarsBalance] = useState(0);
  const [isOfficial, setIsOfficial] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setBiography(user.biography || '');
      setStarsBalance(user.stars_balance || 0);
      setIsOfficial(user.isOfficial || false);
      setIsAdmin(user.role === 'ADMIN');
    }
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    setLoading(true);
    const updates = {};

    if (fullName !== user.fullName) {
      updates.fullName = fullName;
    }
    if (email !== user.email) {
      updates.email = email;
    }
    if (biography !== user.biography) {
      updates.biography = biography;
    }
    if (starsBalance !== user.stars_balance) {
      updates.stars_balance = starsBalance;
    }

    const userIsAdmin = user.role === 'ADMIN';
    if (isAdmin !== userIsAdmin) {
      updates.role = isAdmin ? 'ADMIN' : 'USER';
    }
    if (isOfficial !== user.isOfficial) {
      updates.isOfficial = isOfficial;
    }

    if (Object.keys(updates).length > 0) {
      await onUpdate(user.id, updates);
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {user && (
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
            className='relative bg-[var(--color-background-profile)] rounded-2xl border border-[var(--color-border)] w-[95%] max-w-4xl px-8 py-6 flex flex-col max-h-[95vh] overflow-y-auto'
          >
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-white text-lg font-bold'>
                Редагувати користувача
              </h2>
              <button
                onClick={onClose}
                className='text-[var(--color-text)] hover:text-white text-2xl leading-none'
              >
                ✕
              </button>
            </div>

            <hr className='border-[var(--color-border)] mb-4' />

            <div className='flex items-center gap-3 mb-6'>
              <img
                src={`${BASE_URL}/${user.avatar}`}
                alt={user.login}
                className='w-12 h-12 rounded-full object-cover'
              />
              <div>
                <div className='text-white font-semibold'>{user.login}</div>
                <div className='text-[var(--color-text)] text-sm'>
                  ID: {user.id}
                </div>
              </div>
            </div>

            {/* Профіль */}
            <div className='mb-6'>
              <h3 className='text-white font-semibold mb-3'>Профіль</h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-[var(--color-text)] text-sm mb-1 block'>
                    Повне імя
                  </label>
                  <input
                    type='text'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className='w-full px-3 py-2 bg-[#1e1e1e] text-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors'
                    placeholder='Повне імя'
                  />
                </div>

                <div>
                  <label className='text-[var(--color-text)] text-sm mb-1 block'>
                    Пошта
                  </label>
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full px-3 py-2 bg-[#1e1e1e] text-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors'
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>

              <div className='mt-4'>
                <label className='text-[var(--color-text)] text-sm mb-1 block'>
                  Біографія
                </label>
                <textarea
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  className='w-full px-3 py-2 bg-[#1e1e1e] text-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none'
                  placeholder='Біографія'
                  rows='2'
                />
              </div>
            </div>

            {/* Зірки */}
            <div className='mb-6'>
              <h3 className='text-white font-semibold mb-3'>Зірки</h3>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => setStarsBalance(Math.max(0, starsBalance - 1))}
                  className='px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors'
                >
                  −
                </button>
                <input
                  type='number'
                  value={starsBalance}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setStarsBalance(isNaN(value) ? 0 : Math.max(0, value));
                  }}
                  className='flex-1 px-3 py-2 bg-[#1e1e1e] text-white border border-[var(--color-border)] rounded-lg text-center font-semibold focus:outline-none focus:border-[var(--color-accent)] transition-colors'
                  placeholder='0'
                  min='0'
                />
                <button
                  onClick={() => setStarsBalance(starsBalance + 1)}
                  className='px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors'
                >
                  +
                </button>
              </div>
            </div>

            {/* Статус */}
            <div className='mb-6'>
              <h3 className='text-white font-semibold mb-3'>Статус</h3>
              <div className='space-y-3'>
                <div className='flex items-center justify-between p-3 bg-[#1e1e1e] rounded-lg border border-[var(--color-border)]'>
                  <span className='text-white'>✓ Офіційний статус</span>
                  <button
                    onClick={() => setIsOfficial(!isOfficial)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isOfficial ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isOfficial ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className='flex items-center justify-between p-3 bg-[#1e1e1e] rounded-lg border border-[var(--color-border)]'>
                  <span className='text-white'>👑 Адмін статус</span>
                  <button
                    onClick={() => setIsAdmin(!isAdmin)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isAdmin ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isAdmin ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className='flex gap-3 justify-end'>
              <button
                onClick={onClose}
                className='px-4 py-2 text-[var(--color-text)] hover:bg-[#1e1e1e] rounded-lg transition-colors'
              >
                Скасувати
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className='px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50'
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

function PostRow({ post, onEdit }) {
  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className='flex items-start justify-between gap-4 p-4 bg-[#2b2b2b] border border-[var(--color-border)] rounded-lg hover:bg-[#333] transition-colors'>
      <div className='flex-1'>
        <h3 className='text-white font-semibold'>{post.title}</h3>
        <p className='text-[var(--color-text)] text-sm mt-1 line-clamp-2'>
          {post.content}
        </p>
        <div className='flex gap-4 mt-2 text-[var(--color-text)] text-xs'>
          <span>👤 {post.authorName}</span>
          <span>❤️ {post.likes_count || 0} лайків</span>
          <span>
            💬 {post.commentsCount || post.comments_count || 0} коментарів
          </span>
        </div>
      </div>

      <div className='relative'>
        <button
          ref={menuRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className='p-2 hover:bg-[#1e1e1e] rounded-lg transition-colors'
        >
          <MoreHorizontalIcon className='w-5 h-5 text-[var(--color-text)]' />
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='absolute top-10 right-0 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg shadow-lg w-48 z-50 py-2'
            >
              <button
                onClick={() => {
                  onEdit(post.id);
                  setIsMenuOpen(false);
                }}
                className='w-full text-left px-4 py-2 text-white hover:bg-[#2f2f2f] transition-colors'
              >
                ✏️ Редагувати
              </button>
              <button className='w-full text-left px-4 py-2 text-red-600 hover:bg-[#2f2f2f] transition-colors'>
                🗑️ Видалити
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CategoryRow({ category, onEdit, onDelete }) {
  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className='flex items-center justify-between gap-4 p-4 bg-[#2b2b2b] border border-[var(--color-border)] rounded-lg hover:bg-[#333] transition-colors'>
      <div className='flex-1'>
        <h3 className='text-white font-semibold'>{category.title}</h3>
        <p className='text-[var(--color-text)] text-sm mt-1'>
          {category.description || 'Без опису'}
        </p>
      </div>

      <div className='relative'>
        <button
          ref={menuRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className='p-2 hover:bg-[#1e1e1e] rounded-lg transition-colors'
        >
          <MoreHorizontalIcon className='w-5 h-5 text-[var(--color-text)]' />
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='absolute top-10 right-0 bg-[var(--color-background-secondary)] border border-[var(--color-border)] rounded-lg shadow-lg w-48 z-50 py-2'
            >
              <button
                onClick={() => {
                  onEdit(category);
                  setIsMenuOpen(false);
                }}
                className='w-full text-left px-4 py-2 text-white hover:bg-[#2f2f2f] transition-colors'
              >
                ✏️ Редагувати
              </button>
              <button
                onClick={() => {
                  onDelete(category.id);
                  setIsMenuOpen(false);
                }}
                className='w-full text-left px-4 py-2 text-red-600 hover:bg-[#2f2f2f] transition-colors'
              >
                🗑️ Видалити
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CreateCategoryModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Назва категорії обов'язкова");
      return;
    }

    setLoading(true);
    await onCreate({
      title,
      description,
    });
    setLoading(false);

    // Reset form
    setTitle('');
    setDescription('');
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
            className='relative bg-[var(--color-background-profile)] rounded-2xl border border-[var(--color-border)] w-[90%] max-w-lg px-6 py-6 flex flex-col'
          >
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-white text-lg font-bold'>
                Створити категорію
              </h2>
              <button
                onClick={onClose}
                className='text-[var(--color-text)] hover:text-white text-2xl leading-none'
              >
                ✕
              </button>
            </div>

            <hr className='border-[var(--color-border)] mb-4' />

            <div className='space-y-4 mb-6'>
              <div>
                <label className='text-[var(--color-text)] text-sm mb-1 block'>
                  Назва категорії
                </label>
                <input
                  type='text'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className='w-full px-3 py-2 bg-[#1e1e1e] text-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors'
                  placeholder='Назва категорії'
                />
              </div>

              <div>
                <label className='text-[var(--color-text)] text-sm mb-1 block'>
                  Опис
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='w-full px-3 py-2 bg-[#1e1e1e] text-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none'
                  placeholder='Опис категорії'
                  rows='3'
                />
              </div>
            </div>

            <div className='flex gap-3 justify-end'>
              <button
                onClick={onClose}
                className='px-4 py-2 text-[var(--color-text)] hover:bg-[#1e1e1e] rounded-lg transition-colors'
              >
                Скасувати
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className='px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50'
              >
                {loading ? 'Створення...' : 'Створити'}
              </button>
            </div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

function EditCategoryModal({ category, onClose, onUpdate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setTitle(category.title || '');
      setDescription(category.description || '');
    }
  }, [category]);

  if (!category) return null;

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Назва категорії обов'язкова");
      return;
    }

    setLoading(true);
    const updates = {};

    if (title !== category.title) {
      updates.title = title;
    }
    if (description !== category.description) {
      updates.description = description;
    }

    if (Object.keys(updates).length > 0) {
      await onUpdate(category.id, updates);
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {category && (
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
            className='relative bg-[var(--color-background-profile)] rounded-2xl border border-[var(--color-border)] w-[90%] max-w-lg px-6 py-6 flex flex-col'
          >
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-white text-lg font-bold'>
                Редагувати категорію
              </h2>
              <button
                onClick={onClose}
                className='text-[var(--color-text)] hover:text-white text-2xl leading-none'
              >
                ✕
              </button>
            </div>

            <hr className='border-[var(--color-border)] mb-4' />

            <div className='space-y-4 mb-6'>
              <div>
                <label className='text-[var(--color-text)] text-sm mb-1 block'>
                  Назва категорії
                </label>
                <input
                  type='text'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className='w-full px-3 py-2 bg-[#1e1e1e] text-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors'
                  placeholder='Назва категорії'
                />
              </div>

              <div>
                <label className='text-[var(--color-text)] text-sm mb-1 block'>
                  Опис
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='w-full px-3 py-2 bg-[#1e1e1e] text-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none'
                  placeholder='Опис категорії'
                  rows='3'
                />
              </div>
            </div>

            <div className='flex gap-3 justify-end'>
              <button
                onClick={onClose}
                className='px-4 py-2 text-[var(--color-text)] hover:bg-[#1e1e1e] rounded-lg transition-colors'
              >
                Скасувати
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className='px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50'
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

function CreateUserModal({ isOpen, onClose, onCreate }) {
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOfficial, setIsOfficial] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (
      !login.trim() ||
      !email.trim() ||
      !fullName.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      alert("Всі поля обов'язкові");
      return;
    }

    if (password !== confirmPassword) {
      alert('Паролі не збігаються');
      return;
    }

    setLoading(true);
    await onCreate({
      login,
      email,
      fullName,
      password,
      confirmPassword,
      role: isAdmin ? 'ADMIN' : 'USER',
      isOfficial,
    });
    setLoading(false);

    // Reset form
    setLogin('');
    setEmail('');
    setFullName('');
    setPassword('');
    setConfirmPassword('');
    setIsAdmin(false);
    setIsOfficial(false);
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
            className='relative bg-[var(--color-background-profile)] rounded-2xl border border-[var(--color-border)] w-[90%] max-w-lg px-6 py-6 flex flex-col max-h-[90vh] overflow-y-auto'
          >
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-white text-lg font-bold'>
                Створити нового користувача
              </h2>
              <button
                onClick={onClose}
                className='text-[var(--color-text)] hover:text-white text-2xl leading-none'
              >
                ✕
              </button>
            </div>

            <hr className='border-[var(--color-border)] mb-4' />

            {/* Профіль */}
            <div className='mb-6'>
              <h3 className='text-white font-semibold mb-3'>Дані профілю</h3>
              <div className='space-y-3'>
                <div>
                  <label className='text-[var(--color-text)] text-sm mb-1 block'>
                    Логін
                  </label>
                  <input
                    type='text'
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    className='w-full px-3 py-2 bg-[#1e1e1e] text-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors'
                    placeholder='user123'
                  />
                </div>

                <div>
                  <label className='text-[var(--color-text)] text-sm mb-1 block'>
                    Пошта
                  </label>
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full px-3 py-2 bg-[#1e1e1e] text-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors'
                    placeholder='user@example.com'
                  />
                </div>

                <div>
                  <label className='text-[var(--color-text)] text-sm mb-1 block'>
                    Повне імя
                  </label>
                  <input
                    type='text'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className='w-full px-3 py-2 bg-[#1e1e1e] text-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors'
                    placeholder='Іван Петренко'
                  />
                </div>

                <div>
                  <label className='text-[var(--color-text)] text-sm mb-1 block'>
                    Пароль
                  </label>
                  <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full px-3 py-2 bg-[#1e1e1e] text-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors'
                    placeholder='••••••••'
                  />
                </div>

                <div>
                  <label className='text-[var(--color-text)] text-sm mb-1 block'>
                    Підтвердити пароль
                  </label>
                  <input
                    type='password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='w-full px-3 py-2 bg-[#1e1e1e] text-white border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-accent)] transition-colors'
                    placeholder='••••••••'
                  />
                </div>
              </div>
            </div>

            {/* Статус */}
            <div className='mb-6'>
              <h3 className='text-white font-semibold mb-3'>Статус</h3>
              <div className='space-y-3'>
                <div className='flex items-center justify-between p-3 bg-[#1e1e1e] rounded-lg border border-[var(--color-border)]'>
                  <span className='text-white'>✓ Офіційний статус</span>
                  <button
                    onClick={() => setIsOfficial(!isOfficial)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isOfficial ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isOfficial ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className='flex items-center justify-between p-3 bg-[#1e1e1e] rounded-lg border border-[var(--color-border)]'>
                  <span className='text-white'>👑 Адмін статус</span>
                  <button
                    onClick={() => setIsAdmin(!isAdmin)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isAdmin ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isAdmin ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className='flex gap-3 justify-end'>
              <button
                onClick={onClose}
                className='px-4 py-2 text-[var(--color-text)] hover:bg-[#1e1e1e] rounded-lg transition-colors'
              >
                Скасувати
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className='px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50'
              >
                {loading ? 'Створення...' : 'Створити'}
              </button>
            </div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
