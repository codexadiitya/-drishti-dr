import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanEye, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    // Simulate API call — replace with real auth
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);

    // Demo: any non-empty credentials work
    navigate('/');
  }

  function useDemoCredentials() {
    setEmail('doctor@netrarakshaq.in');
    setPassword('demo1234');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center p-4">

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl card-shadow-md border border-gray-100 overflow-hidden">

        {/* Top blue strip */}
        <div className="bg-blue-600 px-8 py-8 text-white text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <ScanEye size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">NetraRakshaq</span>
          </div>
          <p className="text-blue-100 text-sm">AI-Assisted Retinal Screening Platform</p>
          <p className="text-blue-200 text-xs mt-1">Serving rural communities across India</p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Welcome back</h2>
          <p className="text-sm text-gray-400 mb-6">Sign in to access the screening dashboard</p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@hospital.org"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <button type="button" className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer disabled:cursor-wait mt-2 shadow-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>Sign in <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={14} className="text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">Demo Credentials</span>
            </div>
            <p className="text-xs text-blue-600 mb-2">
              This is a prototype. Use the demo account to explore the platform.
            </p>
            <button
              type="button"
              onClick={useDemoCredentials}
              className="text-xs text-blue-700 font-medium underline underline-offset-2 cursor-pointer hover:text-blue-900"
            >
              Fill demo credentials automatically →
            </button>
            <div className="mt-2 space-y-0.5 text-[11px] text-blue-500 font-mono">
              <div>Email: doctor@netrarakshaq.in</div>
              <div>Password: demo1234</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-gray-400 text-center max-w-sm leading-relaxed">
        NetraRakshaq is an AI-assisted screening tool. All results require validation by a qualified ophthalmologist before clinical use.
      </p>
    </div>
  );
}
