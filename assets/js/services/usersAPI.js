import axios from 'axios';
import {
    USERS_URL
} from '../config';

function register(user) {
    return axios.post(
        USERS_URL,
        user
    );
}

export default {
    register
}