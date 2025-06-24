import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    reverted: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Loading dashboard data for user:', user?.email);
      
      const response = await apiService.getComplaints();
      console.log('API Response:', response);
      
      const complaintsData = response.complaints || [];
      setComplaints(complaintsData);

      // Calculate statistics
      const statsData = {
        total: complaintsData.length,
        pending: complaintsData.filter(c => c.status === 'pending').length,
        inProgress: complaintsData.filter(c => c.status === 'in_progress').length,
        resolved: complaintsData.filter(c => c.status === 'resolved').length,
        reverted: complaintsData.filter(c => c.status === 'revert_back').length
      };
      setStats(statsData);
      
      console.log('Dashboard data loaded:', { complaints: complaintsData.length, stats: statsData });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card-header">
        <h2>Dashboard</h2>
        <p>Welcome back, {user?.email}</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3>Total Complaints</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3498db' }}>{stats.total}</div>
        </div>
        
        <div className="card">
          <h3>Pending</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>{stats.pending}</div>
        </div>
        
        <div className="card">
          <h3>In Progress</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e67e22' }}>{stats.inProgress}</div>
        </div>
        
        <div className="card">
          <h3>Resolved</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>{stats.resolved}</div>
        </div>
        
        <div className="card">
          <h3>Reverted</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e74c3c' }}>{stats.reverted}</div>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="card">
        <div className="card-header">
          <h3>Recent Complaints</h3>
        </div>
        
        {complaints.length === 0 ? (
          <div>
            <p>No complaints found. Submit your first complaint to get started!</p>
            <button className="btn" style={{ marginTop: '1rem' }}>Submit New Complaint</button>
          </div>
        ) : (
          <div>
            {complaints.slice(0, 5).map((complaint) => (
              <div key={complaint._id} style={{ 
                borderBottom: '1px solid #ecf0f1', 
                padding: '1rem 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{complaint.title}</h4>
                  <p style={{ margin: '0', color: '#7f8c8d', fontSize: '0.9rem' }}>
                    {complaint.category} • {complaint.location?.city || 'Location not specified'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className={`alert ${complaint.status === 'resolved' ? 'alert-success' : 
                    complaint.status === 'revert_back' ? 'alert-error' : 'alert-warning'}`} 
                    style={{ margin: 0, padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
                    {complaint.status.replace('_', ' ').toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#7f8c8d', marginTop: '0.25rem' }}>
                    {formatDate(complaint.submittedAt)}
                  </div>
                </div>
              </div>
            ))}
            
            {complaints.length > 5 && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <a href="/complaints" className="btn">View All Complaints</a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h3>Quick Actions</h3>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn">Submit New Complaint</button>
          <button className="btn btn-secondary">Track Complaint</button>
          <a href="/complaints" className="btn btn-secondary">View All Complaints</a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 