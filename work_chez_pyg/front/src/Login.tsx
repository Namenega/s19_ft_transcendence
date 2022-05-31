import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';


const Login = (props: any) => {

    const axios = require('axios').default;

    const { setIsLoggedIn } = props;

    const [searchParams] = useSearchParams()

    let AUTH_CODE = searchParams.get('code');

    useEffect(() => {
        if (AUTH_CODE)
        {
            const data = new FormData();

            data.append('grant_type', 'authorization_code');
            data.append('client_id', '4fdbf2cda36c892bc525ad74e2b75188d936e8750b098515903aaf7e8a511daf');
            data.append('client_secret', 'ed1533e5bc5827832dd37bab7a4eb050b831b07e868d4475e47bd88e13197432');
            data.append('code', AUTH_CODE);
            data.append('redirect_uri', 'http://localhost:3000');

            axios.post('https://api.intra.42.fr/oauth/token', data)
            .then(function (response: any) {
                setIsLoggedIn(response.data.access_token)
                console.log(response.data.access_token);
            })
            .catch(function (error: any) {
                console.log(error);
            });
        }
    }, [AUTH_CODE])


    const loginWithApi = async () => {
        window.location.href = "https://api.intra.42.fr/oauth/authorize?client_id=4fdbf2cda36c892bc525ad74e2b75188d936e8750b098515903aaf7e8a511daf&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code"
    }

    return (
        <div className='login-main-ctn' style={{backgroundImage:"url('./img/main-bg.jpg')"}}>
            <div className='login-ctn'>
                <h2 className='login-title'>Welcome to my transcendence</h2>
                <p>I am the best pong player</p>
                <Button variant='contained' size='large' onClick={() => loginWithApi()}> 
                    Log with 42
                </Button>
            </div>
        </div>
    )
}

export default Login