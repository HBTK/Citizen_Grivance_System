import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { pageContainer, mainContentStyle } from "../../styles/layout";
import { labelStyle, inputStyle, buttonStyle } from "../../styles/common";
import Header from "../../components/common/Header";
import MessagePopup from "../../components/common/MessagePopup";
import DetailBlock from "../../components/common/DetailBlock";

const GrievanceSubmission = () => {
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType");
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  const [errorField, setErrorField] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [form, setForm] = useState({
    Category: "",
    title: "",
    description: "",
    street: "",
    city: "",
    district: "",
    state: "",
    postalCode: "",
    file: null,
  });
  const [step, setStep] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [trackingId, setTrackingId] = useState("");

  // Create refs for all form fields
  const categoryRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const streetRef = useRef(null);
  const cityRef = useRef(null);
  const districtRef = useRef(null);
  const stateRef = useRef(null);
  const postalCodeRef = useRef(null);

  // Redirect if not logged in as citizen
  if (!isAuthenticated || userType !== "citizen") {
    navigate("/citizen/login");
    return null;
  }

  const generateTrackingId = () => {
    return "GRV123";
  };

  const showMessagePopup = (msg) => {
    setMessage(msg);
    setShowMessage(true);
  };

  const validateForm = () => {
    if (!form.Category) {
      setErrorField("category");
      categoryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      showMessagePopup(
        "Help us route your grievance correctly by selecting an appropriate category."
      );
      return false;
    }
    if (!form.title) {
      setErrorField("title");
      titleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      showMessagePopup(
        "Adding a clear title will help us understand your grievance better."
      );
      return false;
    }
    if (!form.description) {
      setErrorField("description");
      descriptionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      showMessagePopup(
        "A detailed description will help us address your concerns more effectively."
      );
      return false;
    }
    if (!form.street) {
      setErrorField("street");
      streetRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      showMessagePopup(
        "We need your street address to locate the issue accurately."
      );
      return false;
    }
    if (!form.city) {
      setErrorField("city");
      cityRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      showMessagePopup(
        "Including your city helps us identify the correct jurisdiction."
      );
      return false;
    }
    if (!form.district) {
      setErrorField("district");
      districtRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      showMessagePopup(
        "Your district information helps us coordinate with the right authorities."
      );
      return false;
    }
    if (!form.state) {
      setErrorField("state");
      stateRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      showMessagePopup(
        "Knowing your state ensures proper routing of your grievance."
      );
      return false;
    }
    if (!form.postalCode || form.postalCode.length !== 6) {
      setErrorField("postalCode");
      postalCodeRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      showMessagePopup(
        "A valid 6-digit postal code helps us pinpoint your location precisely."
      );
      return false;
    }
    setErrorField("");
    return true;
  };

  const handleSubmitClick = () => {
    if (validateForm()) {
      setShowConfirm(true);
    }
  };

  const handleSubmit = () => {
    const newId = generateTrackingId();
    setTrackingId(newId);
    setShowConfirm(false);
    setStep(2); // show success section
  };

  const handleSubmit1 = async () => {
    const location = {
      state: form.state,
      district: form.district,
      city: form.city,
      addressLine: form.street,
      pincode: form.postalCode,
    };
    const formData = new FormData();
    formData.append("category", form.Category);
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("location", JSON.stringify(location));
    if (form.file) {
      formData.append("attachments", form.file);
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/complaints/submit",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTrackingId(data.grievanceId); // assuming backend returns a trackingId
        setShowConfirm(false);
        setStep(2); // show success section
      } else {
        showMessagePopup(
          data.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting grievance:", error);
      showMessagePopup("Server error. Please try again later.");
    }
  };

  return (
    <div style={pageContainer}>
      <Header />

      <div
        style={{
          ...mainContentStyle,
          maxWidth: 800,
          margin: "20px auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "60px", // Add space for footer
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontFamily: "Roboto",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Submit Your Grievance
        </div>
        <div
          style={{
            fontSize: 16,
            fontFamily: "Roboto",
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          Please fill out the form below
        </div>

        {step === 1 ? (
          <div
            style={{
              width: "95%",
              maxWidth: 600,
              background: "white",
              padding: "30px",
              borderRadius: 12,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Category*</label>
              <select
                ref={categoryRef}
                value={form.Category}
                onChange={(e) => setForm({ ...form, Category: e.target.value })}
                style={{ ...inputStyle, width: "95%" }}
              >
                <option value="">Select Category</option>
                <option value="Municipal Issues">Municipal Issues</option>
                <option value="Utility Services">Utility Services</option>
                <option value="Public Safety & Law Enforcement">
                  Public Safety & Law Enforcement
                </option>
                <option value="Government Schemes & Services">
                  Government Schemes & Services
                </option>
                <option value="Healthcare & Sanitation">
                  Healthcare & Sanitation
                </option>
                <option value="Education & Youth Services">
                  Education & Youth Services
                </option>
                <option value="Transport & Infrastructure">
                  Transport & Infrastructure
                </option>
                <option value="Digital and Online Services">
                  Digital and Online Services
                </option>
                <option value="Others (General Complaints)">
                  Others (General Complaints)
                </option>
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Title*</label>
              <input
                ref={titleRef}
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{ ...inputStyle, width: "95%" }}
                placeholder="Brief title of your grievance"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Description*</label>
              <textarea
                ref={descriptionRef}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                style={{
                  ...inputStyle,
                  width: "95%",
                  minHeight: 120,
                  resize: "vertical",
                }}
                placeholder="Detailed description of your grievance"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Street Address*</label>
              <input
                ref={streetRef}
                type="text"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                style={{ ...inputStyle, width: "95%" }}
                placeholder="Street address"
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div>
                <label style={labelStyle}>City*</label>
                <input
                  ref={cityRef}
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  style={{ ...inputStyle, width: "95%" }}
                  placeholder="City"
                />
              </div>
              <div>
                <label style={labelStyle}>District*</label>
                <input
                  ref={districtRef}
                  type="text"
                  value={form.district}
                  onChange={(e) =>
                    setForm({ ...form, district: e.target.value })
                  }
                  style={{ ...inputStyle, width: "95%" }}
                  placeholder="District"
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div>
                <label style={labelStyle}>State*</label>
                <input
                  ref={stateRef}
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  style={{ ...inputStyle, width: "95%" }}
                  placeholder="State"
                />
              </div>
              <div>
                <label style={labelStyle}>Postal Code*</label>
                <input
                  ref={postalCodeRef}
                  type="text"
                  value={form.postalCode}
                  onChange={(e) =>
                    setForm({ ...form, postalCode: e.target.value })
                  }
                  style={{ ...inputStyle, width: "95%" }}
                  placeholder="6-digit postal code"
                />
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Supporting Documents (Optional)</label>
              <input
                type="file"
                name="attachments"
                onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                style={{ ...inputStyle, width: "95%" }}
              />
              <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                Supported formats: PDF, JPG, PNG (max 5MB)
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
              <button
                onClick={() => navigate("/citizen/dashboard")}
                style={{ ...buttonStyle, background: "#666" }}
              >
                Cancel
              </button>
              <button onClick={handleSubmitClick} style={buttonStyle}>
                Submit Grievance
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: 12,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              maxWidth: 500,
              width: "95%",
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                background: "#4CAF50",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <div
                style={{
                  fontSize: 30,
                  color: "white",
                }}
              >
                ✓
              </div>
            </div>
            <h2
              style={{
                fontFamily: "Roboto",
                fontSize: 28,
                marginBottom: 16,
                color: "#333",
              }}
            >
              Grievance Submitted Successfully!
            </h2>
            <div
              style={{
                background: "#f8f8f8",
                padding: "15px",
                borderRadius: 8,
                marginBottom: 24,
              }}
            >
              <p style={{ margin: "0 0 8px 0", color: "#666" }}>
                Your Tracking ID is:
              </p>
              <p
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  margin: 0,
                  color: "#000",
                }}
              >
                {trackingId}
              </p>
            </div>
            <p
              style={{
                color: "#666",
                marginBottom: 24,
              }}
            >
              Please save this tracking ID to check your grievance status later.
            </p>
            <button
              onClick={() => navigate("/citizen/dashboard")}
              style={{
                ...buttonStyle,
                background: "#4CAF50",
              }}
            >
              Back to Home
            </button>
          </div>
        )}
      </div>

      {showConfirm && (
        <MessagePopup
          message="Are you sure you want to submit this grievance?"
          onClose={() => setShowConfirm(false)}
          showConfirm={true}
          onConfirm={handleSubmit1}
        />
      )}

      {showMessage && (
        <MessagePopup message={message} onClose={() => setShowMessage(false)} />
      )}
    </div>
  );
};

export default GrievanceSubmission;