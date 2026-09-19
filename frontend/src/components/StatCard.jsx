import React from 'react';

const StatCard = ({ label, value, icon: Icon, color = '#13293d', bgColor = '#e8f1f5' }) => {
  return (
    <div className="stat-card">
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value !== undefined ? value : 0}</div>
      </div>
      {Icon && (
        <div className="stat-icon" style={{ backgroundColor: bgColor, color }}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
