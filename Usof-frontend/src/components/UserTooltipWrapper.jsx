import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import UserTooltip from './UserTooltip';
import UnfollowModel from './UnfollowModel';
import { followUser, getFollowing, unfollowUser } from '../http/userApi';
import { useNotification } from '../context/NotificationContext';

export default function UserTooltipWrapper({ userData, isVisible, onClose }) {
  const [isUnfollowOpen, setIsUnfollowOpen] = useState(false);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const userId = useSelector((state) => state.auth.user.id);

  const tooltipRef = useRef(false);
  const unfollowMenuRef = useRef(false);

  useEffect(() => {
    const fetchFollow = async () => {
      try {
        setLoading(true);
        const res = await getFollowing(userId);
        setFollowing(res.data.some((u) => u.id === Number(userData.authorId)));
      } catch (err) {
        showNotification(
          err?.response?.data?.message || 'Error fetching follow'
        );
      } finally {
        setLoading(false);
      }
    };

    if (isVisible && userData?.authorId) {
      fetchFollow();
    }
  }, [userId, userData?.authorId, isVisible]);

  const handleFollow = async () => {
    try {
      const response = await followUser(userData.authorId);
      showNotification(response.data.message);
      setFollowing(true);
    } catch (err) {
      showNotification(err?.response?.data?.message || 'Error follow user');
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await unfollowUser(userData.authorId);
      showNotification(response.data.message);
      setFollowing(false);
      setIsUnfollowOpen(false);
      onClose?.();
    } catch (err) {
      showNotification(err?.response?.data?.message || 'Error unfollow user');
    }
  };

  const handleTooltipMouseEnter = () => {
    tooltipRef.current = true;
  };

  const handleTooltipMouseLeave = () => {
    tooltipRef.current = false;

    setTimeout(() => {
      if (!tooltipRef.current && !isUnfollowOpen) {
        onClose?.();
      }
    }, 300);
  };

  const handleOpenUnfollow = () => {
    setIsUnfollowOpen(true);
  };

  const handleCloseUnfollow = () => {
    setIsUnfollowOpen(false);

    onClose?.();
  };

  const shouldShowTooltip = isVisible && !isUnfollowOpen;

  return (
    <>
      <UserTooltip
        userData={userData}
        onMouseEnter={handleTooltipMouseEnter}
        onMouseLeave={handleTooltipMouseLeave}
        following={following}
        loading={loading}
        onFollow={handleFollow}
        onOpenUnfollow={handleOpenUnfollow}
        isVisible={shouldShowTooltip}
      />

      <UnfollowModel
        isOpen={isUnfollowOpen}
        onClose={handleCloseUnfollow}
        userData={userData}
        handleUnfollow={handleUnfollow}
      />
    </>
  );
}
