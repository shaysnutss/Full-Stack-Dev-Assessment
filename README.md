# Simple CRUD TO-DO List Application

## Overview
This Simple CRUD TO-DO list application is designed to help you manage tasks efficiently. The application features a  backend developed with Python and Flask, a  frontend created using ReactJS, and a MySQL database for data persistence.

## Getting Started

### Prerequisite Tools
To set up and run this application, you will need the following tools:
- **MySQL**: Used for database persistence (version 8.0.30).
- **MySQL Workbench**: To execute SQL commands and manage your database.
- **Docker**: Containerization platform to run the application (version 20.10.17).

### Setting Up
1. **Execute SQL File**:
   - Open MySQL Workbench and execute the SQL file named `init.sql` to initialize the database schema and data.

2. **Configure Backend**:
   - Open `app.py` located in the backend directory.
   - Add your database username and password into line 11.

3. **Start Docker Daemon**:
   - Open your Docker client to start the Docker daemon.

4. **Run Application**:
   - Open your terminal and navigate to the root folder of the application (`Full-Stack-Dev-Assessment`).
   - Run the following command to start the application:
     ```sh
     docker compose up
     ```
   - The first run might take a bit of time. The application is successfully running when you see:
     - `Running on all addresses (0.0.0.0)` for the Flask app.
     - `Compiled successfully` for the React app.

5. **View Application**:
   - Navigate to `http://localhost:3000` in your web browser to view and interact with the application.

6. Exiting application
  -You can press control + c
  - You can execute
    ```sh
     docker compose down
     ```
 - I would suggest executing the following command to free up memory in your laptop
   ```sh
     docker compose prune 
     ```
   and ```sh
     docker rmi $(docker images -q)
     ```
## API Documentation

- You can visit this [link](https://sneaky-bagpipe-ea1.notion.site/Accenture-API-Documentation-83517bdaa07f4c6297dc6fe8266d9fdb) to view details on the API documentation.
- I have managed to integrate Swagger and Flask-RESTPlus for automatic API documentation. As I am having errors with that and the frontend, so, I have not attached it.

Have fun!
