import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight } from 'lucide-react';
import { useApp } from '../context';
import { authService } from '../services/api';

const Auth = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.sendOtp(phone);
      setStep('otp');
    } catch (err) {
      setError('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await authService.verifyOtp(phone, otp);
      if (user) {
        login(user);
        navigate('/');
      }
    } catch (err) {
      setError('Invalid OTP. (Try 1234)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500">Login to access your orders</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan"
                  placeholder="9876543210"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-cyan text-white py-3 rounded-lg font-bold hover:bg-cyan-600 transition flex justify-center items-center"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <p className="text-xs text-center text-gray-500">
              For demo, use 1234 as OTP for any number. <br/>
              Use 6302382280 for Admin Access.
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
              <div className="flex justify-center gap-2">
                 <input 
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center tracking-[1em] pl-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-cyan"
                  placeholder="••••"
                  maxLength={4}
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand-cyan text-white py-3 rounded-lg font-bold hover:bg-cyan-600 transition flex justify-center items-center gap-2"
            >
              {loading ? 'Verifying...' : <>Verify & Login <ArrowRight size={18} /></>}
            </button>
            <button 
              type="button" 
              onClick={() => setStep('phone')}
              className="w-full text-gray-500 text-sm hover:underline"
            >
              Change Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;