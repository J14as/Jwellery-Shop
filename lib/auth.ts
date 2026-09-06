import { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          throw new Error("Invalid credentials");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (user && user.password) {
            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (passwordsMatch) {
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              };
            }
          }
        } catch (dbError) {
          console.warn("DB lookup error in auth, checking demo credentials:", dbError);
        }

        // Demo Accounts Fallback
        if (email === "customer@jewels.com" && password === "customer123") {
          return {
            id: "demo-customer-1",
            email: "customer@jewels.com",
            name: "Rohan Singhania",
            role: "CUSTOMER",
          };
        }

        if (email === "admin@jewels.com" && password === "admin123") {
          return {
            id: "demo-admin-1",
            email: "admin@jewels.com",
            name: "Atelier Director",
            role: "ADMIN",
          };
        }

        throw new Error("Invalid credentials");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || "CUSTOMER";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  trustHost: true,
} satisfies NextAuthConfig;
