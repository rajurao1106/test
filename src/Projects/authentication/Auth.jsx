import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, LogOut, Loader, RotateCw } from 'lucide-react';

// --- API CONFIGURATION (Targeting Express Backend on port 5000) ---
const API_BASE_URL = 'http://localhost:5000/api/auth';
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;

// Utility for fetching with exponential backoff
async function fetchWithBackoff(url, options) {
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                // Throw error to trigger retry logic, except for 4xx errors
                if (response.status >= 400 && response.status < 500) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `API Error: ${response.status}`);
                }
                throw new Error(`Server Error: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            if (i === MAX_RETRIES - 1) {
                console.error("Max retries reached. Request failed.", error);
                throw error;
            }
            // Exponential backoff
            const delay = INITIAL_BACKOFF_MS * Math.pow(2, i);
            console.warn(`Retrying in ${delay}ms...`, error.message);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// --- Main Application Component ---
const Auth = () => {
    const [view, setView] = useState('login'); // login, signup, forgot, reset, profile
    const [formData, setFormData] = useState({});
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null); // Simple user object for demonstration

    // Check URL for reset token on load
    useEffect(() => {
        // In a real app, this would be window.location.search. For this environment,
        // we simulate the token retrieval if it were passed in the URL.
        const urlParams = new URLSearchParams(window.location.search);
        const resetToken = urlParams.get('token');
        if (resetToken) {
            setFormData(prev => ({ ...prev, token: resetToken }));
            setView('reset');
        }
    }, []);

    // Simulate profile loading or token validation
    useEffect(() => {
        if (token) {
            // In a real app, this would be a secure token validation call
            // For now, we simulate success and set the user view
            // NOTE: In the backend, a /profile or /validate endpoint would be used here.
            setUser({ email: 'user@example.com' });
            setView('profile');
        } else {
            setUser(null);
            if (view === 'profile') setView('login');
        }
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setStatus({ type: '', message: '' });
    };

    const handleAction = async (endpoint, payload) => {
        setLoading(true);
        setStatus({ type: '', message: '' });
        try {
            const result = await fetchWithBackoff(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (result.token) {
                localStorage.setItem('token', result.token);
                setToken(result.token);
                setStatus({ type: 'success', message: 'Login successful! Redirecting...' });
                setTimeout(() => setView('profile'), 1000);
            } else if (endpoint === 'reset-password' || endpoint === 'forgot-password') {
                setStatus({ type: 'success', message: result.message || 'Action successful! Check your email if applicable.' });
                setFormData({});
                if (endpoint === 'reset-password') setTimeout(() => setView('login'), 2000);
            } else {
                setStatus({ type: 'success', message: result.message || 'Success!' });
                setFormData({});
                if (endpoint === 'signup') setTimeout(() => setView('login'), 2000);
            }

        } catch (error) {
            setStatus({ type: 'error', message: error.message || 'An unknown error occurred.' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        switch (view) {
            case 'login':
                handleAction('login', { email: formData.email, password: formData.password });
                break;
            case 'signup':
                handleAction('signup', { email: formData.email, password: formData.password });
                break;
            case 'forgot':
                handleAction('forgot-password', { email: formData.email });
                break;
            case 'reset':
                handleAction('reset-password', { token: formData.token, newPassword: formData.newPassword });
                break;
            default:
                break;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setStatus({ type: 'success', message: 'Logged out successfully.' });
        setView('login');
    };

    // --- Utility Components for UI ---

    const StatusMessage = ({ type, message }) => {
        if (!message) return null;
        const colorClass = type === 'error' ? 'bg-red-100 text-red-800 border-red-300' : 'bg-green-100 text-green-800 border-green-300';
        return (
            <div className={`p-3 mb-4 rounded-lg border ${colorClass} text-sm font-medium`}>
                {message}
            </div>
        );
    };

    const InputField = ({ Icon, name, type = 'text', placeholder, value, onChange, required = true }) => (
        <div className="relative mb-4">
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value || ''}
                onChange={onChange}
                required={required}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm"
                disabled={loading}
            />
        </div>
    );

    const AuthCard = ({ title, children, footer, showNav = true }) => (
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-xl shadow-2xl backdrop-blur-sm bg-opacity-95">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">{title}</h1>
            {children}
            {footer && <div className="mt-6 text-center text-sm text-gray-600">{footer}</div>}
            {showNav && (
                <div className="mt-6 flex justify-around text-sm">
                    {view !== 'login' && view !== 'profile' && (
                        <button
                            onClick={() => { setView('login'); setStatus({type:'', message:''}); }}
                            className="text-indigo-600 hover:text-indigo-800 transition duration-150 font-medium"
                            disabled={loading}
                        >
                            ← Back to Login
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    // --- View Renderers ---

    const renderLoginForm = () => (
        <AuthCard title="Welcome Back">
            <StatusMessage type={status.type} message={status.message} />
            <form onSubmit={handleSubmit}>
                <InputField Icon={Mail} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
                <InputField Icon={Lock} name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-lg flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? <Loader className="animate-spin w-5 h-5 mr-2" /> : <LogOut className="w-5 h-5 mr-2 rotate-180" />}
                    {loading ? 'Logging In...' : 'Login'}
                </button>
            </form>
            <div className="mt-4 text-center">
                <button
                    onClick={() => setView('forgot')}
                    className="text-indigo-600 hover:text-indigo-800 text-sm transition duration-150 font-medium"
                    disabled={loading}
                >
                    Forgot Password?
                </button>
            </div>
        </AuthCard>
    );

    const renderSignupForm = () => (
        <AuthCard title="Create Account">
            <StatusMessage type={status.type} message={status.message} />
            <form onSubmit={handleSubmit}>
                <InputField Icon={Mail} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
                <InputField Icon={Lock} name="password" type="password" placeholder="Password (min 6 chars)" value={formData.password} onChange={handleChange} />

                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-lg flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? <Loader className="animate-spin w-5 h-5 mr-2" /> : <User className="w-5 h-5 mr-2" />}
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
        </AuthCard>
    );

    const renderForgotPasswordForm = () => (
        <AuthCard title="Forgot Password">
            <p className="text-center text-gray-600 mb-6 text-sm">
                Enter your email and we'll send you a password reset link.
            </p>
            <StatusMessage type={status.type} message={status.message} />
            <form onSubmit={handleSubmit}>
                <InputField Icon={Mail} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />

                <button
                    type="submit"
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-lg flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? <Loader className="animate-spin w-5 h-5 mr-2" /> : <Mail className="w-5 h-5 mr-2" />}
                    {loading ? 'Sending Email...' : 'Send Reset Link'}
                </button>
            </form>
        </AuthCard>
    );

    const renderResetPasswordForm = () => (
        <AuthCard title="Reset Password" showNav={false}>
            <p className="text-center text-gray-600 mb-6 text-sm">
                Enter your new password below.
            </p>
            {formData.token && (
                <p className="text-xs text-center text-indigo-500 mb-4 truncate">
                    Token detected: {formData.token}
                </p>
            )}
            <StatusMessage type={status.type} message={status.message} />
            <form onSubmit={handleSubmit}>
                <InputField Icon={Lock} name="newPassword" type="password" placeholder="New Password (min 6 chars)" value={formData.newPassword} onChange={handleChange} />

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-lg flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? <Loader className="animate-spin w-5 h-5 mr-2" /> : <RotateCw className="w-5 h-5 mr-2" />}
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </AuthCard>
    );

    const renderProfileView = () => (
        <AuthCard title={`Hello, ${user?.email || 'User'}!`} showNav={false}>
            <p className="text-center text-gray-600 mb-6">
                You are securely logged in. This token (stored in localStorage) is used to maintain your session.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                <p className="font-semibold text-gray-800">Authentication Token (JWT):</p>
                <p className="text-xs break-all text-gray-500 mt-1 truncate">
                    {token || 'Token not found.'}
                </p>
            </div>
            <StatusMessage type={status.type} message={status.message} />
            <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 ease-in-out shadow-lg flex items-center justify-center"
                disabled={loading}
            >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
            </button>
        </AuthCard>
    );

    const getCurrentView = () => {
        switch (view) {
            case 'signup':
                return renderSignupForm();
            case 'forgot':
                return renderForgotPasswordForm();
            case 'reset':
                return renderResetPasswordForm();
            case 'profile':
                return renderProfileView();
            case 'login':
            default:
                return renderLoginForm();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4" style={{ fontFamily: 'Inter, sans-serif' }}>
             <script src="https://cdn.tailwindcss.com"></script>
             <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <div className="text-center mb-6">
                <h2 className="text-xl font-medium text-gray-700">
                    Client App is communicating with: <code className="bg-gray-200 p-1 rounded text-sm font-mono">{API_BASE_URL}</code>
                </h2>
                <div className="flex justify-center mt-4 space-x-2">
                     <button
                        onClick={() => setView('login')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition duration-150 ${view === 'login' ? 'bg-indigo-500 text-white shadow-md' : 'bg-white text-indigo-600 hover:bg-indigo-100'}`}
                        disabled={loading || token}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setView('signup')}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition duration-150 ${view === 'signup' ? 'bg-indigo-500 text-white shadow-md' : 'bg-white text-indigo-600 hover:bg-indigo-100'}`}
                         disabled={loading || token}
                    >
                        Signup
                    </button>
                </div>
            </div>
            {getCurrentView()}
            <p className="mt-8 text-xs text-gray-500">
                Frontend built with React/Tailwind. See the **FullStackBackend_Setup.md** file for server instructions.
            </p>
        </div>
    );
};

export default Auth;
