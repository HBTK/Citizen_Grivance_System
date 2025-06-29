import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pageContainer, mainContentStyle } from "../../styles/layout";
import { labelStyle, inputStyle, buttonStyle } from "../../styles/common";
import Header from "../../components/common/Header";
import MessagePopup from "../../components/common/MessagePopup";

const CitizenLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showMessagePopup = (msg) => {
    setMessage(msg);
    setShowMessage(true);
  };

  const generateOtp = async () => {
    if (!email) {
      showMessagePopup("Please enter your email address.");
      return;
    }
    if (!validateEmail(email)) {
      showMessagePopup("Please enter a valid email address.");
      return;
    }

    try {
      // TODO: Replace with actual MongoDB API call
      const response = await fetch(
        "https://citizen-grivance-system.onrender.com/api/auth/send-otp",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();

      if (data.message === "OTP sent successfully") {
        setShowOtpField(true);
      }
    } catch (error) {
      console.error("OTP generation error:", error);
      showMessagePopup("Failed to generate OTP. Please try again.");
    }
  };
  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://citizen-grivance-system.onrender.com/api/auth/verify-otp",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();

      console.log(data);
      if (data.message === "Login successful") {
        localStorage.setItem("userType", "citizen");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userName", email);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("citizenEmail", email);

        navigate("/citizen/dashboard");
      } else {
        showMessagePopup("Invalid OTP or email.");
      }
    } catch (error) {
      console.error("Login error:", error);
      showMessagePopup("Login failed. Please try again.");
    }
  };

  return (
    <div style={pageContainer}>
      {showMessage && (
        <MessagePopup message={message} onClose={() => setShowMessage(false)} />
      )}

      <Header />

      <div style={{ ...mainContentStyle, maxWidth: 400, margin: "40px auto" }}>
        <h1
          style={{
            fontSize: 32,
            fontFamily: "Roboto",
            fontWeight: 700,
            marginBottom: 32,
          }}
        >
          Citizen Login
        </h1>

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div>
            <label style={labelStyle}>Email Address*</label>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                onClick={generateOtp}
                style={{
                  ...buttonStyle,
                  padding: "10px 15px",
                  background: "#555",
                }}
                disabled={!email}
              >
                Get OTP
              </button>
            </div>
          </div>

          {showOtpField && (
            <div>
              <label style={labelStyle}>OTP*</label>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  onClick={handleLogin}
                  style={{ ...buttonStyle, padding: "10px 15px" }}
                  disabled={!otp}
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <button
            onClick={() => navigate("/")}
            style={{ ...buttonStyle, background: "#666", width: 200 }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitizenLogin;
