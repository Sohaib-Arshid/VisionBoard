// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authoption } from "@/lib/auth";

const handler = NextAuth({
  ...authoption,
  // 🔥 FIX: Ensure session has correct ID
  callbacks: {
    ...authoption.callbacks,
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        
        // Database se real ID lo
        const { connectdb } = await import("@/lib/db");
        const User = (await import("@/models/user")).default;
        
        await connectdb();
        const user = await User.findOne({ email: session.user.email }).select("-password");
        if (user) {
          session.user.id = user._id.toString();
        }
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };