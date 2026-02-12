import NextAuth from "next-auth";
import { authoption } from "@/lib/auth"; 

const handler = NextAuth(authoption);

export { handler as GET, handler as POST };
