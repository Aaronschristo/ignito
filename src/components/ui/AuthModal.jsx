/**
 * components/ui/AuthModal.jsx
 * Login / Register modal with tab switching.
 * Uses AuthContext for state management.
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Rocket, Eye, EyeOff, Loader } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function InputField({ id, label, type = 'text', value, onChange, placeholder, required }) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-body text-xs font-medium text-text-muted uppercase tracking-widest">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-3 rounded-xl bg-space-surface border border-space-border text-text-primary font-body text-sm placeholder:text-text-faint focus:outline-none focus:border-nebula-green/60 focus:ring-1 focus:ring-nebula-green/40 transition-all pr-10"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-muted transition-colors"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  )
}

export function AuthModal() {
  const { showAuth, authMode, closeAuth, login, register, openAuth } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isLogin = authMode === 'login'

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password })
      } else {
        await register({ name: form.name, email: form.email, password: form.password })
      }
      setForm({ name: '', email: '', password: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {showAuth && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuth}
            className="fixed inset-0 z-[200] bg-space-bg/70 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md bg-space-card border border-space-border rounded-2xl p-8 shadow-2xl">
              {/* Close */}
              <button
                onClick={closeAuth}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-text-faint hover:text-text-primary hover:bg-space-surface transition-colors"
              >
                <X size={18} />
              </button>

              {/* Logo */}
              <div className="flex items-center gap-2 mb-6">
                <Rocket size={20} className="text-ignition-flame" strokeWidth={2} />
                <span className="font-display text-lg font-bold text-text-primary">IGNITO</span>
              </div>

              {/* Tab switch */}
              <div className="flex mb-6 bg-space-surface rounded-xl p-1 border border-space-border">
                <button
                  onClick={() => openAuth('login')}
                  className={[
                    'flex-1 py-2 rounded-lg font-body text-sm font-medium transition-all duration-200',
                    isLogin
                      ? 'bg-nebula-green text-space-bg shadow'
                      : 'text-text-muted hover:text-text-primary',
                  ].join(' ')}
                >
                  Login
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className={[
                    'flex-1 py-2 rounded-lg font-body text-sm font-medium transition-all duration-200',
                    !isLogin
                      ? 'bg-nebula-green text-space-bg shadow'
                      : 'text-text-muted hover:text-text-primary',
                  ].join(' ')}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="name"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <InputField
                        id="auth-name"
                        label="Full Name"
                        value={form.name}
                        onChange={set('name')}
                        placeholder="Your name"
                        required={!isLogin}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <InputField
                  id="auth-email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@email.com"
                  required
                />

                <InputField
                  id="auth-password"
                  label="Password"
                  type="password"
                  value={form.password}
                  onChange={set('password')}
                  placeholder="••••••••"
                  required
                />

                {error && (
                  <p className="font-body text-xs text-ignition-flame bg-ignition-flame/10 border border-ignition-flame/30 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="mt-2 w-full py-3 rounded-xl bg-nebula-green text-space-bg font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:bg-nebula-green-dim shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
                      <Loader size={16} />
                    </motion.span>
                  ) : null}
                  {loading ? 'Processing…' : isLogin ? 'Login to Mission Control' : 'Create Account'}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
