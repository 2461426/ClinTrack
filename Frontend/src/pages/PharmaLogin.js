
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import pharmaLoginAnimation from '../assets/animations/pharmaLoginAnimation.json';
import { useFormik } from 'formik';

function PharmaLogin({ onLogin }) {
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState('');
    const [pharmaAccounts, setPharmaAccounts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch pharma details from API
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
        <div className='flex items-center justify-center min-h-screen p-4'>
            <div className='flex flex-col items-center '>
                <div className='flex flex-col items-start gap-4 sm:gap-6 w-full max-w-6xl'>
                <div className='flex flex-col items-start text-left'>
                    <h1 className='text-2xl sm:text-3xl font-light'>Login to</h1>
                    <h1 className='text-3xl sm:text-4xl font-bold text-indigo-500'>Start creating trails...</h1>
                </div>

                <div className='w-auto h-auto border rounded-[25px]'>
                    <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                        <Lottie animationData={pharmaLoginAnimation} className='h-[200px] md:h-[300px] w-auto' />
                        <div className='hidden md:block h-[250px] w-0.5 bg-gray-200 -mx-4 flex-none'></div>

                        <form onSubmit={formik.handleSubmit} className='relative z-10 w-full md:w-auto'>
                            <div className='flex flex-col items-start p-4 sm:p-6 gap-4 w-full'>
                                {/* Email */}
                                <div className='flex flex-col gap-1 items-start w-full'>
                                    <h1 className='text-sm sm:text-md font-semibold'>Email ID</h1>
                                    <input
                                        type="text"
                                        placeholder='Enter Email'
                                        className='border w-full md:w-64 h-11 pl-4 rounded-lg border-gray-300 focus:outline-none'
                                        {...formik.getFieldProps('email')}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <span className='text-red-500 font-regular text-xs'>{formik.errors.email}</span>
                                    )}
                                </div>

                                {/* Password with Show/Hide toggle */}
                                <div className='flex flex-col gap-1 items-start w-full'>
                                    <h1 className='text-sm sm:text-md font-semibold'>Password</h1>
                                    <div className="relative w-full md:w-64">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder='Enter Password'
                                            className='border w-full h-11 pl-4 pr-12 rounded-lg border-gray-300 focus:outline-none'
                                            {...formik.getFieldProps('password')}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm px-2 py-1"
                                            onClick={() => setShowPassword(prev => !prev)}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            aria-pressed={showPassword}
                                        >
                                            {showPassword ? 'Hide' : 'Show'}
                                        </button>
                                    </div>
                                    {formik.touched.password && formik.errors.password && (
                                        <div className='text-red-500 font-regular text-xs'>{formik.errors.password}</div>
                                    )}
                                </div>

                                {authError && <div className='text-red-500 text-sm'>{authError}</div>}

                                <button
                                    type="submit"
                                    className='w-full bg-indigo-500 font-semibold text-white px-4 py-2 rounded-lg hover:bg-indigo-600'
                                >
                                    Login
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
                <button onClick={() => navigate('/LoginAs')} className='border font-regular text-gray-500 px-4 py-2 rounded-full hover:bg-indigo-500 hover:text-white w-full sm:w-auto' >Go Back</button>
            </div>
            </div>
        </div>
    )
}

export default PharmaLogin
