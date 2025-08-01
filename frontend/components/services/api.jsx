import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);





export const getUsers = async () => {
    return api.get("account/");
};

export const getUserProfile = async (username) => {
    return api.get(`profile/${username}/`);
};

export const getCommentCount = async (postId) => {
    return api.get(`posts/${postId}/comment_count/`);
};

export const getConnectedUser = async () => {
    return api.get("connected-user/");
};

export const searchUsers = async (query) => {
    return api.get(`search/?q=${query}`);
};

export const postComment = async (postId, commentData) => {
  const token = localStorage.getItem("access_token");

  return axios.post(
    `${API_BASE_URL}/posts/${postId}/posting_comment/`,
    commentData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const getCommentsList = async () => {
    return api.get("commentsList/");
};

export const createPost = async (postData) => {
    return api.post("postsList/", postData);
};

export const getPost = async (postId) => {
    return api.get(`postsList/${postId}/`);
};

export const getAllPosts = async () => {
    return api.get("postsList/");
};

export const updatePost = async (postId, postData) => {
    return api.put(`posts/${postId}/`, postData);
};

export const deletePost = async (postId) => {
    return api.delete(`posts/${postId}/`);
};

export const getUserPosts = async () => {
    return api.get("user-posts/");
};

export const followUser = async (username) => {
  const token = localStorage.getItem("access_token");

  return api.post(
    `user/${username}/follow/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};



export const getFollowers = async () => {
    return api.get("account/followers/");
};

export const getFollowing = async () => {
    return api.get("user/followed-users/");
};

export const getMessages = async (recipientId) => {
    return api.get(`chat/messages/${recipientId}/`);
};

export const sendPrivateMessage = async (messageData) => {
    return api.post("chat/messages/", messageData);
};

export const checkPostLike = async (postId) => {
    return api.get(`check-like/${postId}/`);
};

export const likePost = async (postId) => {
    return api.post(`http://localhost:8080/Home/${postId}/like/`);
};

export const getRecommendedPosts = async () => {
    return api.get("recommendations/");
};


export const updateUserProfile = async (data) => {
    const response = await axios.put(
        "http://localhost:8080/api/account/update/",
        data,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
        }
    );
    return response;
};


export const getChatUsers = async () => {
  return api.get("chat/users/");
};

export const loginUser = async (username, password) => {
  try {
    const { data } = await axios.post(
      "http://localhost:8080/api/token/",
      { username, password },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    return data;
  } catch (error) {
    throw new Error("Invalid credentials, please try again.");
  }
};



export const logoutUser = async (refreshToken, accessToken) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}account/logout/`,
      { refresh_token: refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );

    return response.status;
  } catch (error) {
    throw new Error('Logout failed. Please try again.');
  }
};

export const registerUser = async (formData) => {
  try {
    const response = await axios.post(`http://localhost:8080/api/register/`, formData, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    });

    return response.data;
    } catch (error) {
      console.error(" Erreur complète :", error.response || error);
      throw new Error(error.response?.data?.error || "Registration failed.");
    }

};

export default api;
