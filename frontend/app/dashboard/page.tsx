'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

interface Order {
  id: number;
  restaurant_name: string;
  items: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState(searchParams.get('phone') || '');
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('phone')) {
      loadData();
    }
  }, []);

  const loadData = async () => {
    if (!phone) {
      setError('Please enter a phone number');
      return;
    }
    
    setLoading(true);
    setError('');
    setUser(null);
    setOrders([]);
    
    try {
      // Fetch user
      const userRes = await fetch(`http://localhost:3001/api/users/${encodeURIComponent(phone)}`);
      if (!userRes.ok) {
        if (userRes.status === 404) {
          throw new Error('User not found. Please check the phone number or create a new profile.');
        }
        throw new Error('Failed to load user data');
      }
      const userData = await userRes.json();
      setUser(userData.user);

      // Fetch orders
      const ordersRes = await fetch(`http://localhost:3001/api/users/${encodeURIComponent(phone)}/orders`);
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.orders);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      setError(error.message || 'Error loading data. Make sure the backend is running.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              SeniorAssist
            </Link>
            <Link href="/setup" className="text-blue-600 hover:text-blue-700">
              + New Profile
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8 mt-4">
          <h2 className="text-lg font-semibold mb-4">Select Profile</h2>
          <div className="flex gap-4">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number (+1234567890)"
              className="flex-1 border rounded-lg px-4 py-2"
            />
            <button
              onClick={loadData}
              disabled={loading || !phone}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Loading...</span>
                </>
              ) : (
                'Load Profile'
              )}
            </button>
          </div>
        </div>

        {user && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Senior's Name</label>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <p className="font-medium">{user.phone}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Address</label>
                  <p className="font-medium">{user.address}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Caregiver</label>
                  <p className="font-medium">{user.caregiver_name}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Order History</h2>
              
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No orders yet. Call {process.env.NEXT_PUBLIC_PHONE_NUMBER || 'the number'} to place your first order!
                </p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{order.restaurant_name}</h3>
                          <p className="text-gray-600">{order.items}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {loading && (
          <div className="bg-white rounded-lg shadow-md p-12 flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        )}

        {!user && !loading && !error && (
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Get Started</h3>
            <p className="text-gray-600 mb-4">
              Enter a phone number above to view profile and order history, or create a new profile
            </p>
            <Link
              href="/setup"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create New Profile
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
