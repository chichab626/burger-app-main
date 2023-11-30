const PORT = 8000;
// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import fetch from "node-fetch";
// import dotenv from "dotenv";
// import getNeo4jDriver from "./util.js";
//import {getMergedCandidates, getEmployersDTX} from "./query.js";

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const dotenv = require("dotenv");
const getNeo4jDriver = require("./util.js").getNeo4jDriver;
const getMergedCandidates = require("./query").getMergedCandidates;
const getEmployersDTX = require("./query").getEmployersDTX;




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

// Endpoint to add a new job
app.post('/add-job/:employerId', async (req, res) => {
	const { employerId } = req.params;
	const { positionTitle, description, salary } = req.body;
    
	// Create the job object
	const newJob = {
	  jobID: require('node:crypto').randomInt(50000),
	  employerID : employerId,
	  positionTitle,
	  description,
	  salary
	};
  
	// Add the job
	const url = process.env.ENDPOINT;

	const options = {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'X-Cassandra-Token': process.env.ASTRA_TOKEN
		},
		body : JSON.stringify(newJob)
	};

	await fetch(url, options)
  
	return res.status(201).json({ success: true, message: 'Job added successfully', job: newJob });
  });

app.get('/candidates', async (req, res) => {
	let result = await getMergedCandidates();
	res.send(result)
});

app.get('/employers', async (req, res) => {

	let data = await getEmployersDTX();
	res.json(data);
});

app.post("/apply", async (req, res) => {
	let result;
	let newID = require('node:crypto').randomInt(50000);
	let driver;

	try {
		driver = await getNeo4jDriver();

		// Obtain candidate if email already exists
		result = await driver.executeQuery(`
			MERGE (c:Candidate {email: $email})
			ON CREATE
				SET c.candidateID = $newID, c.name = $name, c.resume=$resume, c.skills = $skills, c.email = $email
			ON MATCH
				SET c.name = $name, c.resume=$resume, c.skills = $skills, c.email = $email
			RETURN c.candidateID as id
		`, { newID: newID, name: req.body.name, email: req.body.email, resume: req.body.resumeLink, skills:req.body.skills });
		if (result.records.length > 0) {
			console.log(JSON.stringify(result.records[0].get('id'), null, 2));
			newID = parseInt(result.records[0].get('id'));
		}

		// // create candidate
		// await driver.executeQuery(`
		// MERGE (p:Candidate {candidateID: $newID, name: $name, email : $email, resume:$resume, skills : $skills})
		// RETURN p.candidateID AS candidateID
		// `, { newID: newID, name: req.body.name, email: req.body.email, resume: req.body.resumeLink, skills:req.body.skills }
		// );

		let job = req.body.job;

		// create relationship
		await driver.executeQuery(`
			MATCH (p:Candidate {candidateID: $candidateID})
			MERGE (o:Job {jobID: $jobID, positionTitle : $title, description: $desc, 
				location : $location, salary : $salary, jobType : $jobType, status:$status})
			MERGE (p)-[r:APPLIES_FOR]->(o)
			RETURN p.candidateID AS id
			`, {
			jobID: job.jobID, title: job.positionTitle, desc: job.description, location: job.location || 'unspecified',
			salary: job.salary, jobType: job.jobType || 'Full-Time', status: job.status || 'open', candidateID: newID, employerID: job.employerID
		}
		);

		// // create relationship
		// await driver.executeQuery(`
		// 	MATCH (o:Job {jobID: $jobID})
		// 	MATCH (e:Employer {employerID: $employerID})
		// 	MERGE (e)-[y:POSTS]->(o)
		// 	RETURN o.jobID AS id
		// 	`, {
		// 	jobID: job.jobID, title: job.positionTitle, desc: job.description, location: job.location,
		// 	salary: job.salary, jobType: job.jobType, status: job.status, candidateID: newID, employerID: job.employerID
		// }
		// );
	} catch (err) {
		console.log(`Connection error\n${err}\nCause: ${err.cause}`);
		await driver.close();
		return;
	}

	driver.close();
	res.send({created : newID});
});

app.get('/applications', async (req, res) => {
	let jobID = req.query.id || 1;

	// if (typeof jobID === 'string' || jobID instanceof String) {
	// 	jobID = `'${jobID}'`
	// }

	let driver = await getNeo4jDriver();

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


	driver.close();
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