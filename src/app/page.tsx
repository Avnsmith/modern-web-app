'use client';

import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            MyApp
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-white hover:text-purple-300 transition-colors">Home</a>
            <a href="#" className="text-white hover:text-purple-300 transition-colors">About</a>
            <a href="#" className="text-white hover:text-purple-300 transition-colors">Services</a>
            <a href="#" className="text-white hover:text-purple-300 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Welcome to the
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}Future
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Experience the next generation of web applications with cutting-edge technology and beautiful design.
          </p>
          
          {/* Interactive Counter */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Interactive Counter</h2>
            <div className="text-6xl font-bold text-purple-400 mb-4">{count}</div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setCount(count - 1)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Decrease
              </button>
              <button
                onClick={() => setCount(0)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setCount(count + 1)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Increase
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
              Get Started
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all">
              Learn More
            </button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-semibold text-white mb-4">Lightning Fast</h3>
              <p className="text-gray-300">
                Built with Next.js and optimized for performance. Experience blazing fast load times and smooth interactions.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-2xl font-semibold text-white mb-4">Beautiful Design</h3>
              <p className="text-gray-300">
                Modern, responsive design that looks great on all devices. Crafted with attention to detail and user experience.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-2xl font-semibold text-white mb-4">Secure & Reliable</h3>
              <p className="text-gray-300">
                Enterprise-grade security and reliability. Your data is safe with our robust infrastructure and best practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-300">
            © 2024 MyApp. Built with Next.js and deployed on Vercel.
          </p>
        </div>
      </footer>

      {/* Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>
    </div>
  );
}
