import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Home from "./components/Home"; // Assuming Home component exists
import Profile from "./components/Profile"; // Assuming Profile component exists
import Register from "./components/register"; // Assuming Register component exists
import GetAllUsers from "./components/Allusers"; // Assuming GetAllUsers component exists
import CreateFilm from "./components/CreateFilm"; // Assuming CreateFilm component exists
import CreateGenre from "./components/CreateGenre"; // Assuming CreateGenre component exists
import FilmsItem from "./components/FilmsItem";
import FilmItem from "./components/FilmItem";
import ADMIN from "./components/Admin";
import ProfileUser from "./components/ProfileUser";
import UpdateFilm from "./components/UpdateFilm"

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />}/>
                    
                <Route path='/Profile' element={<Profile />} />
                <Route path='/ProfileUser/:id' element={<ProfileUser/>} />
                <Route path='/ADMIN' element={<ADMIN />} />
                <Route path='/register' element={<Register />} />
                <Route path='/users' element={<GetAllUsers />} />
                <Route path='/films/:filmId' element={<FilmsItem />} />
                <Route path='/film/:filmId' element={<FilmItem />} />
                <Route path='/createfilms' element={<CreateFilm />} />
                <Route path='/creategenre' element={<CreateGenre />} />
                <Route path='/updatefilm/:filmId' element={<UpdateFilm />} />
            </Routes>
        </BrowserRouter>
    );
}
