import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pageContainer, mainContentStyle } from "../../styles/layout";
import Navigation from "../../components/common/Navigation";

const OfficerDashboard = () => {
  const navigate = useNavigate();
  const [assignedGrievances, setAssignedGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const response = await fetch(
          "https://citizen-grivance-system.onrender.com/api/officer/dashboard",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok) {
          setAssignedGrievances(data.grievances || []);
        } else {
          alert(data.message || "Failed to load grievances");
        }
      } catch (err) {
        console.error("Error fetching officer grievances:", err);
        alert("Server error while fetching grievances.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrievances();
  }, []);

  const handleViewDetails = (grievanceId) => {
    // Navigate to grievance details page
    navigate(`/officer/grievance/${grievanceId}`);
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginTop: "20px",
  };

  const thStyle = {
    backgroundColor: "#f8f9fa",
    padding: "15px 12px",
    textAlign: "left",
    borderBottom: "2px solid #dee2e6",
    fontWeight: "600",
    fontSize: "14px",
    color: "#495057",
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #dee2e6",
    fontSize: "14px",
    color: "#212529",
  };

  const statusStyle = (status) => ({
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
    backgroundColor:
      status === "Pending"
        ? "#fff3cd"
        : status === "In Progress"
        ? "#cce5ff"
        : status === "Resolved"
        ? "#d4edda"
        : "#f8d7da",
    color:
      status === "Pending"
        ? "#856404"
        : status === "In Progress"
        ? "#004085"
        : status === "Resolved"
        ? "#155724"
        : "#721c24",
  });

  const buttonStyle = {
    padding: "6px 12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    textDecoration: "none",
    display: "inline-block",
  };

  return (
    <div style={pageContainer}>
      <Navigation />
      <div style={mainContentStyle}>
        <h1
          style={{
            fontSize: 40,
            fontFamily: "Roboto",
            fontWeight: 700,
            marginBottom: "10px",
          }}
        >
          Welcome, Officer
        </h1>
        <p style={{ fontSize: 16, color: "#6c757d", marginBottom: "30px" }}>
          Manage your assigned grievances and track their progress
        </p>

        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: 24,
              fontFamily: "Roboto",
              fontWeight: 600,
              marginBottom: "15px",
            }}
          >
            Assigned Grievances
          </h2>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Loading assigned grievances...</p>
          </div>
        ) : assignedGrievances.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <p style={{ fontSize: "16px", color: "#6c757d" }}>
              No grievances assigned yet.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Grievance ID</th>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Assigned Date</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Priority</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignedGrievances.map((grievance) => (
                  <tr key={grievance.grievanceId}>
                    <td style={tdStyle}>{grievance.grievanceId}</td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: "500" }}>{grievance.title}</div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6c757d",
                          marginTop: "4px",
                        }}
                      >
                        {grievance.description.substring(0, 50)}...
                      </div>
                    </td>
                    <td style={tdStyle}>{grievance.category}</td>
                    <td style={tdStyle}>
                      {new Date(grievance.assignedDate).toLocaleDateString()}
                    </td>
                    <td style={tdStyle}>
                      <span style={statusStyle(grievance.status)}>
                        {grievance.status === "in_progress"
                          ? "In Progress"
                          : grievance.status}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          ...statusStyle(grievance.priority),
                          backgroundColor:
                            grievance.priority === "High"
                              ? "#f8d7da"
                              : grievance.priority === "Medium"
                              ? "#fff3cd"
                              : "#d4edda",
                          color:
                            grievance.priority === "High"
                              ? "#721c24"
                              : grievance.priority === "Medium"
                              ? "#856404"
                              : "#155724",
                        }}
                      >
                        {grievance.priority}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        style={buttonStyle}
                        onClick={() => handleViewDetails(grievance.grievanceId)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerDashboard;
