'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  lastLogin: string;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    // Mock user profile data - replace with actual API call when backend is ready
    const mockProfile: UserProfile = {
      id: (session.user as any)?.id || '1',
      email: session.user?.email || '',
      name: session.user?.name || '',
      role: (session.user as any)?.role || 'user',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    setProfile(mockProfile);
    setLoading(false);
  }, [session, status, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock profile update - replace with actual API call when backend is ready
    console.log('Profile update requested');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock password change - replace with actual API call when backend is ready
    console.log('Password change requested');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#F6EEDF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1E240A] mx-auto"></div>
          <p className="mt-4 text-[#1E240A]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F6EEDF]">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-[#1E240A] mb-2">My Account</h1>
          <p className="text-[#1E240A]/70">Manage your account settings and preferences</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Overview */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#1E240A]/10">
              <h2 className="text-xl font-medium text-[#1E240A] mb-6">Account Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#1E240A]/70 mb-2">
                    Full Name
                  </label>
                  <p className="text-[#1E240A] font-medium">{profile.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1E240A]/70 mb-2">
                    Email Address
                  </label>
                  <p className="text-[#1E240A] font-medium">{profile.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1E240A]/70 mb-2">
                    Account Type
                  </label>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                    profile.role === 'admin' 
                      ? 'bg-[#1E240A] text-white' 
                      : 'bg-[#F6EEDF] text-[#1E240A] border border-[#1E240A]/20'
                  }`}>
                    {profile.role === 'admin' ? 'Administrator' : 'Customer'}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1E240A]/70 mb-2">
                    Member Since
                  </label>
                  <p className="text-[#1E240A] font-medium">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Settings */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#1E240A]/10">
              <h2 className="text-xl font-medium text-[#1E240A] mb-6">Profile Settings</h2>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#1E240A] mb-2" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    defaultValue={profile.name}
                    className="w-full px-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-[#F6EEDF]/30 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1E240A] mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    defaultValue={profile.email}
                    className="w-full px-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-[#F6EEDF]/30 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-[#1E240A] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#2A3A1A] focus:ring-2 focus:ring-[#1E240A] focus:ring-offset-2 transition-all duration-200 uppercase tracking-wider text-sm"
                >
                  Update Profile
                </button>
              </form>
            </div>

            {/* Password Settings */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#1E240A]/10">
              <h2 className="text-xl font-medium text-[#1E240A] mb-6">Password Settings</h2>
              
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#1E240A] mb-2" htmlFor="currentPassword">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    className="w-full px-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-[#F6EEDF]/30 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]"
                    placeholder="Enter your current password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1E240A] mb-2" htmlFor="newPassword">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    className="w-full px-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-[#F6EEDF]/30 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]"
                    placeholder="Enter your new password"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1E240A] mb-2" htmlFor="confirmPassword">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="w-full px-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-[#F6EEDF]/30 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]"
                    placeholder="Confirm your new password"
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-[#1E240A] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#2A3A1A] focus:ring-2 focus:ring-[#1E240A] focus:ring-offset-2 transition-all duration-200 uppercase tracking-wider text-sm"
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#1E240A]/10">
              <h3 className="text-lg font-medium text-[#1E240A] mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link
                  href="/products"
                  className="block w-full text-left px-4 py-3 text-[#1E240A] hover:bg-[#1E240A]/5 rounded-lg transition-colors duration-200"
                >
                  Browse Products
                </Link>
                
                {profile.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="block w-full text-left px-4 py-3 text-[#1E240A] hover:bg-[#1E240A]/5 rounded-lg transition-colors duration-200"
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                <Link
                  href="/customization"
                  className="block w-full text-left px-4 py-3 text-[#1E240A] hover:bg-[#1E240A]/5 rounded-lg transition-colors duration-200"
                >
                  Custom Design
                </Link>
                
                <Link
                  href="/contact"
                  className="block w-full text-left px-4 py-3 text-[#1E240A] hover:bg-[#1E240A]/5 rounded-lg transition-colors duration-200"
                >
                  Contact Support
                </Link>
              </div>
            </div>

            {/* Account Statistics */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-[#1E240A]/10">
              <h3 className="text-lg font-medium text-[#1E240A] mb-4">Account Statistics</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#1E240A]/70 text-sm">Member Since</span>
                  <span className="text-[#1E240A] font-medium">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[#1E240A]/70 text-sm">Last Login</span>
                  <span className="text-[#1E240A] font-medium">
                    {new Date(profile.lastLogin).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[#1E240A]/70 text-sm">Account Type</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    profile.role === 'admin' 
                      ? 'bg-[#1E240A] text-white' 
                      : 'bg-[#F6EEDF] text-[#1E240A] border border-[#1E240A]/20'
                  }`}>
                    {profile.role === 'admin' ? 'Admin' : 'Customer'}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-[#1E240A]/5 rounded-2xl p-6 border border-[#1E240A]/10">
              <h4 className="text-[#1E240A] font-medium mb-2">Security Notice</h4>
              <p className="text-[#1E240A]/70 text-sm">
                Your account is secure. If you notice any suspicious activity, please contact support immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
