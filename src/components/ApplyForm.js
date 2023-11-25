import React, { useState } from 'react';

const ApplyForm = ({ jobTitle, onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resumeLink, setResumeLink] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form inputs if needed

    // Submit the application data
    onSubmit({ name, email, resumeLink });

    // Close the form
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h2>Apply for {jobTitle}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Resume Link:
            <input type="text" value={resumeLink} onChange={(e) => setResumeLink(e.target.value)} required />
          </label>
          <button type="submit">Apply</button>
        </form>
      </div>
    </div>
  );
};

export default ApplyForm;
