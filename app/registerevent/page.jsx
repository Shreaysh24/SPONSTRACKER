"use client";

import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Header from "../components/edges/Header";
import Footer from "../components/edges/Footer";

function Page() {
    const { data: session } = useSession();
    const [loaded, setLoaded] = useState(true);
    const [videoUrl, setVideoUrl] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoUrl) {
            alert("Please upload a video before submitting the form.");
            return;
        }
        const form = e.target;

        const res = await fetch('/api/video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userEmail: session?.user?.email || "",
                title: form.title.value,
                description: form.description.value,
                date: form.date.value,
                location: form.location.value,
                type: form.type.value,
                amount: form.amount.value,
                stage: "Opened",
                videoUrl: videoUrl || "",
            }),
        });

        const result = await res.json();
        if (res.ok) {
            alert("Event registered successfully!");
            form.reset();
            setVideoUrl(""); // Reset video URL after successful submission
            router.push('/'); // Redirect to dashboard

        } else {
            alert(`Error: ${result.error || "Failed to register event"}`);
        }

    };

    return (
        <div>
            <Header />
            <div className="min-h-screen mt-12 mb-0 bg-gradient-to-br from-[#c7badd] to-[#F5F5F5] px-6 py-10 flex flex-col items-center justify-center">
                <section className="max-w-2xl w-full mx-auto mb-8 bg-white/90 rounded-2xl shadow-2xl border-0 p-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#2d253a] mb-6 drop-shadow-lg text-center">Register for <span className="text-[#7c4dff]">Event</span></h1>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="title" className="block text-[#364F6B] mb-1 font-semibold">Title:</label>
                            <input type="text" id="title" name="title" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c4dff] bg-[#f5f5fa]" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-[#364F6B] mb-1 font-semibold">Description:</label>
                            <input type="text" id="description" name="description" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c4dff] bg-[#f5f5fa]" />
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-[#364F6B] mb-1 font-semibold">Date:</label>
                            <input type="date" id="date" name="date" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c4dff] bg-[#f5f5fa]" />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-[#364F6B] mb-1 font-semibold">Location:</label>
                            <input type="text" id="location" name="location" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c4dff] bg-[#f5f5fa]" />
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-[#364F6B] mb-1 font-semibold">Type:</label>
                            <select id="type" name="type" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c4dff] bg-[#f5f5fa]">
                                <option value="Conference">Conference</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Webinar">Webinar</option>
                                <option value="Meetup">Meetup</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-[#364F6B] mb-1 font-semibold">Amount:</label>
                            <input type="number" id="amount" name="amount" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7c4dff] bg-[#f5f5fa]" />
                        </div>

                        {/* Full width file upload & button */}
                        <div className="md:col-span-2">
                            <label className="block text-[#364F6B] mb-1 font-semibold">Upload Files:</label>
                            <FileUpload onUploadComplete={(url) => setVideoUrl(url)} />
                        </div>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={!videoUrl}
                                className="w-full bg-gradient-to-r from-[#7c4dff] to-[#9575cd] text-white font-bold py-3 px-4 rounded-2xl shadow-xl hover:from-[#6a3fd8] hover:to-[#7e57c2] transition-all duration-300 text-lg disabled:opacity-60"
                            >
                                Register
                            </button>
                        </div>
                    </form>

                </section>
            </div>
            <Footer />
        </div>
    );
}

export default Page;
