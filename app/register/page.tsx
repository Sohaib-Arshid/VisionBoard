"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const RegisterPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmpassword, setConfirmPassword] = useState("")

    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmpassword) {
            alert('passwords do not match')
            return
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content_Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })

            if (!res.ok) {
                throw new Error("Registration Faield")
            }
            const data = await res.json()
            console.log(data);
            router.push("/login")
        } catch (error) {
            alert(error)
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
                    value = {email}
                    onChange={(e) =>setEmail(e.target.value)}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value = {password}
                    onChange={(e) =>setPassword(e.target.value)}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Confirm Password"
                    value = {confirmpassword}
                    onChange={(e) =>setConfirmPassword(e.target.value)}
                />
            </form>
            <div>
                <p>Already have an account <a href="/login">Login</a></p>
            </div>
        </div>
    )
}

export default RegisterPage