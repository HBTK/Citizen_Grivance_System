import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MessagePopup from "./MessagePopup";
import { buttonStyle } from "../../styles/common";

const Header = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  const handleLogout = () => setShowLogoutConfirm(true);

  const confirmLogout = () => {
    localStorage.clear();
    setShowLogoutConfirm(false);
    navigate("/");
  };

  useEffect(() => {
    const validateSession = async () => {
      const role = localStorage.getItem("userType");
      const endpointMap = {
        citizen: "/api/checkUserSession",
        officer: "/api/OfficerSession",
        admin: "/api/checkAdminSession",
      };
      const endpoint = endpointMap[role];
      if (!endpoint) return confirmLogout();

      try {
        const res = await fetch(
          `https://citizen-grivance-system.onrender.com${endpoint}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (res.status !== 200) confirmLogout();
      } catch (err) {
        confirmLogout();
      }
    };

    if (isAuthenticated) validateSession();
  }, [isAuthenticated]);

  return (
    <div
      style={{
        width: "100%",
        height: 80,
        background: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 40px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div
        onClick={() => navigate("/")}
        style={{ fontSize: 24, fontWeight: "bold", cursor: "pointer" }}
      >
        Citizen Grievance Portal
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          paddingRight: 30,
        }}
      >
        {!isAuthenticated && (
          <>
            <button
              onClick={() => navigate("/officer/login")}
              style={buttonStyle}
            >
              Officer Login
            </button>
            <button
              onClick={() => navigate("/citizen/login")}
              style={buttonStyle}
            >
              Citizen Login
            </button>
          </>
        )}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            style={{ ...buttonStyle, background: "#dc3545" }}
          >
            Logout
          </button>
        )}
      </div>

      {showLogoutConfirm && (
        <MessagePopup
          message="Are you sure you want to logout?"
          onClose={() => setShowLogoutConfirm(false)}
          showConfirm={true}
          onConfirm={confirmLogout}
        />
      )}
    </div>
  );
};

export default Header;
