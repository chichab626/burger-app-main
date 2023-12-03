
import { useState } from 'react';
import Joblist from '../src/components/Joblist.js';
import Candidatelist from '../src/components/Candidatelist.js';
import Employerlist from '../src/components/Employerlist.js';




import { Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {const [activeTab, setActiveTab] = useState('jobs');

return (
	<div className="App">
		<header className="app-header">
   <h1>DF Recruiting Agency</h1>
   <h4>Connecting Talent with Opportunity</h4>
</header>

		<h1></h1>
		<Tabs
			activeKey={activeTab}
			onSelect={(k) => setActiveTab(k)}
			className="mb-3"
			fill
		>
			<Tab eventKey="jobs" title="Job List">
				<Joblist />
			</Tab>
			<Tab eventKey="candidates" title="Candidate List">
				<Candidatelist />
			</Tab>
			<Tab eventKey="employers" title="Employer List">
				<Employerlist />
			</Tab>
		</Tabs>
		<footer className="site-footer">
  <div className="footer-container">
    <div className="footer-section">
      <h3>Contact Us</h3>
      <p>Email: info@dfrecruiting.com</p>
      <p>Phone: (123) 456-7890</p>
    </div>
    <div className="footer-section">
      <h3>Quick Links</h3>
      <ul>
        <li><a href="#jobs">Job List</a></li>
        <li><a href="#candidates">Candidate List</a></li>
        <li><a href="#employers">Employer List</a></li>
      </ul>
    </div>
    <div className="footer-section">
  <h3>Follow Us</h3>
  <div className="social-icons">
    <p>WAHID</p>
	<p>ATIF</p>
	<p>LIMON</p>
	<p>MARIA</p>
  </div>
</div>

  </div>
  <div className="copyright">
    <p>&copy; 2023 DF Recruiting Agency. All rights reserved.</p>
  </div>
</footer>


	</div>
);
};

export default App;
