import { useState, useEffect } from 'react';
import axios from 'axios';
const Candidate = () => {
	const [candidates, setCandidates] = useState(null);

	const fetchData = async () => {
		const candidatesData = await axios.get('http://localhost:8000/candidates');

		setCandidates(candidatesData.data.candidates.values);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="cards">
			{candidates?.map(entry => <div key={entry.candidate_id} >
				<div class={"card card-" + entry.candidate_id}>
					<h2 class="card__title">{entry.name}</h2>
					<p>{entry.email}</p>
					<p>{entry.skills?.map(element => <span class={"tag tag-" + entry.candidate_id}>{element}</span>)}</p>
					<p class="card__apply">
						<a class="card__link" href="#">{entry.resume_link} <i class="fas fa-arrow-right"></i></a>
					</p>
				</div>
			</div>)}
		</div>

	);
};

export default Candidate;