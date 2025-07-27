import axios from 'axios';

export default axios.create({
    baseURL: 'https://e25fa662b590.ngrok-free.app',
    headers: {"ngrok-skip-browser-warning": "true"}
});