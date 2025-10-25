import { $authHost } from '.';

export const getUser = async (userId) => {
  try {
    const response = await $authHost.get(`/api/users/${userId}`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getAllUsers = async (search) => {
  try {
    const response = await $authHost.get('/api/users', {
      params: { search },
      withCredentials: true,
    });
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const followUser = async (userId) => {
  try {
    const response = await $authHost.post(`/api/users/${userId}/follow`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const unfollowUser = async (userId) => {
  try {
    const response = await $authHost.delete(`/api/users/${userId}/unfollow`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getFollowing = async (userId) => {
  try {
    const response = await $authHost.get(`/api/users/${userId}/following`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getFollowers = async (userId) => {
  try {
    const response = await $authHost.get(`/api/users/${userId}/followers`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await $authHost.patch(`/api/users/${userId}`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const uploadAvatar = async (avatarFile) => {
  try {
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    const response = await $authHost.patch(`/api/users/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const giveStarToUser = async (stars) => {
  try {
    const response = await $authHost.post(`/api/users/stars`, {
      stars,
    });
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getUserStars = async (userId) => {
  try {
    const response = await $authHost.get(`/api/users/${userId}/stars`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
