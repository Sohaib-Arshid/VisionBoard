// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectdb } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const authoption: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            throw new Error("Email and password required");
          }

          await connectdb();
          console.log("🔍 Looking for user:", credentials.email);

          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            console.log("❌ User not found:", credentials.email);
            throw new Error("No user found with this email");
          }

          console.log("✅ User found:", user.email);
          console.log("🔐 Stored password hash:", user.password.substring(0, 10) + "...");
          
          // Compare password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log("🔑 Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            console.log(" Invalid password for:", credentials.email);
            throw new Error("Invalid password");
          }

          console.log("✅ Login successful for:", user.email);
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || user.email.split('@')[0],
            image: user.avatar || "",
            role: user.role || "user",
          };
        } catch (error: any) {
          console.error("Authorize error:", error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Error page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};