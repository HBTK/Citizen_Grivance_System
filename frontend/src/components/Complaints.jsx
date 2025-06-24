import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadComplaints();
    }
  }, [user]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Loading complaints for user:', user?.email);
      
      const response = await apiService.getComplaints();
      console.log('Complaints API Response:', response);
      
      const complaintsData = response.complaints || [];
      setComplaints(complaintsData);
      
      console.log('Complaints loaded:', complaintsData.length);
    } catch (err) {
      console.error('Error loading complaints:', err);
      setError('Failed to load complaints: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'alert-warning';
      case 'in_progress': return 'alert-warning';
      case 'resolved': return 'alert-success';
      case 'revert_back': return 'alert-error';
      default: return 'alert-warning';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading complaints...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card-header">
        <h2>My Complaints</h2>
        <p>Welcome, {user?.email}</p>
        <p>Total complaints: {complaints.length}</p>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {complaints.length === 0 ? (
        <div className="card">
          <p>No complaints found. Submit your first complaint to get started!</p>
          <button className="btn" style={{ marginTop: '1rem' }}>Submit New Complaint</button>
        </div>
      ) : (
        <div>
          {complaints.map((complaint) => (
            <div key={complaint._id} className="card">
              <div className="card-header">
                <h3 className="card-title">{complaint.title}</h3>
                <div className={`alert ${getStatusColor(complaint.status)}`} style={{ margin: 0 }}>
                  Status: {complaint.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong>Grievance ID:</strong> {complaint.grievanceId}
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong>Category:</strong> {complaint.category}
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong>Description:</strong>
                <p>{complaint.description}</p>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong>Location:</strong>
                <p>
                  {complaint.location?.city || 'City not specified'}, 
                  {complaint.location?.district || 'District not specified'}, 
                  {complaint.location?.state || 'State not specified'}
                  {complaint.location?.pincode && ` - ${complaint.location.pincode}`}
                </p>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong>Department:</strong> {complaint.department}
              </div>
              
              {complaint.officerId && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Assigned Officer:</strong> {complaint.officerId.name} ({complaint.officerId.department})
                </div>
              )}
              
              {complaint.logs && complaint.logs.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Recent Activity:</strong>
                  <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                    {complaint.logs.slice(-3).map((log, index) => (
                      <li key={index}>
                        <strong>{log.action}:</strong> {log.message} - {formatDate(log.timestamp)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {complaint.attachments && complaint.attachments.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Attachments:</strong>
                  <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                    {complaint.attachments.map((attachment, index) => (
                      <li key={index}>
                        <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                          Attachment {index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                <strong>Submitted:</strong> {formatDate(complaint.submittedAt)}
                {complaint.updatedAt !== complaint.submittedAt && (
                  <span> | <strong>Updated:</strong> {formatDate(complaint.updatedAt)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Complaints; 