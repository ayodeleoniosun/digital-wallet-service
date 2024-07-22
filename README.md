# Wallet Service API

This is scalable, performant and reliable RESTful API that allow users to perform the following operations:

* Registration of new user.
* Login of existing user.
* Create user wallet.
* Fund user wallet.
* Withdraw from user wallet
* Transfer between wallets.
* View accounting summary.
* View deposit, withdrawals and transaction details.

### Technologies Stack

* Node.js
* Typescript.
* Expressjs.
* Supertest (testing).

### Installation

#### Step 1: Clone the repository

```shell
git clone https://github.com/ayodeleoniosun/digital-wallet-service.git
```

#### Step 2: Switch to the repo folder

```shell
cd digital-wallet-service
```

#### Step 3: Setup environment variable

- Copy `.env.sample` to `.env` i.e `cp .env.sample .env`
- Update all the variables as needed

#### Step 4: Dockerize app

```bash
bash setup.sh
```

#### Step 5: Manually create new database

Run the following command:

```bash
docker exec -it wallet_db mysql -u root -p
```

Enter the database password.

Then, run this command:

```bash
  CREATE DATABASE wallet_service;
```

#### Step 6: Run migrations

```bash
docker-compose exec wallet_app npx sequelize-cli db:migrate
```

### API Documentation

The Postman API collection is locally available [Here](./docs/postman_collection.json). <br/>

The Postman API collection is remotely
available [Here](https://documenter.getpostman.com/view/18037473/2sA3kVk1gB#6bd08934-0dc7-4775-a9d8-546295e58e51)
. <br/>

### Testing

An end-to-end test and unit tests are written for the routes and services. <br/>

To run test, use the following command:

```bash
docker-compose exec wallet_app npm run test
```

