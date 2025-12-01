import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

// Validation Schema
const schema = yup.object().shape({
    fullName: yup.string().required('Full Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().matches(/^[0-9]{10,15}$/, 'Invalid phone number').required(),
    nationalId: yup.string().matches(/^[0-9]{10}$/, 'National ID must be 10 digits').required(),
    dob: yup.date().required('Date of birth is required'),
    password: yup.string().min(6).required('Password is required'),
    idFront: yup.mixed().required('ID Front is required'),
    idBack: yup.mixed().required('ID Back is required'),
});

const VoterRegister = () => {
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('fullName', data.fullName);
            formData.append('email', data.email);
            formData.append('phone', data.phone);
            formData.append('nationalId', data.nationalId);
            formData.append('dob', data.dob);
            formData.append('password', data.password);
            formData.append('idFront', data.idFront[0]);
            formData.append('idBack', data.idBack[0]);

            await axios.post('http://localhost:5000/api/voters/register', formData);

            setSuccessMsg('Registered successfully! Redirecting to login...');
            setErrorMsg('');
            reset();

            setTimeout(() => navigate("/login"), 1500);

        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Something went wrong');
            setSuccessMsg('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

                {successMsg && <p className="bg-green-100 text-green-700 p-2 mb-4 rounded">{successMsg}</p>}
                {errorMsg && <p className="bg-red-100 text-red-700 p-2 mb-4 rounded">{errorMsg}</p>}

                {/* Full Name */}
                <input
                    type="text"
                    placeholder="Full Name"
                    {...register('fullName')}
                    className="w-full p-3 rounded-lg border mb-2"
                />
                <p className="text-red-600 text-sm mb-2">{errors.fullName?.message}</p>

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email"
                    {...register('email')}
                    className="w-full p-3 rounded-lg border mb-2"
                />
                <p className="text-red-600 text-sm mb-2">{errors.email?.message}</p>

                {/* Phone */}
                <input
                    type="text"
                    placeholder="Phone"
                    {...register('phone')}
                    className="w-full p-3 rounded-lg border mb-2"
                />
                <p className="text-red-600 text-sm mb-2">{errors.phone?.message}</p>

                {/* National ID */}
                <input
                    type="text"
                    placeholder="National ID"
                    {...register('nationalId')}
                    className="w-full p-3 rounded-lg border mb-2"
                />
                <p className="text-red-600 text-sm mb-2">{errors.nationalId?.message}</p>

                {/* DOB */}
                <input
                    type="date"
                    {...register('dob')}
                    className="w-full p-3 rounded-lg border mb-2"
                />
                <p className="text-red-600 text-sm mb-2">{errors.dob?.message}</p>

                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    {...register('password')}
                    className="w-full p-3 rounded-lg border mb-2"
                />
                <p className="text-red-600 text-sm mb-2">{errors.password?.message}</p>

                {/* ID Front */}
                <input
                    type="file"
                    {...register('idFront')}
                    className="w-full mb-2"
                />
                <p className="text-red-600 text-sm mb-2">{errors.idFront?.message}</p>

                {/* ID Back */}
                <input
                    type="file"
                    {...register('idBack')}
                    className="w-full mb-2"
                />
                <p className="text-red-600 text-sm mb-2">{errors.idBack?.message}</p>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition`}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default VoterRegister;
