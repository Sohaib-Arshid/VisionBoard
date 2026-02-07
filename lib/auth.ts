import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectdb } from "./db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const authoption: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),

        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password")
                }

                try {
                    await connectdb()
                    const user = await User.findOne({ email: credentials.email });
                    if (!user) {
                        throw new Error("No user found with this email")
                    }

                    const isvalid = await bcrypt.compare(credentials.password, user.password
                    )

                    if (!isvalid) {
                        throw new Error("Invalid Password")
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email
                    }
                } catch (error) {
                    console.log("error in auth", error);
                    throw new Error("Something wrong in email or password")
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token
        },
        async session({ session, token, user }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session
        }
    },

    pages: {
        signIn: "/login",
        error: "/login",
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },

    secret: process.env.AUTH_SECRET,
}