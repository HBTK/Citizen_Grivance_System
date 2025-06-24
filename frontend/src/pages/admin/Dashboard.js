import React, { useState, useEffect } from "react";
import { pageContainer, mainContentStyle } from "../../styles/layout";
import Navigation from "../../components/common/Navigation";

const AdminDashboard = () => {
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [officers, setOfficers] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const complaintsRes = await fetch(
          "http://localhost:5000/api/admin/get-complaints",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const officersRes = await fetch(
          "http://localhost:5000/api/admin/get-officers",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const complaintsData = await complaintsRes.json();
        const officersData = await officersRes.json();

        

        setPendingAssignments(complaintsData.complaints || []);
        setOfficers(officersData.officers || []);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssignGrievance = async (grievanceId, officerName) => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/assign", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grievanceId, officerName }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Assignment successful:", data);
        setPendingAssignments((prev) =>
          prev.filter((g) => g.grievanceId !== grievanceId)
        );
        setSelectedOfficer((prev) => {
          const updated = { ...prev };
          delete updated[grievanceId];
          return updated;
        });
      } else {
        alert(data.message || "Assignment failed");
      }
    } catch (err) {
      console.error("Error assigning officer:", err);
      alert("Server error while assigning officer");
    }
  };


  const cardStyle = {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  };

  const thStyle = {
    backgroundColor: "#f8f9fa",
    padding: "12px",
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

  const statusStyle = (priority) => ({
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
    backgroundColor:
      priority === "High"
        ? "#f8d7da"
        : priority === "Medium"
        ? "#fff3cd"
        : "#d4edda",
    color:
      priority === "High"
        ? "#721c24"
        : priority === "Medium"
        ? "#856404"
        : "#155724",
  });

  const buttonStyle = {
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
    marginRight: "8px",
  };

  const assignButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#007bff",
    color: "white",
  };


  if (loading) {
    return (
      <div style={pageContainer}>
        <Navigation />
        <div style={mainContentStyle}>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

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
          Admin Dashboard
        </h1>
        <p style={{ fontSize: 16, color: "#6c757d", marginBottom: "30px" }}>
          Manage grievance assignments and review resolutions
        </p>

        {/* Pending Assignments */}
        <div style={cardStyle}>
          <h2
            style={{
              fontSize: 24,
              fontFamily: "Roboto",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            Pending Assignments ({pendingAssignments.length})
          </h2>
          {pendingAssignments.length === 0 ? (
            <p style={{ fontSize: "14px", color: "#6c757d" }}>
              No pending assignments.
            </p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Grievance ID</th>
                  <th style={thStyle}>Title</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Priority</th>
                  <th style={thStyle}>Submitted Date</th>
                  <th style={thStyle}>Citizen</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingAssignments.map((grievance) => (
                  <tr key={grievance.grievanceId}>
                    <td style={tdStyle}>{grievance.grievanceId}</td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: "500" }}>{grievance.title}</div>
                    </td>
                    <td style={tdStyle}>{grievance.category}</td>
                    <td style={tdStyle}>
                      <span style={statusStyle(grievance.priority)}>
                        {grievance.priority}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {new Date(grievance.submittedAt).toLocaleDateString()}
                    </td>
                    <td style={tdStyle}>{grievance.citizen}</td>
                    <td style={tdStyle}>
                      <select
                        value={selectedOfficer[grievance.grievanceId] || ""}
                        onChange={(e) =>
                          setSelectedOfficer((prev) => ({
                            ...prev,
                            [grievance.grievanceId]: e.target.value,
                          }))
                        }
                        style={{
                          padding: "4px 8px",
                          marginRight: "8px",
                          fontSize: "12px",
                        }}
                      >
                        <option value="">Select Officer</option>
                        {officers.map((officer) => (
                          <option key={officer.email} value={officer.name}>
                            {officer.name}
                          </option>
                        ))}
                      </select>

                      <button
                        style={assignButtonStyle}
                        onClick={() =>
                          handleAssignGrievance(
                            grievance.grievanceId,
                            selectedOfficer[grievance.grievanceId]
                          )
                        }
                        disabled={!selectedOfficer[grievance.grievanceId]}
                      >
                        Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
