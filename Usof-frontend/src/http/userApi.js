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
