import React from 'react'

const About = () => {
  return (
    <section className="px-6 py-16 bg-white text-gray-800">
  <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
    
    {/* Left: Text Content */}
    <div className="md:w-2/3">
      <h3 className="text-purple-500 font-semibold tracking-wide uppercase mb-2">
        Intro
      </h3>
      <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
        About GenMail
      </h2>
      <p className="text-lg leading-relaxed mb-4">
        I'm Suj, the creator of GenMail. I started this project with a deep interest in simplifying communication through AI. GenMail helps users craft high-quality, thoughtful replies to any email in seconds — no stress, no overthinking.
      </p>
      <p className="text-lg leading-relaxed">
        Whether you're replying to a boss, colleague, or friend — GenMail adapts to your tone and intent. It’s built for clarity, speed, and professionalism. Just paste an email and get a context-aware response instantly.
      </p>
    </div>

    {/* Right: Image */}
    <div className="md:w-1/3 flex justify-center md:justify-end">
      <img
        src="/your-photo.jpg"
        alt="Your face or logo"
        className="w-48 h-48 md:w-60 md:h-60 object-cover rounded-2xl shadow-lg"
      />
    </div>
  </div>
</section>

  )
}

export default About