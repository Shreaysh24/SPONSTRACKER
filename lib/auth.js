
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import { User } from "@/Models/User";
import { Manager } from "@/Models/Manager";
import bcrypt from "bcryptjs";
// This is the configuration for NextAuth.js, which handles authentication in a Next.js application.
// It uses GitHub as an authentication provider.


export const authOptions = {

    providers: [
        //     GitHubProvider({
        //         clientId: process.env.GITHUB_ID,
        //         clientSecret: process.env.GITHUB_SECRET
        //     })

        CredentialsProvider({
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith@jmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                try {
                    await dbConnect();

                    // Try to find user or manager
                    const user = await User.findOne({ email: credentials.email });
                    const manager = !user ? await Manager.findOne({ email: credentials.email }) : null;

                    const account = user || manager;
                    const role = user ? "user" : manager ? "manager" : null;

                    if (!account) {
                        throw new Error("No user found with the provided email");
                    }

                    const isValid = await bcrypt.compare(credentials.password, account.password);
                    if (!isValid) {
                        throw new Error("Invalid password");
                    }

                    console.log("Authenticated", role, ":", account.email);

                    return {
                        id: account._id.toString(),
                        email: account.email.toString(),
                        role, // optional: you can use this to redirect or manage access
                    };


                } catch (error) {
                    console.error("Error during authorization:", error);
                    throw new Error(error.message  ||"Authorization failed");
                }
            },
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
            }
            return session;
        }
    }, pages: {
        signIn: '/login',
        error: '/login'
    }, session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};