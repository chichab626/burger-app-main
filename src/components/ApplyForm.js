import React, { useState } from 'react';

const ApplyForm = ({ jobTitle, onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [skills, setSkills] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form inputs if needed

    // Submit the application data
    onSubmit({ name, email, resumeLink, skills });

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
		  <br></br>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
		  <br></br>
          <label>
            Resume Link:
            <input type="text" value={resumeLink} onChange={(e) => setResumeLink(e.target.value)} required />
          </label>
		  <br></br>
		  <label>
            Skills (comma separated):
            <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} required />
          </label>
          <button type="submit">Apply</button>
        </form>
      </div>
    </div>
  );
};

export default ApplyForm;
