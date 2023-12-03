import { useState, useEffect } from 'react';
import axios from 'axios';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { ListGroup, Button, Modal, Form, FormControl, FloatingLabel } from 'react-bootstrap';

const Employer = () => {
	const [employers, setEmployers] = useState(null);
	const [showModal, setShowModal] = useState(false);

	const [positionTitle, setPositionTitle] = useState('');
	const [description, setDescription] = useState('');
	const [salary, setSalary] = useState('');
	const [selected, setSelected] = useState(null);

	const handleShow = () => setShowModal(true)
	const handleClose = () => setShowModal(false);

	const fetchData = async () => {
		const data = await axios.get('http://localhost:8000/employers');

		setEmployers(data.data);
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		let jobData = {positionTitle, description, salary}
		
		await axios.post(`http://localhost:8000/add-job/${selected.employer_id}`, jobData )
		alert("Job Added");
		handleClose();
	};

	return (
		<>
			<Container>
				<Row xs={1} md={2} className="g-4">
					{employers?.map((entry, idx) =>
						<Col key={idx}>
							<Card style={{ width: '35rem', backgroundColor: 'pink' }}>
								<Card.Body>
									<Card.Title>{entry.company_name}</Card.Title>
									<Card.Subtitle className="mb-2 text-muted">{entry.location}</Card.Subtitle>
									<ListGroup variant="flush">
										<ListGroup.Item>{entry.email}</ListGroup.Item>
									</ListGroup>
								</Card.Body>
								<Card.Footer>
									<div className="d-grid gap-2">
										<Button variant="primary" size="md" onClick={() => {
											handleShow()
											setSelected(entry)
										}}>
											Post Job
										</Button>
									</div>
								</Card.Footer>

							</Card></Col>
					)}
				</Row>
			</Container>

			<Modal show={showModal} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Create Job</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleSubmit}>
						<Form.Group controlId="positionTitle">
							<FloatingLabel controlId="positionTitle" label="Position Title">
								<FormControl
									type="text"
									placeholder="Enter position title"
									value={positionTitle}
									onChange={(e) => setPositionTitle(e.target.value)}
									required
								/>
							</FloatingLabel>
						</Form.Group>

						<Form.Group controlId="description">
							<FloatingLabel controlId="description" label="Description">
								<FormControl
									as="textarea"
									placeholder="Enter job description"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									required
								/>
							</FloatingLabel>
						</Form.Group>

						<Form.Group controlId="salary">
							<FloatingLabel controlId="salary" label="Salary">
								<FormControl
									type="text"
									placeholder="Enter salary"
									value={salary}
									onChange={(e) => setSalary(e.target.value)}
									required
								/>
							</FloatingLabel>
						</Form.Group>

						<Button variant="primary" type="submit">
							Create
						</Button>
					</Form>
				</Modal.Body>
			</Modal>
		</>

	);
};

export default Employer;