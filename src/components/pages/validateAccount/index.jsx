import { message } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import SEO from '../SEO';
import api from '../../../../utils/api';

const ValidateAccount = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const siteName = import.meta.env.VITE_SITE_NAME;

    const [status, setStatus] = useState('loading');
    // 'loading' | 'success' | 'failed'

    const verifyAccount = async () => {

        setStatus('loading');

        // Get token from URL:
        const token = searchParams.get('token');

        // Validate token before API request
        if (!token || !token.trim()) {

            setStatus('failed');

            message.error('Verification token is missing.');

            return;
        }

        try {

            const response = await api.post(
                `/ api / verify - account ? token = ${encodeURIComponent(token)} `
            );

            if (response?.data?.success) {

                setStatus('success');

                message.success(
                    response?.data?.message ||
                    'Account verified successfully.'
                );

                navigate('/login');

            } else {

                setStatus('failed');

                message.error(
                    response?.data?.message ||
                    'Account verification failed.'
                );
            }

        } catch (err) {

            const errorCode = err?.response?.data?.code;
            const errorMessage =
                err?.response?.data?.message ||
                'Unable to verify your account.';

            if (errorCode === 'ALREADY_VERIFIED') {

                setStatus('success');

                message.success(
                    errorMessage || 'Your account is already verified.'
                );

                return;
            }

            if (errorCode === 'ACCESS_BLOCKED') {

                navigate('/user/blocked');

                return;
            }

            setStatus('failed');

            message.error(errorMessage);
        }
    };

    useEffect(() => {
        verifyAccount();
    }, []);

    const handleRetry = () => {
        verifyAccount();
    };

    const handleVerifyNow = () => {
        navigate('/verify');
    };

    return (
        <>
            <SEO
                title={`Verify Account | ${siteName} `}
                canonical={`${import.meta.env.VITE_WEB_URL}/verify-account`}
            />

            <main main className="min-h-[100dvh] flex items-center justify-center bg-white sm:bg-slate-50 p-0 sm:p-4" >
                <div className="w-full min-h-[100dvh] sm:min-h-0 sm:max-w-md bg-white p-5 sm:p-8 rounded-none sm:rounded-2xl shadow-none sm:shadow-xl sm:shadow-slate-200/60 border-0 sm:border sm:border-slate-100 flex flex-col justify-center">

                    {/* Logo */}
                    <div className="flex justify-center">
                        <Link
                            to="/"
                            className="inline-block transition-transform duration-300 hover:scale-105"
                        >
                            <img
                                src="/assets/upload.png"
                                alt={siteName}
                                className="w-14 h-14 object-contain"
                            />
                        </Link>
                    </div>

                    {/* =========================
                        LOADING STATE
                    ========================== */}
                    {status === 'loading' && (
                        <div className="mt-8 flex flex-col items-center text-center">

                            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                                <i className="ri-loader-4-line animate-spin text-3xl" />
                            </div>

                            <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
                                Verifying Your Account
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500 max-w-sm">
                                Please wait while we verify your account.
                            </p>
                        </div>
                    )}

                    {/* =========================
                        SUCCESS STATE
                    ========================== */}
                    {status === 'success' && (
                        <div className="mt-8 flex flex-col items-center text-center">

                            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                <i className="ri-checkbox-circle-fill text-5xl" />
                            </div>

                            <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
                                Account Verified
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-600 max-w-sm">
                                Your account has been successfully verified.
                                You can now log in to your account.
                            </p>

                            <div className="mt-8 w-full">
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-[0.98] cursor-pointer"
                                >
                                    <i className="ri-login-box-line mr-2" />
                                    Go to Login
                                </button>
                            </div>
                        </div>
                    )}

                    {/* =========================
                        FAILED STATE
                    ========================== */}
                    {status === 'failed' && (
                        <div className="mt-8 flex flex-col items-center text-center">

                            <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
                                <i className="ri-close-circle-fill text-5xl" />
                            </div>

                            <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
                                Verification Failed
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-600 max-w-sm">
                                We couldn't verify your account. The verification
                                link may be invalid, expired, or already used.
                            </p>

                            <div className="mt-8 w-full space-y-3">

                                {/* Verify Now */}
                                <button
                                    type="button"
                                    onClick={handleVerifyNow}
                                    className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-blue-600/30 active:scale-[0.98] cursor-pointer"
                                >
                                    <i className="ri-mail-send-line mr-2" />
                                    Verify Now
                                </button>

                                {/* Retry */}
                                <button
                                    type="button"
                                    onClick={handleRetry}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] cursor-pointer"
                                >
                                    <i className="ri-refresh-line mr-2" />
                                    Retry
                                </button>

                            </div>

                            <p className="mt-6 text-sm text-slate-500">
                                Already verified?{' '}
                                <Link
                                    to="/login"
                                    className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    Go to Login
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default ValidateAccount;
