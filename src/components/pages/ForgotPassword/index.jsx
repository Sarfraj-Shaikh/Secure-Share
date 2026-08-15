import { message } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../SEO';

export const ForgotPassword = () => {

    // Current Step: 'email' | 'code' | 'resetPassword' | 'success' | 'failed'
    const [step, setStep] = useState('email');
    const [inputValue, setInputValue] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // New password state fields
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Handle initial email submission
    const handleEmailSubmit = async (e) => {

        e.preventDefault();

        if (!inputValue || inputValue.trim() === '') {
            message.error('Email address is required.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)) {
            message.error('Please enter a valid email address.');
            return;
        }

        setLoading(true);

        try {

            // TODO: API Call to send reset code
            await new Promise((resolve) => setTimeout(resolve, 1200));

            setUserEmail(inputValue);
            setInputValue(''); // Clear input for code entry
            setStep('code');

        } catch (err) {

            message.error(err.message);
            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    // Handle code verification submission
    const handleCodeSubmit = async (e) => {

        e.preventDefault();

        if (!inputValue || inputValue.trim() === '') {
            message.error('Verification code is required.');
            return;
        }

        setLoading(true);

        try {
            // TODO: API Call to verify code
            await new Promise((resolve) => setTimeout(resolve, 1200));

            // Code verify hone ke baad Password Reset Step par le jayein
            setStep('resetPassword');
        } catch (err) {
            message.error(err.message);
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle New Password setup submission
    const handlePasswordResetSubmit = async (e) => {

        e.preventDefault();

        if (!newPassword || newPassword.trim() === '') {
            message.error('New password is required.');
            return;
        }

        if (newPassword.length < 6) {
            message.error('Password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            message.error('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            // TODO: API Call to update password (e.g., await axios.post('/api/auth/reset-password', { email: userEmail, password: newPassword }))
            await new Promise((resolve) => setTimeout(resolve, 1200));

            setStep('success');
        } catch (err) {
            message.error(err.message);
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // Resend code logic
    const handleResendCode = async () => {
        setLoading(true);

        try {
            // TODO: API Call to resend code
            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (err) {
            message.error(err.message);
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // Reset flow on error
    const handleResetFlow = () => {
        setInputValue('');
        setNewPassword('');
        setConfirmPassword('');
        setErrorMessage('');
        setStep('email');
    };

    return (

        <>
            <SEO
                title={`Reset Password | ${import.meta.env.VITE_SITE_NAME}`}
                canonical={`${import.meta.env.VITE_WEB_URL}/register`}
            />

            <main className="min-h-[100dvh] flex items-center justify-center bg-white sm:bg-slate-50 p-0 sm:p-4">
                <div className="w-full min-h-[100dvh] sm:min-h-0 sm:max-w-md bg-white p-5 sm:p-8 rounded-none sm:rounded-2xl shadow-none sm:shadow-xl sm:shadow-slate-200/60 border-0 sm:border sm:border-slate-100 flex flex-col justify-center">

                    {/* --- STATE 1: EMAIL INPUT FORM --- */}
                    {step === 'email' && (
                        <>
                            <div className="flex justify-center">
                                <Link to="/" className="inline-block transition-transform duration-300 hover:scale-105">
                                    <img
                                        src="/assets/upload.png"
                                        alt={import.meta.env.VITE_SITE_NAME || 'Logo'}
                                        className="w-14 h-14 object-contain"
                                    />
                                </Link>
                            </div>

                            <div className="mt-6 text-center">
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                    Reset Password
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    Enter your registered email ID to receive a 6-digit verification code.
                                </p>
                            </div>

                            <form onSubmit={handleEmailSubmit} className="mt-8 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">
                                        Email ID
                                    </label>
                                    <div className="relative mt-1.5 rounded-lg">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <i className="ri-mail-line text-lg"></i>
                                        </div>
                                        <input
                                            type="email"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="you@example.com"
                                            disabled={loading}
                                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-indigo-500/10 transition duration-200 disabled:opacity-60"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-2 py-3 px-4 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] focus:outline-none focus:ring-indigo-500/20 shadow-md shadow-indigo-600/20 transition-all duration-200 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <i className="ri-loader-4-line animate-spin text-lg"></i>
                                            Sending Code...
                                        </>
                                    ) : (
                                        'Get Verification Code'
                                    )}
                                </button>
                            </form>

                            <p className="text-center text-sm text-slate-600 pt-6 mt-4 border-t border-slate-100">
                                Back to{' '}
                                <Link
                                    to="/login"
                                    className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </>
                    )}

                    {/* --- STATE 2: CODE VERIFICATION FORM --- */}
                    {step === 'code' && (
                        <>
                            <div className="mt-6 text-center">
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                    Enter Code
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    We sent a verification code to <span className="font-semibold text-slate-800">{userEmail}</span>.
                                </p>
                            </div>

                            <form onSubmit={handleCodeSubmit} className="mt-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">
                                        Verification Code
                                    </label>
                                    <div className="relative mt-1.5 rounded-lg">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <i className="ri-key-2-line text-lg"></i>
                                        </div>
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="Enter 6-digit code"
                                            maxLength={6}
                                            disabled={loading}
                                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 tracking-widest focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-indigo-500/10 transition duration-200 disabled:opacity-60"
                                        />
                                    </div>
                                </div>

                                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-left space-y-2">
                                    <div className="flex items-start gap-2 text-sm text-slate-600">
                                        <i className="ri-folder-shield-2-line text-amber-600 text-base shrink-0"></i>
                                        <span>Didn't receive the email? Check your <strong>Spam / Junk folder</strong>.</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] focus:outline-none focus:ring-indigo-500/20 shadow-md shadow-indigo-600/20 transition-all duration-200 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <i className="ri-loader-4-line animate-spin text-lg"></i>
                                            Verifying Code...
                                        </>
                                    ) : (
                                        'Confirm Code'
                                    )}
                                </button>
                            </form>

                            <div className="mt-5 text-center text-sm text-slate-600">
                                Haven't got code yet?{' '}
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    disabled={loading}
                                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer disabled:opacity-60 transition-colors"
                                >
                                    Resend Code
                                </button>
                            </div>
                        </>
                    )}

                    {/* --- STATE 3: SET NEW PASSWORD FORM --- */}
                    {step === 'resetPassword' && (
                        <>
                            <div className="mt-6 text-center">
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                                    Set New Password
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    Please enter your new password below.
                                </p>
                            </div>

                            <form onSubmit={handlePasswordResetSubmit} className="mt-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">
                                        New Password
                                    </label>
                                    <div className="relative mt-1.5 rounded-lg">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <i className="ri-lock-line text-lg"></i>
                                        </div>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            disabled={loading}
                                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-indigo-500/10 transition duration-200 disabled:opacity-60"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700">
                                        Confirm Password
                                    </label>
                                    <div className="relative mt-1.5 rounded-lg">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                            <i className="ri-lock-line text-lg"></i>
                                        </div>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            disabled={loading}
                                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-indigo-500/10 transition duration-200 disabled:opacity-60"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] focus:outline-none focus:ring-indigo-500/20 shadow-md shadow-indigo-600/20 transition-all duration-200 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <i className="ri-loader-4-line animate-spin text-lg"></i>
                                            Updating Password...
                                        </>
                                    ) : (
                                        'Update Password'
                                    )}
                                </button>
                            </form>
                        </>
                    )}

                    {/* --- STATE 4: SUCCESS STATE --- */}
                    {step === 'success' && (
                        <div className="mt-6 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
                                <i className="ri-checkbox-circle-line text-3xl"></i>
                            </div>

                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Password Reset Successfully!
                            </h2>

                            <p className="mt-2 text-sm text-slate-600">
                                Your password has been updated. You can now sign in with your new credentials.
                            </p>

                            <Link
                                to="/login"
                                className="w-full mt-6 py-3 px-4 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all duration-200 text-center shadow-md shadow-indigo-600/20"
                            >
                                Proceed to Sign In
                            </Link>
                        </div>
                    )}

                    {/* --- STATE 5: FAILED / ERROR UI --- */}
                    {step === 'failed' && (
                        <div className="mt-6 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 border border-red-100">
                                <i className="ri-close-circle-line text-3xl"></i>
                            </div>

                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Action Failed
                            </h2>

                            <p className="mt-2 text-sm text-slate-600">
                                {errorMessage || 'Something went wrong while processing your request.'}
                            </p>

                            <button
                                type="button"
                                onClick={handleResetFlow}
                                className="w-full mt-6 py-3 px-4 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all duration-200 shadow-md shadow-indigo-600/20"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                </div>
            </main>

        </>
    );
};