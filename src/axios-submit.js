import axios from 'axios'

const instance = axios.create({
    baseURL:'https://speech-reco-93bb6-default-rtdb.firebaseio.com/'
});

export default instance;