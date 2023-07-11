import { useRef, useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useInput from '@/hooks/useInput';
import useToggle from '@/hooks/useToggle';

import axios from '@/api/axios';
const LOGIN_URL = '/auth/login';

const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/dashboard';

    const userRef = useRef();
    const errRef = useRef();

    const [user, resetUser, userAttribs] = useInput('user', '')
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [check, toggleCheck] = useToggle('persist', false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, password])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ username_email: user, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            // console.log(accessToken, roles);
            setAuth({ user, password, roles, accessToken });
            resetUser();
            setPassword('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            console.log(err);
            errRef.current.focus();
        }
    }

    return (
        <section>
            <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'>{errMsg}</p>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor='username_email'>Username/Email:</label>
                <input
                    type='text'
                    id='username_email'
                    name='username_email'
                    ref={userRef} 
                    className=''
                    autoComplete='off'
                    {...userAttribs}
                    required
                />

                <label htmlFor='password'>Password:</label>
                <input
                    type='password'
                    id='password'
                    name='password' 
                    className=''
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                />
                <button>Sign In</button>
                <div className='persistCheck'>
                    <input
                        type='checkbox'
                        id='persist'
                        onChange={toggleCheck}
                        checked={check}
                    />
                    <label htmlFor='persist'>Stay logged in</label>
                </div>
            </form>
            <p>
                Need an Account?<br />
                <span className='line'>
                    <Link to='/register'>Sign Up</Link>
                </span>
            </p>
        </section>

    )
}

export default Login
