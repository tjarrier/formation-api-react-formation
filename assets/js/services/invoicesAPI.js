import axios from 'axios';
import {
    INVOICES_URL
} from '../config';

function findAll() {
    return axios
        .get(INVOICES_URL, {})
        .then((response) => response.data["hydra:member"]);
}

function find(id) {
    return axios
        .get(`${INVOICES_URL}/${id}`)
        .then((response) => response.data);
}

function deleteInvoice(id) {
    return axios
        .delete(`${INVOICES_URL}/${id}`, {});
}

function update(id, invoice) {
    return axios.put(`${INVOICES_URL}/${id}`, {
        ...invoice,
        customer: `/api/customers/${invoice.customer}`,
    });
}

function create() {
    return axios.post(INVOICES_URL, {
        ...invoice,
        customer: `/api/customers/${invoice.customer}`,
    });
}

export default {
    findAll,
    find,
    delete: deleteInvoice,
    update,
    create
}