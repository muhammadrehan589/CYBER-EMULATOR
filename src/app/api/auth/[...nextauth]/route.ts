import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectDB();
        if (!credentials?.password || !credentials?.username) return null;
        
        const user = await User.findOne({ username: credentials.username });
        if (!user) throw new Error("User not found");
        if (!user.passwordHash) throw new Error("Please sign in with Google."); // Keeping error for legacy accounts
        
        const isMatch = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isMatch) throw new Error("Invalid credentials");
        
        return { 
          id: user.empId, 
          email: user.email, 
          name: user.name, 
          username: user.username,
          dbId: user._id.toString()
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.empId = user.id; 
        token.username = (user as any).username;
        token.dbId = (user as any).dbId;
      }
      
      await connectDB();
      let dbUser = null;
      if (token.dbId) {
        dbUser = await User.findById(token.dbId);
      } else if (token.empId) {
        dbUser = await User.findOne({ empId: token.empId });
      } else if (token.username) {
        dbUser = await User.findOne({ username: token.username });
      }
      
      if (dbUser) {
        token.empId = dbUser.empId;
        token.username = dbUser.username;
        token.role = dbUser.role;
        token.dbId = dbUser._id.toString();
        token.forceUsernameChange = dbUser.forceUsernameChange;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).empId = token.empId;
        (session.user as any).username = token.username;
        (session.user as any).role = token.role;
        (session.user as any).dbId = token.dbId;
        (session.user as any).forceUsernameChange = token.forceUsernameChange;
      }
      return session;
    }
  },
  events: {
    async signIn({ user }) {
      if (user) {
        await connectDB();
        const query = (user as any).username ? { username: (user as any).username } : { empId: user.id };
        await User.updateOne(
          query,
          { 
            $push: { loginHistory: new Date() },
            $set: { isOnline: true }
          }
        );
      }
    }
  },
  pages: {
    signIn: "/login",
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
