import React, { useState, useEffect } from "react";
import PrivacyPolicy from "./static/PrivacyPolicy";
import { validatePhoneNumber } from "../utils/validatePhoneNumber";
import "../index.css";
import bgImg from "../assets/otp-bg.png";
import logo from "../assets/NavLogo.png";
import { auth } from "../../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { verifyPhoneAuth, setAuthTokens } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Signup = ({ onAuthSuccess }) => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  // Privacy policy modal/event logic removed
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [step, setStep] = useState("phone"); // Only "phone" and "otp" steps
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Cleanup reCAPTCHA on component unmount
  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          theme: "light",
          callback: (response) => {
            // reCAPTCHA verification successful
          },
          "expired-callback": () => {
            // Clear and recreate verifier on expiry
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
            setupRecaptcha();
          },
          "error-callback": (error) => {
            setError("reCAPTCHA verification failed. Please try again.");
          },
        }
      );
    }
  };

  const handleSendOtp = async () => {
    if (!validatePhoneNumber(phone)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setError("");
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const fullPhone = "+91" + phone;
      const result = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
      setConfirmationResult(result);
      setStep("otp");
      // OTP sent successfully
    } catch (err) {
      console.error("OTP send error:", err);
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) {
      setError("Please request OTP first");
      return;
    }

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Verify OTP with Firebase
      const result = await confirmationResult.confirm(otp);

      // Get Firebase ID token
      const firebaseToken = await result.user.getIdToken();

      // Authenticate with backend - no name needed
      const authResponse = await verifyPhoneAuth(firebaseToken);

      // Success - user authenticated (new or existing)
      setAuthTokens(authResponse.token, authResponse.refreshToken);

      // Use auth context to login
      login(authResponse.user, authResponse.token, authResponse.refreshToken);

      if (onAuthSuccess) {
        onAuthSuccess(
          authResponse.user,
          authResponse.token,
          authResponse.refreshToken
        );
      }

      // Navigate to intended page or home
      const intendedPath = location.state?.from || "/";
      navigate(intendedPath, { replace: true });

      // Authentication completed successfully
    } catch (err) {
      console.error("OTP verification error:", err);
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setPhone("");
    setOtp("");
    setStep("phone");
    setConfirmationResult(null);
    setError("");

    // Clear reCAPTCHA
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100">
      <div
        className="mt-6 p-4 sm:p-10 rounded-lg shadow-lg w-full max-w-md sm:max-w-2xl text-center min-h-[400px] sm:min-h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <div className="backdrop-blur-md p-4 sm:p-6 rounded-lg">
          {/* Logo */}
          <img
            src={logo}
            alt="Afford INDIA Logo"
            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-2 object-contain drop-shadow-lg"
          />

          <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 whitespace-nowrap">
            Welcome to <span className="text-black font-bold">Afford INDIA</span>
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Your one-stop destination for quality products
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Phone Input Step */}
          {step === "phone" && (
            <>
              <div className="text-left mb-4">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Enter Mobile Number
                </label>
                <p className="text-xs text-gray-500 mb-1">
                  (We will send you an OTP to verify your number)
                </p>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Enter your number"
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-300 text-base sm:text-lg"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div id="recaptcha-container" className="mb-4" />
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-[#B76E79] text-white font-semibold py-2 rounded hover:bg-[#C68F98] transition disabled:bg-gray-400"
              >
                {loading ? "Sending..." : "GET OTP"}
              </button>
            </>
          )}

          {/* OTP Input Step */}
          {step === "otp" && (
            <>
              <div className="text-left mt-6 mb-2">
                <label
                  htmlFor="otp"
                  className="text-sm font-medium text-gray-700"
                >
                  Enter OTP
                </label>
                <p className="text-xs text-gray-500 mb-1">
                  We've sent a 6-digit code to +91{phone}
                </p>
              </div>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-300 mb-4 text-base sm:text-lg"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                disabled={loading}
              />

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-[#B76E79] text-white font-semibold py-2 rounded hover:bg-[#C68F98] transition disabled:bg-gray-400 mb-2"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                onClick={resetFlow}
                disabled={loading}
                className="w-full bg-gray-600 text-white font-semibold py-2 rounded hover:bg-gray-700 transition"
              >
                Change Number
              </button>
            </>
          )}

          {/* Terms */}
          <p className="text-xs text-gray-500 mt-4">
            By continuing, I agree to the
            <button
              className="underline text-blue-600 hover:text-blue-800 ml-1"
              type="button"
              onClick={() => setShowPrivacyModal(true)}
            >
              Privacy Policy
            </button>.
          </p>

          {showPrivacyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div
                className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative flex flex-col"
                style={{ minHeight: '500px', maxHeight: '500px', overflowY: 'auto' }}
              >
                <div className="flex-1 overflow-y-auto">
                  <PrivacyPolicy />
                </div>
                <button
                  className="mt-6 bg-[#B76E79] text-white px-6 py-2 rounded hover:bg-[#C68F98] font-semibold self-center"
                  onClick={() => setShowPrivacyModal(false)}
                  aria-label="Close"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
