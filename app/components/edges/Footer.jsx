import React from 'react'
import { Github, Linkedin, Instagram  } from 'lucide-react';

const Footer = () => {
  return (
    <footer className=" bottom-0 w-full bg-gradient-to-r py-4 mt-0 from-[#d867e4] to-[#3a2d4d] px-6 flex flex-col md:flex-row items-center justify-between gap-2 border-t border-[#3a2d4d] ">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-white tracking-wide">SponsTracker</span>
        <span className="text-sm text-[#bdbdbd]">© {new Date().getFullYear()} All rights reserved.</span>
      </div>
      <div className="flex items-center gap-4">
        <a href="https://github.com/Shreaysh24" target="_blank" rel="noopener noreferrer" className="text-[#bdbdbd] hover:text-white transition">
          <Github size={22} />
        </a>
        <a href="www.linkedin.com/in/shreayshrc" target="_blank" rel="noopener noreferrer" className="text-[#bdbdbd] hover:text-white transition">
          <Linkedin size={22} />
        </a>
        <a href="https://www.instagram.com/shreaysh_24/#" target="_blank" rel="noopener noreferrer" className="text-[#bdbdbd] hover:text-white transition">
          <Instagram  size={22} />
        </a>
      </div>
    </footer>
  )
}

export default Footer