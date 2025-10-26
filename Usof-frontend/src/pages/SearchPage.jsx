import UserPreview from '../components/UserPreview';

import { useEffect, useState } from 'react';
import { getAllUsers } from '../http/userApi';
import { useNotification } from '../context/NotificationContext';
import { useSelector } from 'react-redux';

export default function SearchPage() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // const userId = useSelector((state) => state.auth.user?.id);

  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchUsers = async (search) => {
      try {
        setLoading(true);
        const response = await getAllUsers(search);
        setUsers(response.data);
      } catch (err) {
        showNotification(
          err?.response?.data?.message || 'Error fetching users'
        );
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(() => {
      fetchUsers(query);
    }, 150);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <>
      <section className='flex justify-center items-center flex-col px-4 md:px-0'>
        <div className='mt-6 md:mt-10'>
          <h1 className='text-xl font-bold text-white'>Пошук</h1>
        </div>
        <div className='mt-6 bg-[var(--color-background-profile)] border border-[var(--color-border)] rounded-2xl p-4 md:p-8 w-full md:w-1/2'>
          <div className='flex justify-center items-center h-full'>
            <input
              type='text'
              placeholder='Пошук'
              className='border border-[var(--color-border)] rounded-xl bg-[var(--color-background)] px-2 py-3 text-white w-full outline-none placeholder:text-[var(--color-text)] text-sm md:text-base'
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className='text-[var(--color-text)] text-sm md:text-base mt-4'>
            <span className='font-medium'>
              Стежте за рекомендованими користувачами
            </span>
          </div>
          {loading && (
            <div className='text-[var(--color-text)] mt-4 text-sm italic'>
              Пошук...
            </div>
          )}
          <div className='mt-6 flex flex-col'>
            {users.map((user) => (
              <UserPreview key={user.id} user={user} />
            ))}
          </div>

          {!loading && query.trim() && users.length === 0 && (
            <div className='text-[var(--color-text)] text-center mt-10'>
              <span className='italic'>Нічого не знайдено</span> 😔
            </div>
          )}
        </div>
      </section>
    </>
  );
}
