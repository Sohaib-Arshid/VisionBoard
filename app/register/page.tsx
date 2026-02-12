"use client"
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiMail, FiLock, FiUserPlus, FiCheck, 
  FiX, FiShield, FiServer, FiCpu, FiZap,
  FiEye, FiEyeOff, FiArrowLeft
} from 'react-icons/fi'
import { SiRedis } from 'react-icons/si'

const RegisterPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [mounted, setMounted] = useState(false)

  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Password strength checker
  useEffect(() => {
    let strength = 0
    if (password.length > 0) {
      if (password.length >= 8) strength += 1
      if (password.match(/[a-z]/)) strength += 1
      if (password.match(/[A-Z]/)) strength += 1
      if (password.match(/[0-9]/)) strength += 1
      if (password.match(/[^a-zA-Z0-9]/)) strength += 1
    }
    setPasswordStrength(strength)
  }, [password])

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500'
    if (passwordStrength <= 3) return 'bg-yellow-500'
    if (passwordStrength <= 4) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak'
    if (passwordStrength <= 3) return 'Fair'
    if (passwordStrength <= 4) return 'Good'
    return 'Strong'
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validation
    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    if (passwordStrength < 3) {
      setError("Please use a stronger password")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.message || "Registration failed")
      }

      setSuccess("Account created successfully! Redirecting to login...")
      
      // Redirect after success
      setTimeout(() => {
        router.push("/login")
      }, 2000)

    } catch (error: any) {
      setError(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-900 dark:to-red-950/30 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        
        {/* Redis Elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-red-500/20 dark:text-red-500/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ y: [0, -30, 0], x: [0, 20, 0], rotate: [0, 360] }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, delay: i * 0.5 }}
          >
            {i % 3 === 0 ? <SiRedis size={40} /> : i % 3 === 1 ? <FiServer size={30} /> : <FiCpu size={35} />}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        {/* Back Button */}
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => router.back()}
          className="absolute -top-12 left-0 flex items-center text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </motion.button>

        {/* Glass Card */}
        <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/50 p-8 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500" />
          
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="inline-block p-4 bg-gradient-to-br from-red-500 to-amber-500 rounded-2xl shadow-lg mb-4"
            >
              <FiUserPlus className="text-white text-4xl" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Join the high-performance platform
            </p>
          </div>

          {/* Messages */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center"
              >
                <FiX className="mr-2 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 text-sm flex items-center"
              >
                <FiCheck className="mr-2 flex-shrink-0" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1 flex items-center">
                <FiMail className="mr-2 text-red-500" />
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900/50 outline-none transition-all duration-300 text-gray-900 dark:text-white"
                  placeholder="you@example.com"
                  disabled={loading}
                  required
                />
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1 flex items-center">
                <FiLock className="mr-2 text-red-500" />
                Password
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-11 pr-11 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900/50 outline-none transition-all duration-300 text-gray-900 dark:text-white"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          className={`h-1.5 w-full rounded-full ${
                            i < passwordStrength ? getStrengthColor() : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength <= 2 ? 'text-red-500' :
                      passwordStrength <= 3 ? 'text-yellow-500' :
                      passwordStrength <= 4 ? 'text-blue-500' :
                      'text-green-500'
                    }`}>
                      {getStrengthText()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Use at least 8 characters with uppercase, lowercase, numbers & symbols
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1 flex items-center">
                <FiShield className="mr-2 text-red-500" />
                Confirm Password
              </label>
              <div className="relative group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-11 pr-11 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900/50 outline-none transition-all duration-300 text-gray-900 dark:text-white"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
                <FiShield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {confirmPassword && password && (
                <div className="flex items-center space-x-2 mt-1">
                  {password === confirmPassword ? (
                    <>
                      <FiCheck className="text-green-500 text-sm" />
                      <span className="text-xs text-green-500">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <FiX className="text-red-500 text-sm" />
                      <span className="text-xs text-red-500">Passwords dont match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <button type="button" className="text-red-600 hover:text-red-700 font-medium">
                  Terms of Service
                </button>{' '}
                and{' '}
                <button type="button" className="text-red-600 hover:text-red-700 font-medium">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Register Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <FiCpu className="text-xl" />
                  </motion.div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <FiUserPlus className="text-xl" />
                  <span>Create account</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                onClick={() => router.push("/login")}
                className="font-semibold text-red-600 hover:text-red-700 dark:text-red-400 inline-flex items-center group"
              >
                Sign in
                <FiArrowLeft className="ml-1 rotate-180 group-hover:translate-x-1 transition-transform" />
              </button>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-500">
            <FiShield className="text-red-500" />
            <span>Enterprise-grade security</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <FiZap className="text-amber-500" />
            <span>Instant provisioning</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default RegisterPage