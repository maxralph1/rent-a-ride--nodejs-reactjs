import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '@/api/axios';
import { Link } from "react-router-dom";

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/auth/register';

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState(false);
    const [usernameFocus, setUsernameFocus] = useState(false);

    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);

    const [confirmPassword, setConfirmPassword] = useState('');
    const [validConfirm, setValidConfirm] = useState(false);
    const [confirmFocus, setConfirmFocus] = useState(false);

    const [account_type, setAccountType] = useState('');

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidUsername(USERNAME_REGEX.test(username));
    }, [username])

    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password));
        setValidConfirm(password === confirmPassword);
    }, [password, confirmPassword])

    useEffect(() => {
        setErrMsg('');
    }, [email, username, password, confirmPassword])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = EMAIL_REGEX.test(email);
        const v2 = USERNAME_REGEX.test(username);
        const v3 = PASSWORD_REGEX.test(password);
        if (!v1 || !v2 || !v3) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                // JSON.stringify({ first_name, last_name, username, email, password }),
                JSON.stringify({ first_name, last_name, email, username, password, account_type }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // // TODO: remove console.logs before deployment
            // console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            setEmail('');
            setUsername('');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            console.log(err)
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="first_name">
                            First Name:
                        </label>
                        <input
                            type="text"
                            id="first_name"
                            ref={userRef}
                            autoComplete="on"
                            onChange={(e) => setFirstName(e.target.value)}
                            value={first_name}
                            required
                            aria-describedby="first_name"
                        />


                        <label htmlFor="last_name">
                            Last Name:
                        </label>
                        <input
                            type="text"
                            id="last_name"
                            autoComplete="on"
                            onChange={(e) => setLastName(e.target.value)}
                            value={last_name}
                            required
                            aria-describedby="last_name"
                        />


                        <label htmlFor="email">
                            Email:
                            <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="email"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required 
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="email" 
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <p id="email" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must be an email.<br />
                        </p>


                        <label htmlFor="username">
                            Username:
                            <FontAwesomeIcon icon={faCheck} className={validUsername ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validUsername || !username ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="username"
                            autoComplete="off"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            required
                            aria-invalid={validUsername ? "false" : "true"}
                            aria-describedby="username"
                            onFocus={() => setUsernameFocus(true)}
                            onBlur={() => setUsernameFocus(false)}
                        />
                        <p id="username" className={usernameFocus && username && !validUsername ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>


                        <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPassword ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            aria-invalid={validPassword ? "false" : "true"}
                            aria-describedby="password"
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                        />
                        <p id="password" className={passwordFocus && !validPassword ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>


                        <label htmlFor="confirm_password">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validConfirm && confirmPassword ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validConfirm || !confirmPassword ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            required
                            aria-invalid={validConfirm ? "false" : "true"}
                            aria-describedby="confirm"
                            onFocus={() => setConfirmFocus(true)}
                            onBlur={() => setConfirmFocus(false)}
                        />
                        <p id="confirm" className={confirmFocus && !validConfirm ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must confirm the first password input field.
                        </p>

                        <div className="space-y-2 pt-1">
                            <select className="w-full content-center text-base px-4 py-1 border border-gray-300 rounded focus:outline-none focus:border-yellow-400" onChange={(e) => setAccountType(e.target.value)}>
                            <option>Select account type </option>
                            <option value="individual">Individual</option>
                            <option value="enterprise">Business</option>
                            </select>
                        </div>


                        <button disabled={!validUsername || !validPassword || !validConfirm ? true : false}>Sign Up</button>
                    </form>
                    <p>
                        Already registered?<br />
                        <span className="">
                            <Link to="/">Sign In</Link>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Register
