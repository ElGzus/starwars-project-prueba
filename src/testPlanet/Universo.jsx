import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import CardUniverso from './CardUniverso';
import PaginacionUniverso from './PaginacionUniverso';
import { useNavigate } from "react-router";
import { auth } from "../firebase/config";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default function Universo() {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUsername(user.email);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                setUsername("");
                navigate("/");
            })
            .catch((err) => {
                alert(err.message);
            });
    };

    const [planetas, setPlanetas] = useState([]);
    const [info, setInfo] = useState([]);
    const [favoritos, setFavoritos] = useState([]);

    const url1 = 'https://swapi.dev/api/planets/';

    const fetchPlanetas = async (url) => {
        let response = await fetch(url)
        let data = await response.json()
        setPlanetas(data.results);
        setInfo(data)
    }

    const onPrevious = () => {
        fetchPlanetas(info.previous);
    }

    const onNext = () => {
        fetchPlanetas(info.next);
    }

    useEffect(() => {
        fetchPlanetas(url1);
        const storedFavoritos = localStorage.getItem('favoritos');
        if (storedFavoritos) {
            setFavoritos(JSON.parse(storedFavoritos));
        }
    }, [])

    const toggleFavorito = (planeta) => {
        const index = favoritos.findIndex(p => p.name === planeta.name);
        if (index === -1) {
            const newFavoritos = [...favoritos, planeta];
            setFavoritos(newFavoritos);
            localStorage.setItem('favoritos', JSON.stringify(newFavoritos));
        } else {
            const newFavoritos = favoritos.filter((_, i) => i !== index);
            setFavoritos(newFavoritos);
            localStorage.setItem('favoritos', JSON.stringify(newFavoritos));
        }
    };

    console.log(info)
    return (
        <>
            <div>
            <nav className="navbar navbar-expand-lg mb-5">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/src/principal/HomePage.jsx">
                            Bienvenido {username || "Invitado"}
                        </Link>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/src/Characters/Personajes.jsx">
                                        Personajes
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/src/testPlanet/Universo.jsx">
                                        Planetas
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/src/Movies/Peliculas.jsx">
                                        Películas
                                    </Link>
                                </li>
                            </ul>
                            <button className="btn btn-danger" onClick={handleSignOut}>
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </nav>
            </div>
            <PaginacionUniverso previous={info.previous} next={info.next} onPrevious={onPrevious} onNext={onNext} />
            <CardUniverso planetas={planetas} toggleFavorito={toggleFavorito} />
        </>
    )
}
