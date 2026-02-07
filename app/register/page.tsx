"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const RegisterPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmpassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const router = useRouter();
    // loading
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmpassword) {
            alert('passwords do not match')
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })

            const data = await res.json()
            if (!data.ok) {
                throw new Error(data.message || "Registration Faield")
            }
            console.log(data);
            router.push("/login")
        } catch (error) {
            alert(error || "something wrong in registeration")
        } finally {
            setLoading(false)
        }

    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"

                    placeholder="Confirm Password"
                    value={confirmpassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
            <div>
                <p>Already have an account <a href="/login">Login</a></p>
            </div>
        </div>
    )
}

export default RegisterPage