// src/components/RecentForm.tsx
import React from 'react';
import './RecentForm.css'; // Import the CSS for styling

interface RecentFormProps {
  form: string[]; // Changed from string to string[]
}

const RecentForm: React.FC<RecentFormProps> = ({ form }) => {
  if (!form || form.length === 0) {
    return <div className="recent-form-container">No recent form available.</div>;
  }

  // Ensure we only show the last 5, or whatever length is provided
  // We can still use slice(-5) if we want to limit the display to the last 5 results
  const displayForm = form.slice(-5);

  return (
    <div className="recent-form-container">
      {/* Directly map over the array */}
      {displayForm.map((result, index) => (
        <span key={index} className={`form-result ${result.toLowerCase()}`}>
          {result}
        </span>
      ))}
    </div>
  );
};

export default RecentForm;
