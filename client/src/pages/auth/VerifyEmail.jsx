import { useState, useEffect } from "react";
import axios from '@/api/axios';
import { Link, useParams } from "react-router-dom";
// import { useNavigate, useParams } from 'react-router-dom'


const VerifyEmail = () => {
    // const userRef = useRef();
    // const errRef = useRef();
    // const params = useParams()
    const { username, token } = useParams();

    console.log(useParams())

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const sendVerifyRequest = async () => {
        try {
            const response = await axios.post(`/auth/verify-email/${username}/${token}`,
            // const response = await fetch(`http://localhost:5000/api/v1/auth/verify-email/${username}/${token}`,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                    // method: "POST",
                }
            );
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg(err.response);
            } else {
                setErrMsg('Verification failed')
            }
            console.log(err)
            errRef.current.focus();
        }
    }

    useEffect(() => {
        sendVerifyRequest();
    }, [])



    return (
        <>
            {success ? (
                <section>
                    <h1>Email Verified!</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (
                <section>
                    <h1>Verification failed!</h1>

                    <p>
                        {errMsg}
                    </p>
                    <p>
                        <a href="#">Sign Up</a>
                    </p>
                </section>
            )}
        </>
    )
}

export default VerifyEmail
