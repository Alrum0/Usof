import { useState, useEffect, useRef } from 'react';
import './AnimatedStar.css';
import Star from '../../assets/Icon/star.png';
import { giveStarToPost, getStarStatus } from '../../http/postApi';
import { useNotification } from '../../context/NotificationContext';
import { useSelector } from 'react-redux';

export default function AnimatedStar({ post }) {
  const starRef = useRef(null);
  const holdTimeoutRef = useRef(null);
  const starIntervalRef = useRef(null);
  const { showNotification } = useNotification();
  const currentUserId = useSelector((state) => state.auth.user?.id);
  const isOwnPost = currentUserId && post?.authorId === currentUserId;

  const [isActive, setIsActive] = useState(false);
  const [starsPerSecond, setStarsPerSecond] = useState(4);
  const [showModal, setShowModal] = useState(false);
  const [starCount, setStarCount] = useState(1);
  const [totalStars, setTotalStars] = useState(Number(post?.stars ?? 0) || 0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (starIntervalRef.current) clearInterval(starIntervalRef.current);
    const intervalTime = 1000 / starsPerSecond;
    starIntervalRef.current = setInterval(createMiniStar, intervalTime);
    return () => clearInterval(starIntervalRef.current);
  }, [starsPerSecond]);

  useEffect(() => {
    const fetchStarStatus = async () => {
      if (!currentUserId || !post?.id) return;

      try {
        const response = await getStarStatus(post.id);
        setIsActive(response.data.hasStarred);
      } catch (err) {
        console.error('Failed to fetch star status', err);
      }
    };
    fetchStarStatus();
  }, [currentUserId, post?.id]);

  useEffect(() => {
    setTotalStars(Number(post?.stars ?? 0) || 0);
  }, [post?.stars, post?.id]);

  const activateStar = () => {
    setIsActive(true);
    starRef.current?.classList.add('pulse');
    setStarsPerSecond(8);
    setTimeout(() => starRef.current?.classList.remove('pulse'), 600);
  };

  const endPulse = () => {
    starRef.current?.classList.remove('pulse');
    setStarsPerSecond(4);
  };

  // --- Клік по зірці ---
  const handleClick = async (e) => {
    e.stopPropagation();
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    if (isSending) return;
    if (isOwnPost) {
      showNotification('Ви не можете дарувати зірки власному допису');
      return;
    }

    activateStar();

    try {
      if (!post?.id) return;
      setIsSending(true);

      const response = await giveStarToPost(post.id, 1);

      const serverStars = response?.data?.stars;
      if (serverStars !== undefined && serverStars !== null) {
        setTotalStars(Number(serverStars) || 0);
        setIsActive(false);
      } else {
        setTotalStars((prev) => Number(prev || 0) + 1);
      }

      setIsActive(true);
    } catch (err) {
      console.error('Error giving star:', err);
      showNotification(err?.response?.data?.message || 'Error giving star');
    } finally {
      setIsSending(false);
      setTimeout(() => endPulse(), 600);
    }
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
    if (isOwnPost) return;
    holdTimeoutRef.current = setTimeout(() => {
      setShowModal(true);
    }, 2000);
  };

  const handleMouseUp = (e) => {
    e.stopPropagation();
    clearTimeout(holdTimeoutRef.current);
  };

  const handleConfirm = async () => {
    setShowModal(false);
    activateStar();

    try {
      if (!post?.id) return;
      if (isSending) return;
      setIsSending(true);

      const response = await giveStarToPost(post.id, starCount);
      const serverStars = response?.data?.stars;
      if (serverStars !== undefined && serverStars !== null) {
        setTotalStars(Number(serverStars) || 0);
      } else {
        setTotalStars((prev) => Number(prev || 0) + Number(starCount));
      }

      setIsActive(true);
      showNotification(response?.data?.message || 'Stars given successfully');
    } catch (err) {
      console.error('Error giving multiple stars:', err);
      showNotification(err?.response?.data?.message || 'Error giving stars');
    } finally {
      setIsSending(false);
      setTimeout(() => endPulse(), 600);
    }
  };

  const createMiniStar = () => {
    const container = starRef.current;
    if (!container) return;

    const existing = container.querySelectorAll('.mini-star') || [];
    if (existing.length > 30) return;

    const miniStar = document.createElement('div');
    miniStar.className = 'mini-star';
    miniStar.textContent = '★';

    const size = Math.random() * 3 + 2;
    miniStar.style.fontSize = `${size}px`;

    const colors = ['#FFAD33', '#FFB84D', '#FFC266', '#FFCC80'];
    miniStar.style.color = colors[Math.floor(Math.random() * colors.length)];

    container.appendChild(miniStar);

    const angle = Math.random() * Math.PI * 2;
    const distance = 10 + Math.random() * 10;
    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance;
    const rotation = (Math.random() - 0.5) * 180;
    const duration = 1 + Math.random();

    miniStar.style.animation = `flyStar ${duration}s ease-out forwards`;
    miniStar.style.setProperty('--end-x', `${endX}px`);
    miniStar.style.setProperty('--end-y', `${endY}px`);
    miniStar.style.setProperty('--rotation', `${rotation}deg`);

    setTimeout(() => miniStar.remove(), duration * 1000);
  };

  return (
    <>
      <button
        ref={starRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`text-[var(--color-text)] items-center flex gap-2 cursor-pointer active:scale-95 transition-all duration-150 relative overflow-hidden ${
          isActive
            ? 'bg-[#493f2a] text-yellow-400 hover:brightness-125'
            : 'text-yellow-400 bg-[#1e1e1e]'
        }`}
        style={{
          padding: '3px 12px',
          borderRadius: '20px',
          height: '25px',
          minWidth: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <span
          className={`text-lg relative z-10 transition-all duration-150 ${
            isActive ? 'drop-shadow-[0_0_8px_rgba(255,173,51,0.6)]' : ''
          }`}
        >
          <img src={Star} alt='Star' className='w-3 h-3' />
        </span>
        <span className='text-white text-[10px]'>{totalStars}</span>
      </button>

      {showModal && (
        <div
          className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50'
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(false);
          }}
        >
          <div className='bg-[#2c2c2c] p-5 rounded-2xl text-white w-64 shadow-lg'>
            <h3 className='text-lg font-semibold mb-3 text-center'>
              Choose stars ✨
            </h3>
            <input
              type='range'
              min='1'
              max='10'
              value={starCount}
              onChange={(e) => setStarCount(Number(e.target.value))}
              className='w-full accent-yellow-400 mb-2'
            />
            <p className='text-center mb-3'>Stars: {starCount}</p>
            <div className='flex justify-center gap-3'>
              <button
                onClick={() => setShowModal(false)}
                className='bg-gray-600 px-3 py-1 rounded-md hover:bg-gray-500 transition'
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className='bg-yellow-500 text-black px-3 py-1 rounded-md hover:bg-yellow-400 transition'
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
