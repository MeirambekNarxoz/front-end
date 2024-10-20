import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { getFilmByID, Addcomment, getAllComments, deleteComment } from "../api"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import {jwtDecode} from 'jwt-decode';
import '../css/FilmsItem.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

export default function FilmItem() {
    const { filmId } = useParams();
    const [film, setFilm] = useState(null);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const videoRef = useRef(null);

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
            try {
                const userData = jwtDecode(token);
                setCurrentUser(userData);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);
    
    const handleAddComment = async () => {
        try {
            if (comment.trim() === "") {
                console.error("Comment cannot be empty");
                return;
            }

            if (!currentUser) {
                console.error("User must be authenticated.");
                return;
            }
    
            const newCommentData = {
                userId: currentUser.ID,
                filmId: filmId,
                commentary: comment
            };

            await Addcomment(newCommentData);
    
            const latestComments = await getAllComments(filmId);
            setComments(latestComments);
            setComment(""); 
        } catch (error) {
            console.error("Error while adding comment:", error);
        }
    };
    
    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            setComments(comments.filter(comment => comment.id !== commentId));
            console.log("Comment deleted successfully");
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleSkip = (direction) => {
        if (videoRef.current) {
            const newTime = direction === 'forward' ? videoRef.current.currentTime + 10 : videoRef.current.currentTime - 10;
            videoRef.current.currentTime = Math.max(0, newTime);
        }
    };

    if (!film) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-fluid bg-dark text-white py-5">
               <header className="masthead text-white text-center">
        <NotificationContainer/>
        {window.history.replaceState({},"")}
      </header>
            <div className="background-animation"></div>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="film-item-container text-white">
                        <div className="card-header text-center">
                            <img src={`data:image/jpeg;base64, ${film.imageData}`} className="img-fluid" alt={film.title} />
                            <h2 className="mb-0">{film.title}</h2>
                        </div>
                        <div className="card-body">
                            <p className="card-text">Title: {film.title}</p>
                            <p className="card-text">Director: {film.director}</p>
                            <p className="card-text">Release Date: {film.release_date}</p>
                            <p className="card-text">Description: {film.descrip}</p>
                            <p className="card-text">Genres: {film.genres && film.genres.join(', ')}</p>
                        </div>
                        <div className="card-footer">
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={comment} 
                                    onChange={(e) => setComment(e.target.value)} 
                                    placeholder="Add a comment"
                                />
                                <button className="btn btn-primary" onClick={handleAddComment}>Add Comment</button>
                            </div>
                        </div>
                    </div>
                    <div className="card mb-4">
                        <div className="card-header bg-primary text-white">Film Video</div>
                        <div className="card-body text-dark">
                            {film.videoData ? (
                                <>
                                    <video ref={videoRef} width="100%" controls>
                                        <source src={`data:video/mp4;base64,${film.videoData}`} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                    <div className="mt-3">
                                        <button className="btn btn-secondary mr-2" onClick={() => handleSkip('backward')}>-10s</button>
                                        <button className="btn btn-secondary" onClick={() => handleSkip('forward')}>+10s</button>
                                    </div>
                                </>
                            ) : (
                                <p>No video available for this film.</p>
                            )}
                        </div>
                    </div>
                    <Link to="/Profile" className="btn btn-info mt-3">Back</Link>
                </div>
                <div className="col-md-4">
                    <div className="comments-section">
                        <h3>Comments:</h3>
                        <div className="comment-container">
                            {comments.map((comment) => (
                                <div key={comment.id} className="comment">
                                    <div className="comment-header">
                                        <h5 className="comment-author">{comment.user.lastname}</h5>
                                        {currentUser?.ID === comment.user.id && (
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                        )}
                                    </div>
                                    <p className="comment-content">{comment.commentary}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
