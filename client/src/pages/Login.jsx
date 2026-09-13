import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api.js";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const body = isRegister ? { name, email, password } : { email, password };
      const data = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body)
      });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header - App Title */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-deep-indigo text-white shadow-soft">
              <svg className="h-8 w-8 text-soft-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
          <h1 className="font-brand text-3xl font-bold italic tracking-wide text-deep-indigo">Project Management</h1>
          <p className="mt-1 text-sm text-soft-stone">Clarity & Calm Productivity Workspace</p>
        </div>

        {/* Login/Register Card */}
        <div className="rounded-xl bg-pure-white p-8 shadow-soft border border-light-grey">
          <h2 className="mb-6 text-center text-xl font-semibold text-dark-slate">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>
          {error && (
            <div className="mb-4 rounded-lg bg-muted-rose/10 border border-muted-rose/20 p-3 text-xs font-medium text-muted-rose">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isRegister && (
              <div>
                <label className="mb-1 block text-xs font-medium text-soft-stone">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}
            <div>
              <label className="mb-1 block text-xs font-medium text-soft-stone">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-soft-stone">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="mt-2 btn-primary w-full text-sm py-3"
            >
              {isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-soft-stone">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="font-semibold text-soft-coral hover:underline"
            >
              {isRegister ? "Sign In" : "Create Account"}
            </button>
          </p>
        </div>

        {/* Demo Credentials - Only show on Login */}
        {!isRegister && (
          <div className="mt-6 rounded-xl bg-pure-white border border-light-grey p-5 shadow-soft">
            <div className="mb-3 flex items-center gap-2">
              <svg className="h-4 w-4 text-soft-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-dark-slate">Demo Credentials</h3>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="rounded-lg bg-soft-mist p-3 border border-light-grey">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-semibold text-dark-slate">John Doe</span>
                  <span className="rounded-full bg-soft-coral/10 px-2 py-0.5 text-[11px] font-semibold text-soft-coral">Project Manager</span>
                </div>
                <div className="space-y-0.5 text-soft-stone">
                  <div>Email: <code className="text-deep-indigo font-mono">john@example.com</code></div>
                  <div>Password: <code className="text-deep-indigo font-mono">password123</code></div>
                </div>
              </div>
              
              <div className="rounded-lg bg-soft-mist p-3 border border-light-grey">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-semibold text-dark-slate">Jane Smith</span>
                  <span className="rounded-full bg-muted-sage/15 px-2 py-0.5 text-[11px] font-semibold text-muted-sage">Team Member</span>
                </div>
                <div className="space-y-0.5 text-soft-stone">
                  <div>Email: <code className="text-deep-indigo font-mono">jane@example.com</code></div>
                  <div>Password: <code className="text-deep-indigo font-mono">password123</code></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-grey">
          © 2026 Project Management App. Clarity & Calm Productivity.
        </p>
      </div>
    </div>
  );
}
