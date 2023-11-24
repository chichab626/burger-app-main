import { useState, useEffect } from 'react';
import axios from 'axios';
import Joblink from './Applist.js';

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
		<div class="cards">
			{burgers?.map(burger =>
				<div class={"card card-" + burger.jobID}>
					<h2 class="card__title">{burger.positionTitle}</h2>
					<p>{burger.description}</p>
					<p>{burger.location}</p>
					<p>{burger.salary}</p>
					<p class="card__apply">
						<a class="card__link" href="#">Apply Now <i class="fas fa-arrow-right"></i></a>
					</p>
					<Joblink key={burger.jobID} jobTitle={burger.positionTitle} jobID={burger.jobID} />
				</div>
			)
			}

		</div>

	);
};

export default Joblist;