import React, { Component } from "react";

const Navbar = (props) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="collapse navbar-collapse" id="navbarColor03">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            Clients
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">
                            Facture
                        </a>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a href="#" className="nav-link">
                            Inscription
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="btn btn-success">
                            Connexion
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="#" className="btn btn-danger">
                            Déconnexion
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
