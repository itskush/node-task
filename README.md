# Dump file  to TypeOrm PostgresDB example using Nestjs

This is a nestjs application built with PostgreSQL, and TypeORM. The application includes a file upload feature to database, and a reward calculator.

## Features
- **File Upload:** Users can upload a dump file to the database or update existing data with a new file.

## Prerequisites
- Node.js
- PostgreSQL

## Installation
1. Clone the repository
```
git clone https://github.com/itskush/node-task
```
2. Navigate into the directory
```
cd node-task
```
3. Install dependencies for server
```
npm install
```
5. Rename the `.env.template` files to a `.env` and fill in your database details

6. Start the application both client and server at the same time with concurrently
```
npm run start:dev
```
The application api should now be running at http://localhost:3000 assuming you have created a db in your postgres instance and linked it in the env file. DB_NAME is the name of the database you created in postgres.

## API Endpoints
- **POST /import**: Upload your dump txt file to this endpoint using a Post request via Postman or Insomnia.
- **Get /get-reward**: Will output a json of all rewards for the employees in the dmp based on their contributions.

## License
MIT