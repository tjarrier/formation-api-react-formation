import axios from "axios";
import jwtDecode from "jwt-decode";

/**
 * Requête HTTP d'authentification et stockage du token dans le localStorage et axios
 * @param {object} credentials 
 */
function authenticate(credentials) {
    return axios
        .post(`https://127.0.0.1:8000/api/login_check`, credentials)
        .then((response) => response.data.token)
        .then((token) => {
            // Je stocke le token dans mon localStorage
            window.localStorage.setItem("authToken", token);

            // On prévient Axios qu'on a maintenant un header par defaut sur toutes nos futures requêtes HTTP
            setAxiosToken(token);
            return true;
        });
}

/**
 * Déconnexion (suppression du token du localStorage et de axios)
 */
function logout() {
    // Je stocke le token dans mon localStorage
    window.localStorage.removeItem("authToken");
    // On prévient Axios qu'on a maintenant un header par defaut sur toutes nos futures requêtes HTTP
    delete axios.defaults.headers["Authorization"];
}

/**
 * Positionne le token JWT sur axios
 * @param {string} token Le token JWT
 */
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = `Bearer ${token}`;
}

/**
 * Mise en place lors du chargement de l'application
 */
function setup() {
    // 1. Voir si on a un token
    const token = window.localStorage.getItem("authToken");
    // 2. Si le token est encore valide
    if (token) {
        const {
            exp: expiration
        } = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        }
    }
    // 3. Donner le token à axios
}

/**
 * Permet de savoir si on est authentifié ou pas
 * @returns boolean
 */
function isAuthenticated() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
        const {
            exp: expiration
        } = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            return true;
        }
    }
    return false;
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated,
};