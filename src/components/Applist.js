import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import ListGroup from 'react-bootstrap/ListGroup';

function ViewApplicantsModal(props) {
	const [candidates, setCandidates] = useState([]);
	const fetchData = async () => {
		try {
			const appData = await axios.get('http://localhost:8000/applications?id=' + props.job.jobID);
			setCandidates(appData.data);
			//setModalOpen(true);
		} catch (error) {
			console.error('Error fetching candidates:', error);
		}
	};

	useEffect(() => {
		fetchData();
	},[]);

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Applicant List
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p>
					These candidates applied for this job:
				</p>
				<ListGroup>
					{candidates.map(candidate => (
						<ListGroup.Item variant="info" key={candidate.id}>{candidate.name}</ListGroup.Item>
					))}
				</ListGroup>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.onHide}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}

const JobLink = ({ jobTitle, job }) => {

	const [modalShow, setModalShow] = React.useState(false);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [resumeLink, setResumeLink] = useState('');
	const [skills, setSkills] = useState('');

	const handleApply = async (e) => {
		e.preventDefault();
		let applicationData = { name, email, resumeLink, skills, job };
		// applicationData.job = job;
		await axios.post('http://localhost:8000/apply', applicationData);
		// Handle the application data (e.g., send it to the server)
		alert("Application Submitted");
		handleClose();
	};

	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<div>
			<div className="d-grid gap-2">
				<Button variant="link" size="md" onClick={() => setModalShow(true)}>
					View Applicants
				</Button>
				<Button variant="primary" size="md" onClick={handleShow}>
					Apply
				</Button>
			</div>

			<ViewApplicantsModal
				show={modalShow}
				onHide={() => setModalShow(false)}
				job={job}
			/>

			<Modal show={show} onHide={handleClose}>
				<Form onSubmit={handleApply}>
					<Modal.Header closeButton>
						<Modal.Title>Apply</Modal.Title>
					</Modal.Header>
					<Modal.Body>

						<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
							<FloatingLabel
								controlId="email"
								label="Email address"
								className="mb-3"
								value={email} onChange={(e) => setEmail(e.target.value)}
							>
								<Form.Control type="email" placeholder="name@example.com" />
							</FloatingLabel>
							<FloatingLabel value={name} onChange={(e) => setName(e.target.value)} controlId="name" label="Name">
								<Form.Control type="name" placeholder="Name" />
							</FloatingLabel>
							<FloatingLabel value={resumeLink} onChange={(e) => setResumeLink(e.target.value)} controlId="resume" label="Resume URL">
								<Form.Control type="text" placeholder="resume" />
							</FloatingLabel>
							<FloatingLabel value={skills} onChange={(e) => setSkills(e.target.value)} controlId="skills" label="Skills (comma separated)">
								<Form.Control type="text" placeholder="Skills" />
							</FloatingLabel>
						</Form.Group>

					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
						<Button variant="primary" type="submit">
							Apply
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</div>
	);
};

export default JobLink;
