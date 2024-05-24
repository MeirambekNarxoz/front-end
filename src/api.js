import axios from "axios";
// PERSON
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post('http://localhost:8080/api/login', credentials);
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}
// REGISTER
export const registerUser = async (userData) => {  
    try {
        const response = await axios.post('http://localhost:8080/api/register', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
}
// GET ALL USERS
export const getAllUsers = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/user');
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}
// GET ALL GenreS
export const getAllGenre = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/genre');
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

// GET ALL Films
export const getAllFilms = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/film');
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}
// DELETE USER
export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/user/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

// DELETE Genre
export const deleteGenre = async (genreId) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/genre/${genreId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

// DELETE Film
export const deleteFilm = async (filmId) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/film/${filmId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

// Create Films
export const CreateFilms = async (filmData, token) => {  
    try {
        const response = await axios.post('http://localhost:8080/api/film', filmData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

    // Create Films
export const CreateGenre = async (genre) => {  
    try {
        const response = await axios.post('http://localhost:8080/api/genre', genre);
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

// GET BY ID

export const getFilmByID = async (filmId ,filmData) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/film/${filmId}`,filmData);
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getUserByID = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/user/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getGenreByID = async (genreId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/genre/${genreId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}


export const createSubscription = async (subscriptionType) => {
    try {
        const response = await axios.post('http://localhost:8080/api/subscription', { type: subscriptionType });
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const updateUser = async (userId, userData) => {
    try {
        await axios.put(`http://localhost:8080/api/user/${userId}`, userData);
        const updatedUserData = await getUserByID(userId);
        return updatedUserData;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getFilmByGenre = async (genreId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/filmGanre/${genreId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching films by genre:", error);
        throw new Error("Failed to fetch films by genre");
    }
}

export const Addcomment = async (commentData) => {  
    try {
        const response = await axios.post('http://localhost:8080/api/comments', commentData);
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const getAllComments = async (filmId) => {
    try {
        const response = await axios.get(`http://localhost:8080/api/comments/${filmId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const deleteComment = async (filmId) => {
    try {
        const response = await axios.delete(`http://localhost:8080/api/comments/${filmId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}


