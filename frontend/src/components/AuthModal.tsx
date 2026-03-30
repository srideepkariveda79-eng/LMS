import React, { useState } from 'react'
import { X, Eye, EyeOff, Mail, Lock, User, Quote, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import arohakLogo from '../assets/Arohak-logo.jpg'

const AuthModal = ({ onClose }) => {
    const { login, register, forgotPassword, resendVerification } = useAuth()
    const [mode, setMode] = useState('login')
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [showPass, setShowPass] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [needsVerification, setNeedsVerification] = useState(false)
    const [lastEmail, setLastEmail] = useState('')

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            if (mode === 'login') {
                await login(form.email, form.password)
                onClose()
            } else if (mode === 'register') {
                if (!form.name.trim()) { setError('Name is required'); return }
                await register(form.name, form.email, form.password)
                setLastEmail(form.email)
                setMode('verify-sent')
            } else if (mode === 'forgot') {
                await forgotPassword(form.email)
                setLastEmail(form.email)
                setMode('forgot-sent')
            }
        } catch (err) {
            if (err.needsVerification) {
                setNeedsVerification(true)
                setLastEmail(form.email)
                setError(err.message)
            } else {
                setError(err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        setLoading(true)
        await resendVerification(lastEmail).catch(() => {})
        setLoading(false)
        setNeedsVerification(false)
        setMode('verify-sent')
    }

    const switchMode = (m) => { setMode(m); setError(''); setNeedsVerification(false) }

    const SuccessScreen = ({ title, body, action }) => (
        <div className="flex flex-col items-center justify-center py-10 px-6 text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle size={28} className="text-green-600" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 max-w-xs">{body}</p>
            {action}
        </div>
    )

    const modalShell = (children) => (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4'>
            <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden'>
                <div className='h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500' />
                <button onClick={onClose} className='absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-all'><X size={16} /></button>
                {children}
            </div>
        </div>
    )

    if (mode === 'verify-sent') return modalShell(
        <SuccessScreen
            title="Check your inbox"
            body={`We sent a verification link to ${lastEmail}. Click it to activate your account.`}
            action={<button onClick={() => switchMode('login')} className="text-red-600 font-semibold text-sm hover:underline">Back to Sign In</button>}
        />
    )

    if (mode === 'forgot-sent') return modalShell(
        <SuccessScreen
            title="Reset link sent"
            body={`If ${lastEmail} is registered, you'll receive a password reset link shortly.`}
            action={<button onClick={() => switchMode('login')} className="text-red-600 font-semibold text-sm hover:underline">Back to Sign In</button>}
        />
    )

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4'>
            <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden'>
                <div className='h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500' />
                <div className='grid md:grid-cols-2'>

                    {/* Left — form */}
                    <div className='p-8 md:p-10'>
                        <button onClick={onClose} className='absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all z-10'><X size={16} /></button>

                        <h2 className='text-2xl font-extrabold text-gray-900 mb-1'>
                            {mode === 'login' ? 'Welcome back' : mode === 'register' ? 'Create account' : 'Forgot password'}
                        </h2>
                        <p className='text-sm text-gray-500 mb-7'>
                            {mode === 'login' ? 'Sign in to continue learning' : mode === 'register' ? 'Join thousands of learners today' : 'Enter your email to receive a reset link'}
                        </p>

                        <form onSubmit={handleSubmit} className='space-y-4'>
                            {mode === 'register' && (
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1.5'>Full Name</label>
                                    <div className='relative'>
                                        <User size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' />
                                        <input name='name' type='text' value={form.name} onChange={handleChange} placeholder='Your full name'
                                            className='w-full pl-10 pr-4 py-2.5 border border-red-100 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-400 transition-all' required />
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Email address</label>
                                <div className='relative'>
                                    <Mail size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' />
                                    <input name='email' type='email' value={form.email} onChange={handleChange} placeholder='you@example.com'
                                        className='w-full pl-10 pr-4 py-2.5 border border-red-100 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-400 transition-all' required />
                                </div>
                            </div>
                            {mode !== 'forgot' && (
                                <div>
                                    <div className='flex items-center justify-between mb-1.5'>
                                        <label className='block text-sm font-medium text-gray-700'>Password</label>
                                        {mode === 'login' && (
                                            <button type='button' onClick={() => switchMode('forgot')} className='text-xs text-red-600 hover:underline font-medium'>Forgot password?</button>
                                        )}
                                    </div>
                                    <div className='relative'>
                                        <Lock size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400' />
                                        <input name='password' type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder='••••••••'
                                            className='w-full pl-10 pr-10 py-2.5 border border-red-100 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-400 transition-all'
                                            required minLength={6} />
                                        <button type='button' onClick={() => setShowPass(p => !p)} className='absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'>
                                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {error && (
                                <div className='flex flex-col gap-2 p-3 bg-red-50 border border-red-100 rounded-xl'>
                                    <div className='flex items-center gap-2'>
                                        <div className='w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0' />
                                        <p className='text-sm text-red-600'>{error}</p>
                                    </div>
                                    {needsVerification && (
                                        <button type='button' onClick={handleResend} disabled={loading}
                                            className='text-xs text-red-600 font-semibold hover:underline text-left pl-3.5'>
                                            Resend verification email →
                                        </button>
                                    )}
                                </div>
                            )}

                            <button type='submit' disabled={loading}
                                className='w-full bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-bold uppercase tracking-wide py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-2 cursor-pointer'>
                                {loading ? (
                                    <span className='flex items-center justify-center gap-2'>
                                        <svg className='animate-spin w-4 h-4' viewBox='0 0 24 24' fill='none'><circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' /><path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8v8z' /></svg>
                                        Please wait...
                                    </span>
                                ) : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
                            </button>
                        </form>

                        <p className='text-center text-sm text-gray-500 mt-6'>
                            {mode === 'forgot' ? (
                                <button onClick={() => switchMode('login')} className='text-red-600 font-semibold hover:text-red-700'>← Back to Sign In</button>
                            ) : mode === 'login' ? (
                                <>Don't have an account? <button onClick={() => switchMode('register')} className='text-red-600 font-semibold hover:text-red-700'>Sign up</button></>
                            ) : (
                                <>Already have an account? <button onClick={() => switchMode('login')} className='text-red-600 font-semibold hover:text-red-700'>Sign in</button></>
                            )}
                        </p>
                    </div>

                    {/* Right — branding panel */}
                    <div className='hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-amber-50 to-red-50 p-10 relative overflow-hidden'>
                        <div className='absolute top-10 right-10 w-32 h-32 bg-red-200/20 rounded-full blur-3xl' />
                        <div className='absolute bottom-10 left-10 w-40 h-40 bg-amber-200/20 rounded-full blur-3xl' />
                        <div className='relative z-10 flex flex-col items-center justify-center h-full space-y-8'>
                            <div className='w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white p-4'>
                                <img src={arohakLogo} alt='Arohak Logo' className='w-full h-full object-contain' />
                            </div>
                            <div className='text-center'>
                                <h3 className='text-3xl font-extrabold bg-gradient-to-r from-red-700 via-red-600 to-amber-600 bg-clip-text text-transparent mb-2'>AROHAK</h3>
                                <p className='text-sm text-gray-600 font-medium'>Excellence in Education</p>
                            </div>
                            <div className='relative max-w-sm'>
                                <Quote className='absolute -top-4 -left-4 w-8 h-8 text-red-300 opacity-50' />
                                <blockquote className='text-center'><p className='text-lg font-serif italic text-gray-700 leading-relaxed'>"Knowledge of wisdom is like honey."</p></blockquote>
                                <Quote className='absolute -bottom-4 -right-4 w-8 h-8 text-amber-300 opacity-50 rotate-180' />
                            </div>
                            <div className='flex gap-2 mt-4'>
                                <div className='w-2 h-2 bg-red-600 rounded-full' />
                                <div className='w-2 h-2 bg-amber-500 rounded-full' />
                                <div className='w-2 h-2 bg-red-400 rounded-full' />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AuthModal
