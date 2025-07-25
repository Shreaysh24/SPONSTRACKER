"use client"
import { useEffect, useState } from "react";
import Image from 'next/image'
import Header from "./components/edges/Header";
import Footer from "./components/edges/Footer";
import Link from "next/link";
import { useSession } from "next-auth/react";



export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  console.log('Session:', session);





  useEffect(() => {
    fetchEvents(2);
  }, []);

  const fetchEvents = async (limit = 2) => {
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
      <Header />
      <div className="min-h-screen mt-12 mb-0 bg-gradient-to-br from-[#c7badd] to-[#F5F5F5] px-6 py-10">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto mb-16 flex flex-col md:flex-row items-center ">
          <div className="flex-1">
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#2d253a] mb-6 drop-shadow-lg leading-tight">
              Welcome to <span className="text-[#7c4dff]">SponsTracker</span>
            </h1>
            <p className="text-xl text-[#3a2d4d] mb-8 font-medium">
              Empowering organizations to manage, promote, and track their events with ease. From conferences to workshops, SponsTracker helps you create memorable experiences and connect with your audience. Join us and make your next event a success!
            </p>
            <a href="#events" className="inline-block bg-gradient-to-r from-[#7c4dff] to-[#9575cd] text-white font-bold py-3 px-8 rounded-2xl shadow-xl hover:from-[#6a3fd8] hover:to-[#7e57c2] transition-all duration-300 text-lg">
              Get Started
            </a>
          </div>
          <div className="flex-1 flex justify-center">
            <Image src="/home/cal1.png" alt="Event" width={620} height={620} className="rounded-2xl  p-6" />
          </div>
        </section>
        {/* Fetched Events */}
        <div id="events" className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-extrabold text-left text-[#364F6B] mb-12 tracking-wide drop-shadow-md">
            Upcoming Events
          </h1>
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
                      <Image
                        src={e.videoUrl}
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
                        <Image src="/home/calendar.png" alt="calendar" width={25} height={25} />
                        <p>{new Date(e.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-row gap-2 items-center">
                        <Image src="/home/pin.png" alt="location" width={25} height={25} />
                        <p>{e.location}</p>
                      </div>
                      <div className="flex flex-row gap-2 items-center">
                        <Image src="/home/check.png" alt="type" width={25} height={25} />
                        <p>{e.type}</p>
                      </div>
                      <div className="flex flex-row gap-2 items-center">
                        <Image src="/home/rupee.png" alt="amount" width={25} height={25} />
                        <p>{e.amount}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button
                      className=" w-full bg-gradient-to-r from-[#7c4dff] to-[#9575cd] text-white font-bold py-2 px-6 rounded-xl shadow-lg hover:from-[#6a3fd8] hover:to-[#7e57c2] transition text-lg"
                      onClick={() => window.location = `mailto:contact@sponstracker.com?subject=Enquiry about ${e.title}`}
                    >
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {loading ? <p className="text-center text-[#364F6B] font-medium animate-pulse">Loading...</p> :
            (
              <div className="text-center cursor-pointer font-extrabold mt-10">
                <Link href='/AllEvents'>Load more..</Link>
              </div>
            )}
        </div>

        {/* Big Event Example Section */}
        <section className="w-full bg-gradient-to-r py-16 mt-0">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 px-4">
            <div className="flex-1">
              <Image src="/home/cal2.png" alt="Big Event" width={400} height={300} className="rounded-2xl  p-4" />
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-[#2d253a] mb-4">Annual Tech Summit 2023</h2>
              <p className="text-lg text-[#3a2d4d] mb-6">SponsTracker powered the Annual Tech Summit, bringing together 2,000+ attendees, 50+ speakers, and 30+ sponsors for a day of innovation and networking. Our platform ensured seamless registration, real-time updates, and a memorable experience for all.</p>
              <div className="flex gap-8 text-[#7c4dff] font-bold text-xl">
                <div>
                  <span className="block text-3xl">2,000+</span>
                  Attendees
                </div>
                <div>
                  <span className="block text-3xl">50+</span>
                  Speakers
                </div>
                <div>
                  <span className="block text-3xl">30+</span>
                  Sponsors
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="w-full py-16 bg-gradient-to-r from-[#2d253a]/90 to-[#3a2d4d]/90">
          <div className="max-w-3xl mx-auto text-center px-4">
            <svg className="mx-auto mb-6" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17a4 4 0 01-4-4V7a4 4 0 014-4h3a4 4 0 014 4v6a4 4 0 01-4 4H7zm10 0a4 4 0 01-4-4V7a4 4 0 014-4h3a4 4 0 014 4v6a4 4 0 01-4 4h-3z" /></svg>
            <p className="text-2xl md:text-3xl text-white font-semibold mb-6 italic">
              &quot;SponsTracker made our event a breeze! The platform was intuitive, the support was fantastic, and our attendees loved the experience. Highly recommended for any organization looking to elevate their events.&quot;
            </p>

            <div className="flex flex-col items-center gap-2">
              <Image src="/home/check.png" alt="User" width={56} height={56} className="rounded-full border-4 border-[#7c4dff]" />
              <span className="text-lg text-white font-bold">Priya Sharma</span>
              <span className="text-[#bdbdbd]">Event Manager, Tech Summit</span>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}