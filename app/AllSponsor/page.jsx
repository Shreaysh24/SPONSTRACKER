"use client"
import React from 'react'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Footer from '../components/edges/Footer';
import { Mail,Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AllSponsor = () => {
  const router = useRouter();
  const [sponsors, setSponsor] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchSponser(10);
  }, []);

  const fetchSponser = async (limit = 10) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/allsponsor?limit=${limit}`);
      if (!response.ok) {
        if (response.status === 404) {
          console.log("No sponsors found");
        }
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSponsor(data.sponsors);
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div id="sponsors" className="max-w-6xl mx-auto from-[#c7badd] to-[#F5F5F5] mt-20 mb-10">
        <h1 className="text-5xl font-extrabold text-left text-[#364F6B] mb-12 tracking-wide drop-shadow-md">
          Our Sponsors
        </h1>

        {loading && <p className="text-center text-[#364F6B] font-medium animate-pulse">Loading...</p>}
        {error && <p className="text-center text-red-600 font-semibold">{error}</p>}

        <div className="flex flex-col gap-10">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor._id}
              className="flex flex-col md:flex-row bg-gradient-to-br from-[#3e1087ba] to-[#3a2d4d] rounded-2xl shadow-2xl overflow-hidden border-0 hover:scale-[1.02] hover:shadow-3xl transition duration-300 text-white"
            >
              <div className="md:w-1/2 rounded-br-3xl aspect-video bg-[#00000065] flex items-center justify-center text-4xl font-bold">
                {sponsor.companyDomain}
              </div>

              <div className="md:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-bold self-center text-white mb-3 drop-shadow-lg">
                    {sponsor.companyName}
                  </h2>
                  <p className="text-[#fff] text-base italic mb-6">Contact Person: {sponsor.name}</p>

                  <div className="text-[#fff] mt-6 grid grid-cols-2 gap-4 text-xl font-semibold">
                    <div className="flex flex-row gap-2 items-center">
                      <Image src="/home/rupee.png" alt="amount" width={25} height={25} />
                      <p>{sponsor.amount}</p>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                      <Image src="/home/calendar.png" alt="createdAt" width={25} height={25} />
                      <p>{new Date(sponsor.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                      <Mail className='text-black' />
                      <p>{sponsor.email}</p>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                      <Phone className='text-black'/>
                      <p>{sponsor.contactNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    className="w-full bg-gradient-to-r from-[#7c4dff] to-[#9575cd] text-white font-bold py-2 px-6 rounded-xl shadow-lg hover:from-[#6a3fd8] hover:to-[#7e57c2] transition text-lg"
                    onClick={() => router.push(`/chats?user=${sponsor.email}`)}
                  >
                    Contact Sponsor
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

export default AllSponsor;