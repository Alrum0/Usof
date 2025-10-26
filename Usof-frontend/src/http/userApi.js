import { $authHost, $host } from '.';

export const getUser = async (userId) => {
  try {
    // public endpoint — use unauthenticated host to avoid forcing auth refresh
    const response = await $host.get(`/api/users/${userId}`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getAllUsers = async (search) => {
  try {
    // public search — don't use the auth axios instance to prevent 401-triggered redirects
    const response = await $host.get('/api/users', {
      params: { search },
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

export const getUserComments = async (userId) => {
  try {
    const response = await $host.get(`/api/users/${userId}/comments`);
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
