import React, { useState, useEffect } from 'react';
import { pageContainer, mainContentStyle } from '../../styles/layout';
import Navigation from '../../components/common/Navigation';

const AdminAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      // Fetch dashboard metrics
      const resDashboard = await fetch("http://localhost:5000/api/admin/dashboard", {
        method: "GET",
        credentials: "include",
      });
      const dashboardData = await resDashboard.json();

      if (!resDashboard.ok) {
        alert(dashboardData.message || "Failed to fetch dashboard stats");
        return;
      }

      // Fetch officer performance
      const resOfficer = await fetch("http://localhost:5000/api/admin/officerPerformance", {
        method: "GET",
        credentials: "include",
      });
      const officerData = await resOfficer.json();

      if (!resOfficer.ok) {
        alert(officerData.message || "Failed to fetch officer performance");
        return;
      }

      // Fetch extended analytics
      const resExtended = await fetch("http://localhost:5000/api/admin/extendedAnalytics", {
        method: "GET",
        credentials: "include",
      });
      const extended = await resExtended.json();

      if (!resExtended.ok) {
        alert(extended.message || "Failed to fetch extended analytics");
        return;
      }

      // Merge all into a single state object
      const fullAnalytics = {
        ...dashboardData,
        officerPerformance: officerData.performance,
        categoryBreakdown: extended.categoryBreakdown,
        monthlyTrends: extended.monthlyTrends,
        systemMetrics: extended.systemMetrics,
      };

      setAnalyticsData(fullAnalytics);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      alert("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  fetchAnalytics();
}, []);



  const metricCardStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
    flex: 1,
    minWidth: '200px'
  };

  const chartContainerStyle = {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginTop: '20px'
  };

  const progressBarStyle = (percentage) => ({
    width: '100%',
    height: '8px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '8px'
  });

  const progressFillStyle = (percentage) => ({
    width: `${percentage}%`,
    height: '100%',
    backgroundColor: '#007bff',
    transition: 'width 0.3s ease'
  });

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px'
  };

  const thStyle = {
    backgroundColor: '#f8f9fa',
    padding: '12px',
    textAlign: 'left',
    borderBottom: '2px solid #dee2e6',
    fontWeight: '600',
    fontSize: '14px',
    color: '#495057'
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #dee2e6',
    fontSize: '14px',
    color: '#212529'
  };

  if (loading) {
    return (
      <div style={pageContainer}>
        <Navigation />
        <div style={mainContentStyle}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading analytics data...</p>
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
          System Analytics
        </h1>
        <p style={{ fontSize: 16, color: "#6c757d", marginBottom: "30px" }}>
          Comprehensive overview of grievance management system performance
        </p>

        {/* Key Metrics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div style={metricCardStyle}>
            <h3
              style={{
                fontSize: "14px",
                color: "#6c757d",
                marginBottom: "8px",
              }}
            >
              Total Grievances
            </h3>
            <div
              style={{ fontSize: "32px", fontWeight: "700", color: "#007bff" }}
            >
              {analyticsData.totalGrievances}
            </div>
          </div>
          <div style={metricCardStyle}>
            <h3
              style={{
                fontSize: "14px",
                color: "#6c757d",
                marginBottom: "8px",
              }}
            >
              Resolved
            </h3>
            <div
              style={{ fontSize: "32px", fontWeight: "700", color: "#28a745" }}
            >
              {analyticsData.resolved}
            </div>
          </div>
          <div style={metricCardStyle}>
            <h3
              style={{
                fontSize: "14px",
                color: "#6c757d",
                marginBottom: "8px",
              }}
            >
              In Progress
            </h3>
            <div
              style={{ fontSize: "32px", fontWeight: "700", color: "#ffc107" }}
            >
              {analyticsData.inProgress}
            </div>
          </div>
          <div style={metricCardStyle}>
            <h3
              style={{
                fontSize: "14px",
                color: "#6c757d",
                marginBottom: "8px",
              }}
            >
              Pending
            </h3>
            <div
              style={{ fontSize: "32px", fontWeight: "700", color: "#dc3545" }}
            >
              {analyticsData.pending}
            </div>
          </div>
        </div>

        {/* System Performance Metrics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div style={metricCardStyle}>
            <h3
              style={{
                fontSize: "14px",
                color: "#6c757d",
                marginBottom: "8px",
              }}
            >
              Avg Resolution Time
            </h3>
            <div
              style={{ fontSize: "24px", fontWeight: "700", color: "#495057" }}
            >
              {analyticsData.averageResolutionTime &&
              analyticsData.averageResolutionTime !== "0"
                ? `${analyticsData.averageResolutionTime} days`
                : "15 days"}
            </div>
          </div>
          <div style={metricCardStyle}>
            <h3
              style={{
                fontSize: "14px",
                color: "#6c757d",
                marginBottom: "8px",
              }}
            >
              Response Time
            </h3>
            <div
              style={{ fontSize: "24px", fontWeight: "700", color: "#495057" }}
            >
              {analyticsData.systemMetrics.responseTime}
            </div>
          </div>
          <div style={metricCardStyle}>
            <h3
              style={{
                fontSize: "14px",
                color: "#6c757d",
                marginBottom: "8px",
              }}
            >
              Resolution Rate
            </h3>
            <div
              style={{ fontSize: "24px", fontWeight: "700", color: "#495057" }}
            >
              {analyticsData.systemMetrics.resolutionRate}
            </div>
          </div>
          <div style={metricCardStyle}>
            <h3
              style={{
                fontSize: "14px",
                color: "#6c757d",
                marginBottom: "8px",
              }}
            >
              Satisfaction Score
            </h3>
            <div
              style={{ fontSize: "24px", fontWeight: "700", color: "#495057" }}
            >
              {analyticsData.systemMetrics.satisfactionScore}
            </div>
          </div>
        </div>

        {/* Officer Performance */}
        <div style={chartContainerStyle}>
          <h2
            style={{
              fontSize: 20,
              fontFamily: "Roboto",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            Officer Performance
          </h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Officer Name</th>
                <th style={thStyle}>Assigned</th>
                <th style={thStyle}>Resolved</th>
                <th style={thStyle}>Resolution Rate</th>
                <th style={thStyle}>Avg Resolution Time</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.officerPerformance.map((officer, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{officer.officerName}</td>
                  <td style={tdStyle}>{officer.assigned}</td>
                  <td style={tdStyle}>{officer.resolved}</td>
                  <td style={tdStyle}>{officer.resolutionRate}</td>
                  <td style={tdStyle}>{officer.avgResolutionTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Monthly Trends */}
        <div style={chartContainerStyle}>
          <h2
            style={{
              fontSize: 20,
              fontFamily: "Roboto",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            Monthly Trends
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "16px",
            }}
          >
            {analyticsData.monthlyTrends.map((trend, index) => (
              <div
                key={index}
                style={{
                  textAlign: "center",
                  padding: "16px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "6px",
                }}
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  {trend.month}
                </div>
                <div style={{ fontSize: "14px", color: "#6c757d" }}>
                  Submitted: {trend.submitted}
                </div>
                <div style={{ fontSize: "14px", color: "#6c757d" }}>
                  Resolved: {trend.resolved}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Metrics */}
        <div style={chartContainerStyle}>
          <h2
            style={{
              fontSize: 20,
              fontFamily: "Roboto",
              fontWeight: 600,
              marginBottom: "20px",
            }}
          >
            Additional Metrics
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "5px",
                }}
              >
                Reopening Rate
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#dc3545",
                }}
              >
                {analyticsData.systemMetrics.reopeningRate}
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "5px",
                }}
              >
                Active Officers
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#007bff",
                }}
              >
                {analyticsData.officerPerformance.length}
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "5px",
                }}
              >
                Avg per Officer
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#28a745",
                }}
              >
                {Math.round(
                  analyticsData.totalGrievances /
                    analyticsData.officerPerformance.length
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics; 