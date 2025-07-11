"use client";

import React, { useState,useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import { useSession} from "next-auth/react";
import {  useRouter } from 'next/navigation';

function Page() {
    const { data: session } = useSession();
    const [loaded, setLoaded] = useState(true);
    const [videoUrl, setVideoUrl] = useState("");

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoUrl) {
            alert("Please upload a video before submitting the form.");
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
            router.push('/dashboard'); // Redirect to dashboard

        } else {
            alert(`Error: ${result.error || "Failed to register event"}`);
        }

    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl p-8 border-t-4 border-[#3FC1C9]">
                <h1 className="text-3xl font-bold text-center text-[#364F6B] mb-6">Register for Event</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="title" className="block text-[#364F6B] mb-1">Title:</label>
                        <input type="text" id="title" name="title" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FC1C9]" />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-[#364F6B] mb-1">Description:</label>
                        <input type="text" id="description" name="description" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FC1C9]" />
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-[#364F6B] mb-1">Date:</label>
                        <input type="date" id="date" name="date" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FC1C9]" />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-[#364F6B] mb-1">Location:</label>
                        <input type="text" id="location" name="location" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FC1C9]" />
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-[#364F6B] mb-1">Type:</label>
                        <select id="type" name="type" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FC1C9]">
                            <option value="Conference">Conference</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Webinar">Webinar</option>
                            <option value="Meetup">Meetup</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-[#364F6B] mb-1">Amount:</label>
                        <input type="number" id="amount" name="amount" required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FC1C9]" />
                    </div>
                    <div>
                        <label className="block text-[#364F6B] mb-1">Upload Files:</label>
                        <FileUpload onUploadComplete={(url) => setVideoUrl(url)} />
                    </div>
                    <button type="submit" disabled={!videoUrl} className="w-full bg-[#3FC1C9] hover:bg-[#32abb3] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Page;
