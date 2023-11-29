import { useState, useEffect } from 'react';
import axios from 'axios';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import { ListGroup } from 'react-bootstrap';

const Candidate = () => {
	const [candidates, setCandidates] = useState(null);

	const fetchData = async () => {
		const candidatesData = await axios.get('http://localhost:8000/candidates');

		setCandidates(candidatesData.data);
	};

	useEffect(() => {
		fetchData();
	});

	return (
		<Container>
			<Row xs={1} md={3} className="g-4">
				{candidates?.map((entry, idx) =>
					<Col key={idx}>
						<Card style={{ width: '25rem', backgroundColor: '#fff3cd' }}>
							<Card.Body>
								<Card.Title>{entry.name}</Card.Title>
								<Card.Subtitle className="mb-2 text-muted">{entry.email}</Card.Subtitle>
								<ListGroup variant="flush">
									<ListGroup.Item>{entry.resume_link || entry.resume}</ListGroup.Item>
									<ListGroup.Item>
										<Stack direction="horizontal" gap={2}>
											{entry.skills?.map(element => <Badge pill bg="primary">{element}</Badge>)}
										</Stack>
									</ListGroup.Item>
								</ListGroup>
							</Card.Body>
						</Card></Col>
				)}
			</Row>
		</Container>

	);
};

export default Candidate;