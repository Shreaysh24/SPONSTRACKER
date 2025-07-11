"use client"
import React, { use, useState } from 'react'
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';

// This is the login page component for a Next.js application.
// It allows users to log in using their email and password.
// The component uses NextAuth.js for authentication and redirects users to the dashboard upon successful login.

function Loginpage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await signIn('credentials', {
                email,
                password,
                redirect: false, 
            })
            if (response.ok) {
                console.log("Login successful");
                router.push('/dashboard'); // Redirect to dashboard on successful login
            } else {
                console.log("Login failed:", response.error);
                alert("Login failed. Please check your credentials and try again."+response.error);
                return;
            }
        } catch (error) {
            console.log("Error during login:", error);
            alert("Login failed. Please try again.");
            return;
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border-t-4 border-[#3FC1C9]"
            >
                <h2 className="text-3xl font-bold text-[#364F6B] text-center mb-6">
                    Sign In
                </h2>
                <form onSubmit={handleSubmit} className="text-black space-y-5">
                    <div>
                        <label className="block text-[#364F6B] text-sm mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3FC1C9]"
                        />
                    </div>
                    <div>
                        <label className="block text-[#364F6B] text-sm mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3FC1C9]"
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full bg-[#3FC1C9] hover:bg-[#32abb3] text-white font-semibold py-2 px-4 rounded-xl shadow-md"
                    >
                        Log In
                    </motion.button>
                </form>
                <p className="text-center text-sm text-[#FC5185] mt-4">
                    <a href="/register">Don't have account ? </a>
                </p>
            </motion.div>
        </div>
    );
}

export default Loginpage;