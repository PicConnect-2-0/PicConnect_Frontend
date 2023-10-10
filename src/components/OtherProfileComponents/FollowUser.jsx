import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function FollowUser({ targetUser }) {
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const currentUser = useSelector((state) => state.user.value);
  const [isLoading, setIsLoading] = useState(true); // Set loading state to true initially
  const [error, setError] = useState(null);

  useEffect(() => {
    const followStatus = async () => {
      if (targetUser && currentUser) {
        try {
          setIsLoading(true);
          setError(null);
          const isFollowing = await checkIsFollowingUser(currentUser?.id, targetUser);
          setIsFollowingUser(isFollowing);
        } catch (error) {
          setError('Error occurred while checking follow status.');
        } finally {
          setIsLoading(false); // Set loading state to false after API call
        }
      }
    };

    followStatus();
  }, [targetUser, currentUser]); // Include targetUser and currentUser in the dependency array

  async function checkIsFollowingUser(currentUserId, targetUserId) {
    if (currentUserId && targetUserId) {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/users/Following/${currentUserId}`;
        const response = await axios.get(url);
        const followingUsers = response.data?.following_id;
        const isFollowing = followingUsers?.some((user) => user?.id === targetUserId);
        return isFollowing;
      } catch (error) {
        console.error('Error occurred while fetching user data:', error);
        throw error; // Re-throw the error to handle it at a higher level if necessary
      }
    }
    return false; // Return false if either currentUserId or targetUserId is falsy
  }

  const followUser = async (id, followerID) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/${followerID}/addFollower/${id}`);
      if (response.status === 200) {
        setIsFollowingUser(true);
      }
      return response.data;
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  };

  const unfollowUser = async (id, followerID) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/users/${followerID}/deleteFollower/${id}`);
      if (response.status === 200) {
        setIsFollowingUser(false);
      }
      return response.data;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {isFollowingUser ? (
            <button className="px-6 py-2 bg-blue-500 text-white rounded-md text-sm" onClick={() => unfollowUser(currentUser?.uid ? currentUser?.uid : currentUser?.id, targetUser)}>
              Unfollow
            </button>
          ) : (
            <button className="px-6 py-2 bg-blue-500 text-white rounded-md text-sm" onClick={() => followUser(currentUser?.uid ? currentUser?.uid : currentUser?.id, targetUser)}>
              Follow
            </button>
          )}
        </div>
      )}
    </div>
  );
}
