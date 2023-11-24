import { useState } from 'react';
import Joblist from '../src/components/Joblist.js';
import Candidatelist from '../src/components/Candidatelist.js';
import Employerlist from '../src/components/Employerlist.js';

const App = () => {


	const [activeTab, setActiveTab] = useState('jobs');

	const renderTab = () => {
		switch (activeTab) {
			case 'jobs':
				return <Joblist />;
			case 'employers':
				return <Employerlist />;
			case 'candidates':
				return <Candidatelist />;
			default:
				return null;
		}
	};

	return (
		<div className="App">
			<h1>Job Board</h1>
			<ul className="tabs-header">
				<li className={activeTab === 'jobs' ? "active" : ""}>
					<a onClick={() => setActiveTab('jobs')}>
						<span>Job List</span>
					</a>
				</li>
				<li className={activeTab === 'candidates' ? "active" : ""}>
					<a onClick={() => setActiveTab('candidates')}>
						<span>Candidate List</span>
					</a>
				</li>
				<li className={activeTab === 'employers' ? "active" : ""}>
					<a onClick={() => setActiveTab('employers')}>
						<span>Employer List</span>
					</a>
				</li>
			</ul>
			{renderTab()}
		</div>
	);
};

export default App;
