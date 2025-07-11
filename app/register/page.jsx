"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

function Registerpage() {
    const [password, setpassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("User");
    const [email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [companyDomain, setCompanyDomain] = useState("");
    const [amount, setAmount] = useState("");
    const [name, setName] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            const payload =
                role === "User"
                    ? { name, email, password, role }
                    : { name, email, password, role, companyName, companyDomain, contactNumber, amount };

            const response = await fetch('/api/auth/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error === "User already exists") {
                    if (confirm("An account with this email already exists. Do you want to log in instead?")) {
                        router.push('/login');
                    } else {
                        throw new Error(data.message || 'Registration failed due to server error.');
                    }

                }

                console.log("Registration response:", data);
                alert("Registration successful! Please log in.");
                router.push('/login');

            }
        } catch (error) {
            console.error("Registration error:", error);
            alert(error.message || "Something went wrong. Please try again.");
        }



    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 border-t-4 border-[#3FC1C9]">
                <h1 className="text-3xl font-bold text-[#364F6B] text-center mb-6">Registration Page</h1>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3FC1C9] text-[#364F6B]"
                >
                    <option value="User">User</option>
                    <option value="Manager">Manager</option>
                </select>
                <form onSubmit={handleSubmit} className="space-y-4 text-black">
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FC1C9]" />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FC1C9]" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setpassword(e.target.value)} required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FC1C9]" />
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FC1C9]" />
                    {role === "Manager" && (
                        <>
                            <input type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FC1C9]" />
                            <input type="text" placeholder="Company Domain" value={companyDomain} onChange={(e) => setCompanyDomain(e.target.value)} required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FC1C9]" />
                            <input type="text" placeholder="Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FC1C9]" />
                            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FC1C9]" />
                        </>
                    )}
                    <button type="submit" className="w-full bg-[#3FC1C9] hover:bg-[#32abb3] text-black font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md">
                        Register
                    </button>
                </form>
                <p className="text-center text-sm text-[#FC5185] mt-4">
                    Already have an account? <a href="/login" className="underline">Login here</a>
                </p>
            </div>
        </div>
    );
}

export default Registerpage;
