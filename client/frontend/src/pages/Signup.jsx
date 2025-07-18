import React, { useState } from "react";
import "../index.css";
import bgImg from "../assets/signup/otp-bg.png";
import { auth } from "../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import axios from "axios";

const Signup = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: (response) => {
          console.log("reCAPTCHA Resolved:", response);
        },
      });
    }
  };

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      alert("Enter a valid 10-digit phone number");
      return;
    }

    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const fullPhone = "+91" + phone;
      const result = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
      setConfirmationResult(result);
      alert("OTP sent successfully");
    } catch (err) {
      console.error("OTP send error:", err);
      alert(err.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) {
      alert("Please request OTP first");
      return;
    }

    try {
      const result = await confirmationResult.confirm(otp);
      const phoneNumber = result.user.phoneNumber;

      alert("Phone number verified!");
      console.log("Verified phone number:", phoneNumber);

      await axios.post("http://localhost:5000/api/user/save", {
        phone: phoneNumber,
      });

      alert("Phone number saved to MongoDB!");
    } catch (err) {
      console.error("OTP verification error:", err);
      alert("Invalid OTP or failed to save phone number");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div
        className="p-10 rounded-lg shadow-lg w-full max-w-md text-center min-h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImg})` }}
      >
        <div className="backdrop-blur-md p-6 rounded-lg">
          {/* Logo Placeholder */}
          <div className="w-16 h-16 bg-gray-800 mx-auto rounded-sm mb-6" />

          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome to <span className="text-black font-bold">Afford INDIA</span>
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Your one-stop destination for quality products
          </p>

          {/* Phone Input */}
          <div className="text-left mb-4">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Enter Mobile Number
            </label>
            <p className="text-xs text-gray-500 mb-1">
              (We will send you an OTP to verify your number)
            </p>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your number"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Get OTP Button */}
          <div id="recaptcha-container" className="mb-4" />
          <button
            onClick={handleSendOtp}
            className="w-full bg-[#A89A3D] text-white font-semibold py-2 rounded hover:bg-yellow-700 transition"
          >
            GET OTP
          </button>

          {/* OTP Input (only shown after OTP is sent) */}
          {confirmationResult && (
            <>
              <div className="text-left mt-6 mb-2">
                <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                  Enter OTP
                </label>
              </div>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button
                onClick={handleVerifyOtp}
                className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
              >
                Verify OTP
              </button>
            </>
          )}

          {/* Terms */}
          <p className="text-xs text-gray-500 mt-4">
            By continuing, I agree to the{" "}
            <span className="underline">Terms & Conditions</span> and{" "}
            <span className="underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
