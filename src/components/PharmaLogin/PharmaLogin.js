import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PharmaLogin.css';
import Lottie from 'lottie-react';
import pharmaLoginAnimation from '../../assets/animations/pharmaLoginAnimation.json';
import { useFormik } from 'formik';

function PharmaLogin({ onLogin }) {
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState('');
    const [pharmaAccounts, setPharmaAccounts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPharmaDetails = async () => {
            try {
                const response = await fetch('http://localhost:5000/pharmaDetails');
                const data = await response.json();
                setPharmaAccounts(data);
            } catch (error) {
                console.error('Error fetching pharma details:', error);
                setAuthError('Failed to load pharma accounts. Please make sure the server is running.');
            }
        };
        fetchPharmaDetails();
    }, []);

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        onSubmit: (values, { setSubmitting }) => {
            setAuthError('');
            const email = values.email.trim().toLowerCase();
            const password = values.password.trim();
            const matched = pharmaAccounts.find((pharma) =>
                pharma.email?.toLowerCase() === email && (pharma.password === password || pharma.Password === password)
            );

            if (matched) {
                const user = {
                    id: matched.pharmaId,
                    name: matched.name,
                    email: matched.email,
                    profilePicture: matched.profilePicture,
                };
                if (onLogin) {
                    onLogin(user);
                }
                alert('Login successful!');
                navigate('/ListedTrails');
            } else {
                setAuthError('Invalid email or password');
            }
            setSubmitting(false);
        },
        validate: (values) => {
            const errors = {};
            if (!values.email) {
                errors.email = 'Email Id is required';
            } else if (!/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(values.email)) {
                errors.email = 'Invalid email id';
            }
            if (!values.password) {
                errors.password = 'Password is required';
            } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(values.password)) {
                errors.password = 'Invalid password';
            }
            return errors;
        },
    });

    return (
        <div className='pharma-login-page'>
            <div className='pharma-login-container'>
                <div className='pharma-login-header'>
                    <h1 className='pharma-login-header__subtitle'>Login to</h1>
                    <h1 className='pharma-login-header__title'>Start creating trails...</h1>
                </div>

                <div className='pharma-login-card'>
                    <div className='pharma-login-card__content'>
                        <Lottie animationData={pharmaLoginAnimation} className='pharma-login-animation' />
                        <div className='pharma-login-divider'></div>

                        <form onSubmit={formik.handleSubmit} className='pharma-login-form'>
                            <div className='pharma-login-form__fields'>
                                <div className='pharma-login-field'>
                                    <h1 className='pharma-login-field__label'>Email ID</h1>
                                    <input
                                        type="text"
                                        placeholder='Enter Email'
                                        className='pharma-login-field__input'
                                        {...formik.getFieldProps('email')}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <span className='pharma-login-field__error'>{formik.errors.email}</span>
                                    )}
                                </div>

                                <div className='pharma-login-field'>
                                    <h1 className='pharma-login-field__label'>Password</h1>
                                    <div className="pharma-login-field__password-wrapper">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder='Enter Password'
                                            className='pharma-login-field__input'
                                            {...formik.getFieldProps('password')}
                                        />
                                        <button
                                            type="button"
                                            className="pharma-login-field__toggle-btn"
                                            onClick={() => setShowPassword(prev => !prev)}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            aria-pressed={showPassword}
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                    {formik.touched.password && formik.errors.password && (
                                        <div className='pharma-login-field__error'>{formik.errors.password}</div>
                                    )}
                                </div>

                                {authError && <div className='pharma-login-auth-error'>{authError}</div>}

                                <button
                                    type="submit"
                                    className='pharma-login-submit-btn'
                                >
                                    Login
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
                <button onClick={() => navigate('/LoginAs')} className='pharma-login-back-btn'>Go Back</button>
            </div>
        </div>
    )
}

export default PharmaLogin
