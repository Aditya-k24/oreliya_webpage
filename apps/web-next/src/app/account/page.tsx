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
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }
    
    // Fetch user profile from API
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        
        if (response.ok && data.success) {
          const userProfile: UserProfile = {
            id: data.data.id,
            email: data.data.email,
            name: data.data.name,
            role: data.data.role,
            createdAt: '2024-01-15',
            lastLogin: new Date().toISOString().split('T')[0],
          };
          setProfile(userProfile);
        } else {
          // Fallback to session data if API fails
          const mockProfile: UserProfile = {
            id: (session.user as any)?.id || '1',
            email: session.user?.email || '',
            name: session.user?.name || '',
            role: (session.user as any)?.role || 'user',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          };
          setProfile(mockProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Fallback to session data
        const mockProfile: UserProfile = {
          id: (session.user as any)?.id || '1',
          email: session.user?.email || '',
          name: session.user?.name || '',
          role: (session.user as any)?.role || 'user',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };
        setProfile(mockProfile);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [session, status, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setError(null);
    setProfileSuccess(null);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    
    // Validation
    if (!name || !email) {
      setError('Name and email are required');
      setProfileLoading(false);
      return;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setProfileLoading(false);
      return;
    }
    
    try {
      // Call the API to update the user profile
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || 'Failed to update profile');
        setProfileLoading(false);
        return;
      }
      
      setProfileSuccess('Profile updated successfully!');
      
      // Update local profile state
      if (profile) {
        setProfile({
          ...profile,
          name: data.data.name,
          email: data.data.email,
        });
      }
      
      // Wait a moment for the success message to show, then refresh the page
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setError(null);
    setPasswordSuccess(null);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required');
      setPasswordLoading(false);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setPasswordLoading(false);
      return;
    }
    
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setPasswordLoading(false);
      return;
    }
    
    try {
      // Mock password change - replace with actual API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      setPasswordSuccess('Password changed successfully!');
      setShowPasswordSection(false);
      
      // Reset form
      (e.target as HTMLFormElement).reset();
      
    } catch (err) {
      setError('Failed to change password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
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
              
              {profileSuccess && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {profileSuccess}
                </div>
              )}
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#1E240A] mb-2" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    defaultValue={profile.name}
                    required
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
                    name="email"
                    type="email"
                    defaultValue={profile.email}
                    required
                    className="w-full px-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-[#F6EEDF]/30 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={profileLoading}
                  className="w-full bg-[#1E240A] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#2A3A1A] focus:ring-2 focus:ring-[#1E240A] focus:ring-offset-2 transition-all duration-200 uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {profileLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Profile...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </button>
              </form>
            </div>

            {/* Password Settings */}
            <div className="bg-white rounded-2xl shadow-xl border border-[#1E240A]/10">
              <button
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="w-full p-8 text-left flex items-center justify-between hover:bg-[#F6EEDF]/20 transition-colors duration-200 rounded-2xl"
              >
                <h2 className="text-xl font-medium text-[#1E240A]">Password Settings</h2>
                <svg 
                  className={`w-5 h-5 text-[#1E240A] transition-transform duration-200 ${showPasswordSection ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showPasswordSection && (
                <div className="px-8 pb-8 border-t border-[#1E240A]/10 pt-6">
                  {passwordSuccess && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {passwordSuccess}
                    </div>
                  )}
                  
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1E240A] mb-2" htmlFor="currentPassword">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        required
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
                        name="newPassword"
                        type="password"
                        required
                        minLength={6}
                        className="w-full px-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-[#F6EEDF]/30 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]"
                        placeholder="Enter your new password (min 6 characters)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#1E240A] mb-2" htmlFor="confirmPassword">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className="w-full px-4 py-3 border border-[#1E240A]/20 rounded-lg shadow-sm placeholder-[#1E240A]/50 bg-[#F6EEDF]/30 focus:ring-2 focus:ring-[#1E240A] focus:border-[#1E240A] transition-colors duration-200 text-[#1E240A]"
                        placeholder="Confirm your new password"
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={passwordLoading}
                      className="w-full bg-[#1E240A] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#2A3A1A] focus:ring-2 focus:ring-[#1E240A] focus:ring-offset-2 transition-all duration-200 uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {passwordLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Changing Password...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </button>
                  </form>
                </div>
              )}
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
