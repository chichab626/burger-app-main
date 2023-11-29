import { useState } from 'react';
import Joblist from '../src/components/Joblist.js';
import Candidatelist from '../src/components/Candidatelist.js';
import Employerlist from '../src/components/Employerlist.js';


import { Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {


	const [activeTab, setActiveTab] = useState('jobs');

	return (
		<div className="App">
			<h1>Job Board</h1>
			<Tabs
				activeKey={activeTab}
				onSelect={(k) => setActiveTab(k)}
				className="mb-3"
				fill
			>
				<Tab eventKey="jobs" title="Jobs">
					<Joblist />
				</Tab>
				<Tab eventKey="candidates" title="candidates">
					<Candidatelist />
				</Tab>
				<Tab eventKey="employers" title="employers">
					<Employerlist />
				</Tab>
			</Tabs>
		</div>
	);
};

export default App;
