"use client"
import React from 'react'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Footer from '../components/edges/Footer';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";

const AllEvents = () => {
  const { data: session } = useSession();
  // console.log('Session:', session);
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchEvents(10);
  }, []);

  const fetchEvents = async (limit = 10) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/video?limit=${limit}`);
      if (!response.ok) {
        if (response.status === 404) {
          console.log("No events found");
        }
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched events:", data);
      setEvents(data.events);
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {/* Fetched Events */}
      <div id="events" className="max-w-6xl mx-auto from-[#c7badd] to-[#F5F5F5]  mt-20 mb-10">
        <h1 className="text-5xl font-extrabold text-left text-[#364F6B] mb-12 tracking-wide drop-shadow-md">
          Upcoming Events
        </h1>
        {loading && <p className="text-center text-[#364F6B] font-medium animate-pulse">Loading...</p>}
        {error && <p className="text-center text-red-600 font-semibold">{error}</p>}

        <div className="flex flex-col gap-10">
          {events.map((e) => (
            <div
              key={e._id}
              className="flex flex-col md:flex-row bg-gradient-to-br from-[#3e1087ba] to-[#3a2d4d] rounded-2xl shadow-2xl overflow-hidden border-0 hover:scale-[1.02] hover:shadow-3xl transition duration-300 text-white"
            >
              <div className="md:w-1/2 aspect-video bg-[#3FC1C9] flex items-center justify-center">
                {e.videoUrl && e.videoUrl.toLowerCase().endsWith(".mp4") ? (
                  <video
                    controls
                    className="w-full h-full object-cover rounded-none"
                  >
                    <source src={e.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  e.videoUrl && (
                    < Image
                      src={e.videoUrl}
                      width={600}
                      height={256}
                      alt="Event Visual"
                      className="w-full h-full object-cover rounded-none"
                    />
                  )
                )}
              </div>

              <div className="md:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold self-center text-white mb-3 drop-shadow-lg">{e.title}</h2>
                  <p className="text-[#fff] text-base italic mb-6">{e.description}</p>
                  <div className="text-[#fff] mt-6 grid grid-cols-2 gap-4 text-xl font-semibold">
                    <div className="flex flex-row gap-2 items-center">
                      < Image src="/home/calendar.png" alt="calendar" width={25} height={25} />
                      <p>{new Date(e.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                      < Image src="/home/pin.png" alt="location" width={25} height={25} />
                      <p>{e.location}</p>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                      < Image src="/home/check.png" alt="type" width={25} height={25} />
                      <p>{e.type}</p>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                      < Image src="/home/rupee.png" alt="amount" width={25} height={25} />
                      <p>{e.amount}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    className=" w-full bg-gradient-to-r from-[#7c4dff] to-[#9575cd] text-white font-bold py-2 px-6 rounded-xl shadow-lg hover:from-[#6a3fd8] hover:to-[#7e57c2] transition text-lg"
                    onClick={() => router.push(`/chats?user=${e.userEmail}`)} >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AllEvents;