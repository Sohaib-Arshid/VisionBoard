import NextAuth from "next-auth";
import { authoption } from "@/lib/auth"; // check correct path

const handler = NextAuth(authoption);

export { handler as GET, handler as POST };
