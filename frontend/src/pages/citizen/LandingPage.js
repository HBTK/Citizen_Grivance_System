import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pageContainer, mainContentStyle } from '../../styles/layout';
import { inputStyle, buttonStyle } from '../../styles/common';
import Header from '../../components/common/Header';

const GrievanceCard = ({ grievance }) => (
    <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '16px'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>{grievance.title}</h3>
            <span style={{
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '14px',
                background: grievance.status === 'Resolved' ? '#4CAF50' : '#FFC107',
                color: grievance.status === 'Resolved' ? 'white' : 'black'
            }}>
                {grievance.status}
            </span>
        </div>
        <p style={{ margin: '8px 0', color: '#666' }}>{grievance.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '14px' }}>
            <span>ID: {grievance.id}</span>
            <span>{grievance.date}</span>
        </div>
    </div>
);

const LandingPage = () => {
    const navigate = useNavigate();
    const [trackingId, setTrackingId] = useState('');
    const userType = localStorage.getItem('userType');
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    // Mock grievance history - replace with actual data from backend
    const grievanceHistory = [
        {
            id: 'GRV123',
            title: 'Road Maintenance Required',
            description: 'The road in front of City Mall has multiple potholes causing traffic issues.',
            status: 'In Progress',
            date: '2024-03-15'
        },
        {
            id: 'GRV122',
            title: 'Street Light Not Working',
            description: 'Street light near Park Avenue has been non-functional for a week.',
            status: 'Resolved',
            date: '2024-03-10'
        }
    ];

    const handleTrackClick = () => {
        if (trackingId) {
            navigate(`/track/${trackingId}`);
        }
    };

    return (
        <div style={pageContainer}>
            <Header />

            {/* Hero Section */}
            <div style={{
                width: '100%',
                minHeight: '25vh',
                background: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px 20px',
                textAlign: 'center',
                color: 'white'
            }}>
                <h1 style={{ fontSize: 40, fontFamily: 'Roboto', fontWeight: 700, marginBottom: 20 }}>
                    Welcome to the Citizen Grievance Portal
                </h1>
                <p style={{ fontSize: 16, maxWidth: 520, marginBottom: 24 }}>
                    Easily submit and track your grievances to ensure your voice is heard.
                </p>
                {!isAuthenticated ? (
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
                        <button
                            style={{ width: 240, padding: 12, borderRadius: 8, border: '1px solid white', background: 'transparent', color: 'white' }}
                            onClick={handleTrackClick}
                        >
                            Track Grievance
                        </button>
                        <button
                            style={{ ...buttonStyle, width: 240 }}
                            onClick={() => navigate('/citizen/login')}
                        >
                            Submit Grievance
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
                        <button
                            style={{ ...buttonStyle, width: 240 }}
                            onClick={() => navigate('/submit')}
                        >
                            Submit New Grievance
                        </button>
                    </div>
                )}
            </div>

            <div style={{ ...mainContentStyle, maxWidth: 800, margin: '40px auto' }}>
                {/* Track Section */}
                <div style={{ marginBottom: 60, textAlign: 'center' }}>
                    <h2 style={{ fontSize: 40, fontFamily: 'Roboto', fontWeight: 700 }}>Track Your Grievance</h2>
                    <p style={{ fontSize: 16 }}>Enter your tracking ID to check the status of your grievance.</p>
                    <input
                        type="text"
                        placeholder="Your Tracking ID"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        style={{
                            ...inputStyle,
                            width: '100%',
                            maxWidth: 520,
                            marginTop: 20
                        }}
                    />
                    <div style={{ marginTop: 20 }}>
                        <button
                            style={{ ...buttonStyle, width: 240 }}
                            onClick={handleTrackClick}
                        >
                            Track Status
                        </button>
                    </div>
                </div>

              {/*Grievance History Section - Only shown when logged in as citizen 
                {isAuthenticated && userType === 'citizen' && (
                    <div style={{ marginTop: 40 }}>
                        <h2 style={{ fontSize: 32, marginBottom: 20, textAlign: 'center' }}>Your Grievance History</h2>
                        {grievanceHistory.length > 0 ? (
                            <div>
                                {grievanceHistory.map(grievance => (
                                    <GrievanceCard key={grievance.id} grievance={grievance} />
                                ))}
                            </div>
                        ) : (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: '40px', 
                                background: 'white',
                                borderRadius: '8px'
                            }}>
                                <p>You haven't submitted any grievances yet.</p>
                                <button
                                    onClick={() => navigate('/submit')}
                                    style={{ ...buttonStyle, marginTop: 16 }}
                                >
                                    Submit Your First Grievance
                                </button>
                            </div>
                        )}
                    </div>
                )} */}

            </div> 

            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: 60, 
                padding: 30,
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div style={{ fontSize: 20 }}>Contact us: supportmail</div>
                <div style={{ fontSize: 20 }}>FAQs</div>
                <div style={{ fontSize: 20 }}>Terms of Service</div>
                <div style={{ fontSize: 20 }}>Privacy Policy</div>
            </div>
        </div>
    );
};

export default LandingPage; 