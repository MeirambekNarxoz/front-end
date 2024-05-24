import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getFilmByID, Addcomment, getUserByID, getAllComments, deleteComment } from "../api"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';

export default function FilmItem() {
    const { filmId } = useParams();
    const [film, setFilm] = useState(null);
    const [comment, setComment] = useState("");
    const [user, setUser] = useState(null);
    const [comments, setComments] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [lastName, setLastName] = useState(""); // Состояние для хранения фамилии пользователя

    useEffect(() => {
        const fetchFilm = async () => {
            try {
                const filmData = await getFilmByID(filmId);
                setFilm(filmData);
            } catch (error) {
                console.error("Error fetching film data:", error);
            }
        };

        fetchFilm();
    }, [filmId]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const commentsData = await getAllComments(filmId); 
                setComments(commentsData); 
            } catch (error) {
                console.error("Error fetching comments data:", error);
            }
        };
    
        fetchComments();
    }, [filmId]); 
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const userData = jwtDecode(token);
            setCurrentUser(userData);
        }
    }, []);
    
    const handleAddComment = async () => {
        try {
            if (comment.trim() === "") {
                console.error("Comment cannot be empty");
                return;
            }
    
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("Token not found. User must be authenticated.");
                return;
            }
    
            const userData = jwtDecode(token);
    
            const newCommentData = {
                userId: userData.ID,
                filmId: filmId,
                commentary: comment
            };
            await Addcomment(newCommentData);
    
            // Получение последнего добавленного комментария из API
            const latestComment = await getAllComments(filmId);

            // Добавление последнего комментария в state
            setComments(latestComment);

            // Очистка поля комментария после добавления
            setComment(""); 
        } catch (error) {
            console.error("Error while adding comment:", error);
        }
    };
    
    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            const updatedComments = comments.filter(comment => comment.id !== commentId);
            setComments(updatedComments);
            console.log("Comment deleted successfully");
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };
    if (!film) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-fluid bg-dark text-white py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card bg-secondary text-white">
                        <div className="card-header">
                            <img src={`data:image/jpeg;base64, ${film.imageData}`} width="384" height="488" alt={film.title} />
                            <h2 className="mb-0">{film.title}</h2>
                        </div>
                        <div className="card-body">
                            <p className="card-text">Title: {film.title}</p>
                            <p className="card-text">Director: {film.director}</p>
                            <p className="card-text">Release Date: {film.release_date}</p>
                            <p className="card-text">Description: {film.descrip}</p>
                            <p className="card-text">Genres: {film.genres && film.genres.join(', ')}</p>
                        </div>
                        <div>
                            {/* Display comments */}
                            <h3>Comments:</h3>
                            <div className="comment-container">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="comment">
                                        <div className="comment-header">
                                            <h3 className="comment-author">{comment.user.lastname}</h3>
                                        </div>
                                        <p className="comment-content">{comment.commentary}</p>
                                        <button className="delete-comment-button" onClick={() => handleDeleteComment(comment.id)}>Delete {comment.id}</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} />
                            <button onClick={handleAddComment}>Add Comment</button>
                        </div>
                    </div>
                    <Link to="/Profile" className="btn btn-info">Back</Link>
                </div>
            </div>
        </div>
    );
}
