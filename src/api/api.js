import axios from 'axios';

export default axios.create({
    baseURL: 'https://gestor-tcc-iff-api.herokuapp.com/',
});