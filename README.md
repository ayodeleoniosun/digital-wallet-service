Products Store API
This is an authentication based RESTful API to create and manage products in a store

Getting Started
Features
Technologies Stack.
Installation
API Documentation
Testing
Features
Registration of new user.
Login of existing user.
Create new products.
Update existing products.
View product details.
List all products
Technologies Stack
Node.js
Typescript.
Expressjs.
MongoDB.
Typegoose ORM.
Supertest (testing).
Installation
Step 1: Clone the repository
git clone https://github.com/ayodeleoniosun/backend-engineer-test.git
Step 2: Switch to the repo folder
cd backend-engineer-test
Step 3: Setup environment variable
Copy .env.example to .env i.e cp .env.example .env
Update all the variables as needed
Step 4: Dockerize app
bash setup.sh
API Documentation
The Postman API collection is locally available Here.

The Postman API collection is remotely available Here.

Testing
An end-to-end test and unit tests are written for the routes and services.

To run test, use the following command:

docker-compose exec node-app npm run test