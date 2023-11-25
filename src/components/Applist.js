import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApplyForm from './ApplyForm.js';

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
	const [applyFormOpen, setApplyFormOpen] = useState(false);

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

	const openApplyForm = () => setApplyFormOpen(true);
	const closeApplyForm = () => setApplyFormOpen(false);

	const handleApply = async (applicationData) => {
		applicationData.jobID = jobID;
		const response = await axios.put('http://localhost:8000/apply', applicationData);
		// Handle the application data (e.g., send it to the server)
		alert('Application submitted');

		// Optionally, you can close the form after submission
		closeApplyForm();
	};

	return (
		<div>
			<p class="card__apply">
				<a class="card__link" href="#" onClick={openModal}>View Appicants <i class="fas fa-arrow-right"></i></a>
			</p>
			{modalOpen && (
				<JobModal jobTitle={jobTitle} candidates={candidates} onClose={closeModal} />
			)}
			<p class="card__apply">
				<a class="card__link" href="#" onClick={openApplyForm}>Apply Now <i class="fas fa-arrow-right"></i></a>
			</p>
			{applyFormOpen && (
				<ApplyForm jobTitle={jobTitle} onSubmit={handleApply} onClose={closeApplyForm} />
			)}
		</div>
	);
};

export default JobLink;
