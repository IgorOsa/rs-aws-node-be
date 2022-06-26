import { Client } from 'pg';

const databaseClient = new Client();
databaseClient.connect();

export default databaseClient;