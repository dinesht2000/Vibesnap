import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const {
    user,
    loading: authLoading,
    profileComplete,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
  } = useAuth();

  // Redirect if already authenticated
  if (!authLoading && user) {
    if (profileComplete === false) {
      return <Navigate to="/profile-setup" replace />;
    }
    if (profileComplete === true) {
      return <Navigate to="/feed" replace />;
    }
  }

  // Login through Email & Password
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError("Please enter your name");
          setLoading(false);
          return;
        }
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      // Navigation will be handled by useEffect above
    } catch (err: unknown) {
      let errorMessage = isSignUp ? "Failed to sign up" : "Failed to sign in";
      const error = err as { code?: string; message?: string };

      if (error?.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error?.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled";
      } else if (error?.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (error?.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (error?.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password";
      } else if (error?.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use";
      } else if (error?.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Login through google
  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
      // Navigation will be handled by useEffect above
    } catch (err: unknown) {
      let errorMessage = "Failed to sign in with Google";
      const error = err as { code?: string; message?: string };

      if (error?.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign in was cancelled";
      } else if (error?.code === "auth/popup-blocked") {
        errorMessage = "Popup was blocked. Please allow popups for this site";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  // Show loading if checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <div className="text-gray-300">Loading...</div>
      </div>
    );
  }

  // Don't show login form if already authenticated (redirect will happen)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <div className="text-gray-300">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gray-800 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1200&fit=crop&q=80"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Login card */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="bg-white rounded-t-3xl px-8 pt-8 pb-10 shadow-2xl">
          {/* Vibesnap Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                {/* Camera body */}
                <rect
                  x="12"
                  y="16"
                  width="24"
                  height="18"
                  rx="2"
                  fill="#1F2937"
                />
                <circle cx="24" cy="25" r="6" fill="#F3F4F6" />
                <circle cx="24" cy="25" r="3" fill="#1F2937" />
                {/* Colorful flowing lines from lens */}
                <path
                  d="M24 19 L26 15 L28 17"
                  stroke="#EC4899"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M30 23 L34 21 L33 25"
                  stroke="#F97316"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M30 27 L34 29 L33 25"
                  stroke="#14B8A6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M24 31 L26 35 L28 33"
                  stroke="#A855F7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M18 27 L14 29 L15 25"
                  stroke="#EC4899"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M18 23 L14 21 L15 25"
                  stroke="#F97316"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <h1 className="text-3xl font-bold text-gray-900">Vibesnap</h1>
            </div>
            <p className="text-gray-600 text-sm">
              Moments That Matter, Shared Forever.
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          {!showEmailForm ? (
            <>
              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-black text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-3 mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Email/Password option */}
              <div className="text-center">
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="text-sm text-gray-600 font-semibold"
                >
                  {isSignUp
                    ? "Already have an account? Sign in"
                    : "Sign in with email"}
                </button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleEmailAuth} className="space-y-4 mb-4">
                {isSignUp && (
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isSignUp}
                      disabled={loading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                      placeholder="Enter your name"
                    />
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading
                    ? "Please wait..."
                    : isSignUp
                    ? "Sign Up"
                    : "Sign In"}
                </button>
              </form>

              <div className="text-center space-y-2">
                <button
                  onClick={() => {
                    setShowEmailForm(false);
                    setError("");
                  }}
                  className="text-sm text-gray-600 font-semibold block w-full"
                >
                  Back to Google sign in
                </button>
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {isSignUp
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign up"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
