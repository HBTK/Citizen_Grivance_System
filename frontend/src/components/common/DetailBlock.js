import React from 'react';

const DetailBlock = ({ title, value }) => (
  <div style={{ 
    background: '#f8f8f8',
    padding: '12px 16px',
    borderRadius: 8
  }}>
    <div style={{ 
      fontSize: 14,
      color: '#666',
      marginBottom: 4
    }}>{title}</div>
    <div style={{ 
      fontSize: 16,
      color: '#333'
    }}>{value}</div>
  </div>
);

export default DetailBlock; 