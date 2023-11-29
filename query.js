const getNeo4jDriver = require('./util').getNeo4jDriver


const getMergedCandidates = async () => {
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

	let [response, data] = await Promise.all([fetch(url, options), getCandidatesFromNeo()]);
	let json = await response.json()

	return json.data.candidates.values.concat(data)
}

const getCandidatesFromNeo = async () => {

	let driver = await getNeo4jDriver();

	// Use the driver to run queries
	let { records, summary } = await driver.executeQuery(
		`MATCH (c:Candidate) RETURN c`
	);

	let data = [];
	for (let record of records) {
		let entry = record.get('c').properties;
		if (entry.skills) entry.skills = entry.skills.split(',');
		entry.candidate_id = (entry.candidateID.low != undefined) ? entry.candidateID.low : entry.candidateID;
		entry.resume_link = entry.resume;
		data.push(entry);
	}

	driver.close();
	return data;

}


const getEmployersDTX = async () => {

	const url = process.env.ENDPOINT_TBL;
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
			'x-cassandra-token': process.env.ASTRA_TOKEN_TBL
		},
		body: "select * from tabular.employer"
	}

	let resp = await fetch(url, options)
	let json = await resp.json()
	return json.data
}

module.exports = {getMergedCandidates, getEmployersDTX};