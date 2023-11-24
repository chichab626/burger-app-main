import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JobModal = ({ jobTitle, candidates, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        {candidates.length > 0 ? (
          <ul>
            {candidates.map(candidate => (
              <li key={candidate.id}>{candidate.name}</li>
            ))}
          </ul>
        ) : (
          <p>No results</p>
        )}
      </div>
    </div>
  );
};

const JobLink = ({ jobTitle, jobID }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);

  const openModal = async () => {
    // Simulate fetching candidates for the specific job (replace with your actual API endpoint)
    try {
	  const appData = await axios.get('http://localhost:8000/applications?id=' + jobID);
      setCandidates(appData.data);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const closeModal = () => {
    setCandidates([]);
    setModalOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>View Appicants</button>
      {modalOpen && (
        <JobModal jobTitle={jobTitle} candidates={candidates} onClose={closeModal} />
      )}
    </div>
  );
};

export default JobLink;
