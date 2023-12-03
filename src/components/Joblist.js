import { useState, useEffect } from 'react';
import axios from 'axios';
import Joblink from './Applist.js';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Container } from 'react-bootstrap';


const Joblist = () => {
	const [burgers, setBurgers] = useState(null);

	const fetchData = async () => {
		const burgerData = await axios.get('http://localhost:8000/jobs');
		const data = Object.keys(burgerData.data.data).map(burger => burgerData.data.data[burger]);
		setBurgers(data);
	};

	useEffect(() => {
		fetchData();
	}, []);


	return (
		<Container>
			<Row xs={1} md={1} className="g-4">
				{burgers?.map((burger, idx) =>
					<Col key={idx}>
						<Card style={{ width: '70rem', backgroundColor: '#a3cfbb' }}>
							<Card.Body>
								<Card.Title>{burger.positionTitle}</Card.Title>
								<Card.Subtitle className="mb-2 text-muted">{burger.salary}</Card.Subtitle>
								<Card.Text>
									{burger.description}
								</Card.Text>

								<Joblink key={burger.jobID} jobTitle={burger.positionTitle} job={burger} />
							</Card.Body>
						</Card></Col>
				)}
			</Row>
		</Container>


	);
};

export default Joblist;