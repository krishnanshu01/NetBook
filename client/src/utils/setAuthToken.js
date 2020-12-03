import axios from 'axios';

const setAuthToken = token => {
    if(token){
        axios.defaults.headers.common['x-auth-token'] = token;
        
    }else{
        delete axios.defaults.headers.common['x-auth-token']
    }
}

export default setAuthToken;

// this is just to check if we have a token or not and send the token to other files where it is required