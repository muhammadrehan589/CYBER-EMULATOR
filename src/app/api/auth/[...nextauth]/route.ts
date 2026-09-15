import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        isSignup: { label: "Is Signup", type: "text" }
      },
      async authorize(credentials) {
        await connectDB();
        if (!credentials?.password || !credentials?.username) return null;
        
        if (credentials.isSignup === 'true') {
           if (!credentials.email) throw new Error("Email is required for signup");
           const emailUser = await User.findOne({ email: credentials.email });
           if (emailUser) throw new Error("Email already registered");
           
           const usernameUser = await User.findOne({ username: credentials.username });
           if (usernameUser) throw new Error("Username already taken");

           const salt = await bcrypt.genSalt(10);
           const passwordHash = await bcrypt.hash(credentials.password, salt);
           const newUser = await User.create({
             empId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
             name: credentials.email.split('@')[0],
             username: credentials.username,
             email: credentials.email,
             passwordHash,
             role: 'Player'
           });
           return { id: newUser.empId, email: newUser.email, name: newUser.name };
        }

        const user = await User.findOne({ username: credentials.username });
        if (!user) throw new Error("User not found");
        if (!user.passwordHash) throw new Error("Please sign in with Google.");
        
        const isMatch = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isMatch) throw new Error("Invalid credentials");
        
        return { id: user.empId, email: user.email, name: user.name };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            const { cookies } = await import('next/headers');
            const cookieStore = cookies();
            const mode = cookieStore.get('googleAuthMode')?.value;

            if (mode === 'login') {
              return "/login?error=AccountNotFound";
            }

            await User.create({
               empId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
               name: user.name || "Google User",
               email: user.email,
               username: `init_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
               role: 'Player'
            });
          }
        } catch (err) {
          console.error("[NextAuth Google Sign-In Error]:", err);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // On initial sign-in, `user` is populated — seed the token's email/empId.
      if (user) {
        token.email = user.email;
        token.empId = user.id; // authorize() returns { id: user.empId }
      }

      // Only hit the DB when the role is missing from the token (first sign-in
      // or token refresh), OR when update() is explicitly called from the client.
      if (!token.role || trigger === 'update') {
        await connectDB();
        let dbUser = null;
        if (token.email) {
          dbUser = await User.findOne({ email: token.email }).select('empId username role').lean();
        } else if (token.empId) {
          dbUser = await User.findOne({ empId: token.empId }).select('empId username role').lean();
        }

        if (dbUser) {
          token.empId = (dbUser as any).empId;
          token.username = (dbUser as any).username;
          token.role = (dbUser as any).role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).empId = token.empId;
        (session.user as any).username = token.username;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
