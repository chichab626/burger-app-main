//import neo4j from "neo4j-driver";
const neo4j = require('neo4j-driver')

const getNeo4jDriver = async () => {
	const URI = process.env.NEO4J_URI;
	const USER = process.env.NEO4J_USERNAME;
	const PASSWORD = process.env.NEO4J_PASSWORD;

	try {
		let driver = await neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
		return driver;
	} catch (err) {
		console.log(`Connection error\n${err}\nCause: ${err.cause}`);
		driver.close();
		throw Error;
	}
}

module.exports = {getNeo4jDriver}