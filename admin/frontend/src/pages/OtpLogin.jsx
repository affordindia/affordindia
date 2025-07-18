import React, { useState } from "react";
import { auth } from "../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const OtpLogin = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth, 
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA Resolved", response);
          },
        }
      );
    }
  };

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      alert("Enter valid 10-digit phone number");
      return;
    }

    setupRecaptcha();

    const appVerifier = window.recaptchaVerifier;

    try {
      const fullPhone = "+91" + phone;
      const result = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
      setConfirmationResult(result);
      alert("OTP Sent");
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
      alert("Phone verified!");
      console.log(result.user);
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-xl font-bold mb-4">OTP Login</h2>

      <input
        type="text"
        placeholder="Enter phone number"
        className="border px-4 py-2 rounded mb-4 w-64"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <div id="recaptcha-container" className="mb-4"></div>

      <button
        onClick={handleSendOtp}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mb-4"
      >
        Send OTP
      </button>

      <input
        type="text"
        placeholder="Enter OTP"
        className="border px-4 py-2 rounded mb-4 w-64"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button
        onClick={handleVerifyOtp}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        Verify OTP
      </button>
    </div>
  );
};

export default OtpLogin;
