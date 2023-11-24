import { useState, useEffect } from 'react';
import axios from 'axios';
const Employer = () => {
	const [employers, setEmployers] = useState(null);

	const fetchData = async () => {
		const data = await axios.get('http://localhost:8000/employers');
		
		setEmployers(data.data)
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="cards">
			{employers?.map((entry,idx) => <div key={entry.employer_id} >
				<div class={"card card-" + (idx+1)}>
					<h2 class="card__title">{entry.company_name}</h2>
					<p>{entry.email}</p>
					<p>{entry.location}</p>
					<p class="card__apply">
						<a class="card__link" href="#">View Jobs <i class="fas fa-arrow-right"></i></a>
					</p>
				</div>
			</div>)}
		</div>
	);
};

export default Employer;