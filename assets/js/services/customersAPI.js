import axios from 'axios';

function findAll() {
    return axios
        .get(`https://127.0.0.1:8000/api/customers`, {})
        .then((response) => response.data["hydra:member"]);
}

function find(id) {
    return axios
        .get(`https://127.0.0.1:8000/api/customers/${id}`)
        .then((response) => response.data);
}

function deleteCustomer(id) {
    return axios
        .delete(`https://127.0.0.1:8000/api/customers/${id}`, {});
}

function update(id, customer) {
    return axios
        .put(`https://127.0.0.1:8000/api/customers/${id}`, customer)
        .then((response) => console.log(response.data));
}

function create(customer) {
    return axios.post(
        `https://127.0.0.1:8000/api/customers`,
        customer
    );
}

export default {
    findAll,
    find,
    delete: deleteCustomer,
    update
}