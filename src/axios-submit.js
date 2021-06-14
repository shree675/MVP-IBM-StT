import axios from 'axios'

const instance = axios.create({
    baseURL:'https://speech-to-text-cl-default-rtdb.firebaseio.com/'
});

export default instance;