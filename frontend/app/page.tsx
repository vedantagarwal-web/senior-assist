'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">SeniorAssist</h1>
            </div>
            <div className="flex gap-4">
              <Link href="/setup" className="text-gray-700 hover:text-blue-600">
                Setup
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Voice-Powered Assistance for Seniors
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Order food, book rides, and more — all with a simple phone call
          </p>
          
          <div className="flex justify-center gap-4">
            <Link 
              href="/setup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link 
              href="/dashboard"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <FeatureCard 
            icon="📞"
            title="Simple Phone Call"
            description="Seniors just call a number and speak naturally — no apps to learn"
          />
          <FeatureCard 
            icon="🍕"
            title="Order Food"
            description="Order from favorite restaurants with saved preferences"
          />
          <FeatureCard 
            icon="🚗"
            title="Book Rides"
            description="Get Uber rides to appointments, errands, and visits (coming soon)"
          />
          <FeatureCard 
            icon="💳"
            title="Secure Payments"
            description="Family members manage payment methods safely"
          />
          <FeatureCard 
            icon="📊"
            title="Order History"
            description="Track all orders and rides in one dashboard"
          />
          <FeatureCard 
            icon="🛡️"
            title="Caregiver Portal"
            description="Set preferences, add favorites, monitor activity"
          />
        </div>

        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4">How It Works</h3>
          <ol className="space-y-4">
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">1</span>
              <div>
                <strong>Setup:</strong> Family member creates profile, adds addresses, favorite restaurants, payment method
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">2</span>
              <div>
                <strong>Call:</strong> Senior calls the dedicated phone number
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">3</span>
              <div>
                <strong>Speak:</strong> AI assistant guides through ordering/booking with natural conversation
              </div>
            </li>
            <li className="flex items-start">
              <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">4</span>
              <div>
                <strong>Delivered:</strong> Food arrives or ride is booked — simple as that!
              </div>
            </li>
          </ol>
        </div>
      </main>

      <footer className="bg-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>Built with ❤️ for making technology accessible</p>
          <p className="text-sm mt-2">Hackathon MVP — Demo Only</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
