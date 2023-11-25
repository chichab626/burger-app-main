const PORT = 8000;
import express from "express";
import cors from "cors";
import morgan from "morgan";
import fetch from "node-fetch";
import dotenv from "dotenv";
import neo4j from "neo4j-driver";

dotenv.config();

const app = express();
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

//get all the restaurant data
app.get('/jobs', (req, res) => {
	const url = process.env.ENDPOINT;

	const options = {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'X-Cassandra-Token': process.env.ASTRA_TOKEN
		}
	};
	fetch(url, options)
		.then(response => response.json())
		.then(json => res.json(json))
		.catch(err => console.log('error:' + err));
});

app.get('/candidates', (req, res) => {
	const query = `
		query {
		candidates(value: { }) {
		  values {
			candidate_id
			name
			email
			skills
		   resume_link
		  }
		}
	  }
	  
    `;

	const url = process.env.ENDPOINT_GQL;
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-cassandra-token': process.env.ASTRA_TOKEN_GQL
		},
		body: JSON.stringify({ query })
	};
	fetch(url, options)
		.then(response => response.json())
		.then(async (json) => {


			const URI = process.env.NEO4J_URI;
			const USER = process.env.NEO4J_USERNAME;
			const PASSWORD = process.env.NEO4J_PASSWORD;
			let driver;

			try {
				driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
				const serverInfo = await driver.getServerInfo();
				console.log('Connection estabilished');
				console.log(serverInfo);
			} catch (err) {
				console.log(`Connection error\n${err}\nCause: ${err.cause}`);
				await driver.close();
				return;
			}

			// Use the driver to run queries
			let { records, summary } = await driver.executeQuery(
				`MATCH (c:Candidate) RETURN c`
			);

			let data = [];
			for (let record of records) {
				let entry = record.get('c').properties;
				if (entry.skills) entry.skills = entry.skills.split(',')
				entry.candidate_id = (entry.candidateID.low != undefined) ? entry.candidateID.low : entry.candidateID
				entry.resume_link = entry.resume
				data.push(entry);
			}

			return res.json(json.data.candidates.values.concat(data));
		})
		.catch(err => console.log('error:' + err));
});

app.get('/employers', (req, res) => {
	const query = `
	select * from tabular.employer;
    `;

	const url = process.env.ENDPOINT_TBL;
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
			'x-cassandra-token': process.env.ASTRA_TOKEN_TBL
		},
		body: query
	};
	fetch(url, options)
		.then(response => response.json())
		.then(json => res.json(json.data))
		.catch(err => console.log('error:' + err));
});

app.put("/apply", async (req, res) => {
	let result;
	let newID;

	const URI = process.env.NEO4J_URI;
	const USER = process.env.NEO4J_USERNAME;
	const PASSWORD = process.env.NEO4J_PASSWORD;
	let driver;

	try {
		driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

		// Obtain most recent candidate id
		result = await driver.executeQuery(`
			MATCH (o:Candidate)
			RETURN o.candidateID as id
			ORDER BY o.candidateID DESC
			LIMIT 1
		`);
		if (result.records.length > 0) {
			console.log(JSON.stringify(result.records[0].get('id'), null, 2));
			newID = parseInt(result.records[0].get('id')) + 1;
		}

		// create candidate
		await driver.executeQuery(`
		MERGE (p:Candidate {candidateID: $newID, name: $name, email : $email, resume:$resume, skills : $skills})
		RETURN p.candidateID AS candidateID
		`, { newID: newID, name: req.body.name, email: req.body.email, resume: req.body.resumeLink, skills:req.body.skills }
		);

		let job = req.body.job;
		console.log(JSON.stringify(job, null, 2))


		// create relationship
		await driver.executeQuery(`
			MATCH (p:Candidate {candidateID: $candidateID})
			MERGE (o:Job {jobID: $jobID, positionTitle : $title, description: $desc, 
				location : $location, salary : $salary, jobType : $jobType, status:$status})
			MERGE (p)-[r:APPLIES_FOR]->(o)
			RETURN p.candidateID AS id
			`, {
			jobID: job.jobID, title: job.positionTitle, desc: job.description, location: job.location,
			salary: job.salary, jobType: job.jobType, status: job.status, candidateID: newID, employerID: job.employerID
		}
		);

		console.log('created rel job')

		// create relationship
		await driver.executeQuery(`
			MATCH (o:Job {jobID: $jobID})
			MATCH (e:Employer {employerID: $employerID})
			MERGE (e)-[y:POSTS]->(o)
			RETURN o.jobID AS id
			`, {
			jobID: job.jobID, title: job.positionTitle, desc: job.description, location: job.location,
			salary: job.salary, jobType: job.jobType, status: job.status, candidateID: newID, employerID: job.employerID
		}
		);
	} catch (err) {
		console.log(`Connection error\n${err}\nCause: ${err.cause}`);
		await driver.close();
		return;
	}

	await driver.close();
	res.send({created : newID});
});

app.get('/applications', async (req, res) => {
	const jobID = req.query.id || 1;

	const URI = process.env.NEO4J_URI;
	const USER = process.env.NEO4J_USERNAME;
	const PASSWORD = process.env.NEO4J_PASSWORD;
	let driver;

	try {
		driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
		const serverInfo = await driver.getServerInfo();
		console.log('Connection estabilished');
		console.log(serverInfo);
	} catch (err) {
		console.log(`Connection error\n${err}\nCause: ${err.cause}`);
		await driver.close();
		return;
	}

	// Use the driver to run queries
	let { records, summary } = await driver.executeQuery(
		`MATCH (c:Candidate)-[:APPLIES_FOR]->(j:Job)
		where j.jobID = ${jobID}
		RETURN 
		c`,
		{},
		{ database: 'neo4j' }
	);

	let data = [];
	for (let record of records) {
		data.push(record.get('c').properties);
	}


	await driver.close();
	res.json(data);
});

function notFound(req, res, next) {
	res.status(404);
	const error = new Error('Not Found');
	next(error);
}

function errorHandler(error, req, res) {
	res.status(res.statusCode || 500);
	res.json({
		message: error.message
	});
}

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));