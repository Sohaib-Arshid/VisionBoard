"use client"
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, {useState } from 'react'

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (res?.error) {
            console.log(res.error);
        } else {
            router.push("/")
        }
    }
    return (
        <div>
            <h1>Login page </h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">login</button>
                <div>
                    <button type="button" onClick={() => signIn("google")}>Sign in with Google</button><br />
                    <button type="button" onClick={() => signIn("github")}>Sign in with Github</button>
                </div>
                <div>
                    <p>Do you have an account ?</p>
                    <button onClick={()=>router.push("/register")}>Register</button>
                </div>
            </form>
        </div>
    )
}

export default LoginPage
