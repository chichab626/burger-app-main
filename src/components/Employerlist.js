import { useState, useEffect } from 'react';
import axios from 'axios';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { ListGroup } from 'react-bootstrap';

const Employer = () => {
	const [employers, setEmployers] = useState(null);

	const fetchData = async () => {
		const data = await axios.get('http://localhost:8000/employers');

		setEmployers(data.data);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (

		<Container>
			<Row xs={1} md={3} className="g-4">
				{employers?.map((entry, idx) =>
					<Col key={idx}>
						<Card style={{ width: '25rem', backgroundColor: 'pink' }}>
							<Card.Body>
								<Card.Title>{entry.company_name}</Card.Title>
								<Card.Subtitle className="mb-2 text-muted">{entry.location}</Card.Subtitle>
								<ListGroup variant="flush">
									<ListGroup.Item>{entry.email}</ListGroup.Item>
								</ListGroup>
							</Card.Body>
						</Card></Col>
				)}
			</Row>
		</Container>
	);
};

export default Employer;