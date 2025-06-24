import React, { useState, useEffect } from 'react';
import { mainContentStyle } from '../../styles/layout';

function GrievanceList({ grievances, onGrievanceClick, showActions = false, onAssign, onAccept }) {
  const [sortBy, setSortBy] = useState('date');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [filteredGrievances, setFilteredGrievances] = useState([]);

  useEffect(() => {
    let filtered = [...grievances];

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(g => g.status === statusFilter);
    }

    // Filter by date
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(g => {
        const grievanceDate = new Date(g.submittedDate || g.assignedDate);
        return grievanceDate.toDateString() === filterDate.toDateString();
      });
    }

    // Sort grievances
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.submittedDate || a.assignedDate);
        const dateB = new Date(b.submittedDate || b.assignedDate);
        return dateB - dateA; // Newest first
      } else if (sortBy === 'priority') {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    setFilteredGrievances(filtered);
  }, [grievances, sortBy, statusFilter, dateFilter]);

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginTop: '20px'
  };

  const thStyle = {
    backgroundColor: '#f8f9fa',
    padding: '15px 12px',
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

  const statusStyle = (status) => ({
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: status === 'Pending' ? '#fff3cd' : 
                    status === 'In Progress' ? '#cce5ff' : 
                    status === 'Resolved' ? '#d4edda' : 
                    status === 'Reopened' ? '#f8d7da' : '#e9ecef',
    color: status === 'Pending' ? '#856404' : 
           status === 'In Progress' ? '#004085' : 
           status === 'Resolved' ? '#155724' : 
           status === 'Reopened' ? '#721c24' : '#495057'
  });

  const priorityStyle = (priority) => ({
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: priority === 'High' ? '#f8d7da' : 
                    priority === 'Medium' ? '#fff3cd' : '#d4edda',
    color: priority === 'High' ? '#721c24' : 
           priority === 'Medium' ? '#856404' : '#155724'
  });

  const buttonStyle = {
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    marginRight: '8px'
  };

  const filterContainerStyle = {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    alignItems: 'center'
  };

  const selectStyle = {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    minWidth: '150px'
  };

  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  };

  const clearButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const clearFilters = () => {
    setSortBy('date');
    setStatusFilter('');
    setDateFilter('');
  };

  return (
    <div style={mainContentStyle}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: 24, fontFamily: 'Roboto', fontWeight: 600, marginBottom: '15px' }}>
          Grievance List
        </h2>
        
        <div style={filterContainerStyle}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
              Sort By:
            </label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={selectStyle}
            >
              <option value="date">Date (Newest First)</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
              Filter by Status:
            </label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Reopened">Reopened</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500' }}>
              Filter by Date:
            </label>
            <input 
              type="date" 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ alignSelf: 'end' }}>
            <button onClick={clearFilters} style={clearButtonStyle}>
              Clear Filters
            </button>
          </div>
        </div>

        <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '10px' }}>
          Showing {filteredGrievances.length} of {grievances.length} grievances
        </div>
      </div>

      {filteredGrievances.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: '16px', color: '#6c757d' }}>No grievances found matching the current filters.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Priority</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Date</th>
                {showActions && <th style={thStyle}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredGrievances.map((grievance) => (
                <tr key={grievance._id} style={{ cursor: onGrievanceClick ? 'pointer' : 'default' }}
                    onClick={() => onGrievanceClick && onGrievanceClick(grievance)}>
                  <td style={tdStyle}>{grievance._id.slice(-8)}</td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: '500' }}>{grievance.title}</div>
                    <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                      {grievance.description?.substring(0, 50)}...
                    </div>
                  </td>
                  <td style={tdStyle}>{grievance.category}</td>
                  <td style={tdStyle}>
                    <span style={priorityStyle(grievance.priority)}>
                      {grievance.priority}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={statusStyle(grievance.status)}>
                      {grievance.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {new Date(grievance.submittedDate || grievance.assignedDate).toLocaleDateString()}
                  </td>
                  {showActions && (
                    <td style={tdStyle}>
                      {onAssign && (
                        <button 
                          style={buttonStyle}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAssign(grievance._id);
                          }}
                        >
                          Assign
                        </button>
                      )}
                      {onAccept && grievance.status === 'Forwarded' && (
                        <button 
                          style={{...buttonStyle, backgroundColor: '#28a745'}}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAccept(grievance._id);
                          }}
                        >
                          Accept
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default GrievanceList;
