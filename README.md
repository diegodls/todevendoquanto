# ToDeVendoQuanto

A Node.js application to manage and track debts efficiently.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Introduction

ToDeVendoQuanto is a Node.js-based application designed to help users manage and track debts with ease.

## Features

- Add, update, and delete debts.
- View a summary of all debts.
- User-friendly interface for managing financial records.

## Installation

1. Clone the repository:
    ```git clone https://github.com/yourusername/todevendoquanto.git```
2. Navigate to the project directory:
    ```cd todevendoquanto```
3. Install dependencies:
    ```npm install```

## Usage

1. Generate the Prisma client:
    ```npx prisma generate```
2. Create a `.env` file in the root directory and add your database connection string:
    ```DATABASE_URL="your_database_connection_string"```
3. Run the database migrations:
    ```npx prisma migrate dev --name init```
4. Start the application:
    ```npm run dev```
5. Open your browser and navigate to `http://localhost:3000`.

## Technologies Used

- Node.js
- Express.js
- MongoDB (or any other database)
- Other dependencies listed in `package.json`

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch:
    ```git checkout -b feature-name```
3. Commit your changes:
    ```git commit -m "Add feature-name"```
4. Push to the branch:
    ```git push origin feature-name```
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
