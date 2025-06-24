import React, { useState } from 'react';
import { mainContentStyle } from '../styles/layout';

function GrievanceTracking({ grievance }) {
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleReopen = async () => {
    if (!file) {
      setMessage('Please select a file before reopening the grievance.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('proof', file);
      formData.append('grievanceId', grievance._id);

      const response = await fetch('/api/grievance/reopen', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setMessage('Grievance reopened successfully!');
        setFile(null);
      } else {
        setMessage('Failed to reopen grievance. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return grievance.status === 'Resolved' ? (
    <div style={mainContentStyle}>
      <h3>Reopen Grievance</h3>
      <p>If you believe this grievance was not properly resolved, you can reopen it with new proof.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Upload New Proof (Required):
        </label>
        <input 
          type="file" 
          required 
          onChange={e => setFile(e.target.files[0])}
          style={{
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            width: '100%',
            maxWidth: '400px'
          }}
        />
      </div>

      {message && (
        <div style={{
          padding: '10px',
          marginBottom: '15px',
          borderRadius: '4px',
          backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
          color: message.includes('successfully') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}

      <button 
        onClick={handleReopen}
        disabled={!file || isSubmitting}
        style={{
          padding: '12px 24px',
          backgroundColor: file && !isSubmitting ? '#007bff' : '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: file && !isSubmitting ? 'pointer' : 'not-allowed',
          fontSize: '16px'
        }}
      >
        {isSubmitting ? 'Reopening...' : 'Reopen Grievance'}
      </button>
    </div>
  ) : null;
}

export default GrievanceTracking; 