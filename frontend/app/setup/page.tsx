'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Setup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    seniorName: '',
    seniorPhone: '',
    address: '',
    seniorEmail: '',
    caregiverName: '',
    caregiverEmail: '',
    restaurants: [] as Array<{ name: string; doordashUrl: string; usualOrder: string }>,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create user
      const response = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.seniorName,
          phone: formData.seniorPhone,
          address: formData.address,
          email: formData.seniorEmail,
          caregiverName: formData.caregiverName,
          caregiverEmail: formData.caregiverEmail,
        }),
      });

      if (!response.ok) throw new Error('Failed to create user');

      // Add restaurants
      for (const restaurant of formData.restaurants) {
        await fetch(`http://localhost:3001/api/users/${formData.seniorPhone}/restaurants`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(restaurant),
        });
      }

      alert('✅ Setup complete! Your loved one can now call the number to start ordering.');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Setup error:', error);
      alert('Error during setup. Please try again.');
    }
  };

  const addRestaurant = () => {
    setFormData({
      ...formData,
      restaurants: [...formData.restaurants, { name: '', doordashUrl: '', usualOrder: '' }],
    });
  };

  const updateRestaurant = (index: number, field: string, value: string) => {
    const updated = [...formData.restaurants];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, restaurants: updated });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              SeniorAssist
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-2">Setup New Profile</h1>
        <p className="text-gray-600 mb-8">
          Help your loved one get started in just a few steps
        </p>

        <div className="mb-8 flex justify-between">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded ${
                s <= step ? 'bg-blue-600' : 'bg-gray-300'
              } ${s < 3 ? 'mr-2' : ''}`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Step 1: Senior Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Senior's Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.seniorName}
                    onChange={(e) => setFormData({ ...formData, seniorName: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Senior's Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.seniorPhone}
                    onChange={(e) => setFormData({ ...formData, seniorPhone: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="+1234567890"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This is the number they'll call from
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Home Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="123 Main St, City, ST 12345"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Default delivery address
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Senior's Email (optional)</label>
                  <input
                    type="email"
                    value={formData.seniorEmail}
                    onChange={(e) => setFormData({ ...formData, seniorEmail: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Next →
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Step 2: Caregiver Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.caregiverName}
                    onChange={(e) => setFormData({ ...formData, caregiverName: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="Jane Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Your Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.caregiverEmail}
                    onChange={(e) => setFormData({ ...formData, caregiverEmail: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="jane@example.com"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    You'll receive order confirmations here
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Step 3: Favorite Restaurants</h2>
              <p className="text-gray-600 mb-4">
                Add restaurants they order from frequently (optional but recommended)
              </p>

              {formData.restaurants.map((restaurant, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4">
                  <h3 className="font-medium mb-3">Restaurant {index + 1}</h3>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Restaurant name (e.g., Giuseppe's Pizza)"
                      value={restaurant.name}
                      onChange={(e) => updateRestaurant(index, 'name', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                    
                    <input
                      type="url"
                      placeholder="DoorDash URL (e.g., https://www.doordash.com/...)"
                      value={restaurant.doordashUrl}
                      onChange={(e) => updateRestaurant(index, 'doordashUrl', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                    
                    <input
                      type="text"
                      placeholder="Usual order (e.g., Large pepperoni pizza)"
                      value={restaurant.usualOrder}
                      onChange={(e) => updateRestaurant(index, 'usualOrder', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addRestaurant}
                className="mb-6 text-blue-600 font-medium hover:text-blue-700"
              >
                + Add Restaurant
              </button>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Complete Setup ✓
                </button>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
