"use client"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiMail, FiLock, FiLogIn, FiGithub, FiUserPlus, FiEye, FiEyeOff,
  FiServer, FiCpu, FiZap 
} from 'react-icons/fi'
import { SiRedis } from 'react-icons/si'

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid credentials. Please try again.")
        setIsLoading(false)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setError("Connection error. Please try again.")
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-900 dark:to-red-950/30 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated Background Elements - Redis Style */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        
        {/* Redis-style floating elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-red-500/20 dark:text-red-500/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
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
        {/* Glass Card */}
        <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/50 p-8 relative overflow-hidden">
          
          {/* Redis Header */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500" />
          
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="inline-block p-4 bg-gradient-to-br from-red-500 to-amber-500 rounded-2xl shadow-lg mb-4"
            >
              <SiRedis className="text-white text-4xl" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              High-performance authentication ready
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center"
              >
                <FiZap className="mr-2" />
                {error}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 font-medium hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <FiCpu className="text-xl" />
                  </motion.div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <FiLogIn className="text-xl" />
                  <span>Login to Dashboard</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 dark:bg-gray-900/80 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn("google")}
                className="flex items-center justify-center px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
              >
              </motion.button>
              
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => signIn("github")}
                className="flex items-center justify-center px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
              >
                <FiGithub className="text-gray-600 dark:text-gray-400 group-hover:text-red-500 text-xl" />
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-red-600">GitHub</span>
              </motion.button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Dont have an account?{' '}
              <button
                onClick={() => router.push("/register")}
                className="font-semibold text-red-600 hover:text-red-700 dark:text-red-400 inline-flex items-center group"
              >
                Create account
                <FiUserPlus className="ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </p>
          </div>

          {/* Redis Performance Badge */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-gray-500">
            <FiZap className="text-red-500" />
            <span>Sub-millisecond response</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <FiServer className="text-amber-500" />
            <span>99.99% uptime</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage