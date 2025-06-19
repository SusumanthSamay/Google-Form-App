# Google-Form-App

[video 1 ] (https://drive.google.com/file/d/1Rh9c9ftlIJ_92mH9LbA0Qx76Rx91GFAK/view?usp=sharing)

[video 2] (https://drive.google.com/file/d/1Y-5dsnonu4AJzQoLUa81qbtwBABRCvyr/view?usp=sharing)


# Google Form Clone (Spring Boot + React)

This project is a Google Forms clone built using Java Spring Boot for the backend and React (with Vite) for the frontend.

## Project Structure

- **/src/main/java**: Contains the Java Spring Boot backend source code.
- **/google-forms-clone**: Contains the React frontend source code (bootstrapped with Vite).
- **pom.xml**: Maven configuration file for backend dependencies and build.
- **mvnw / mvnw.cmd**: Maven wrapper scripts.

## Features
- Create, edit, and delete forms
- Add multiple question types (short answer, multiple choice, etc.)
- Submit responses to forms
- View and manage responses

## Getting Started

### Backend (Spring Boot)
1. Navigate to the project root directory.
2. Run the following command to start the backend server:
   ```bash
   ./mvnw spring-boot:run
   ```
   or on Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```
3. The backend will start on [http://localhost:8080](http://localhost:8080)

### Frontend (React + Vite)
1. Navigate to the `google-forms-clone` directory:
   ```bash
   cd google-forms-clone
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. The frontend will start on [http://localhost:5173](http://localhost:5173)

## Requirements
- Java 17 or later
- Node.js 16 or later
- Maven

## License
THIS PRoject IS Done by Sususmanth Samay.


##TECH STACK
**Backend (Spring Boot)**
Java 17 - Programming language
Spring Boot 3.5.0 - Application framework
Spring Data JPA - For database operations
Spring Web - For building RESTful web services
Hibernate - ORM framework (included with Spring Data JPA)
H2 Database - In-memory database (commonly used with Spring Boot by default)
MYSQL Driver
**Frontend (React)**
React 19 - JavaScript library for building user interfaces
React DOM - For DOM manipulation in React
React Router DOM 7 - For client-side routing
Axios - For making HTTP requests to the backend
React Icons - For using icons in the UI
Build Tools & Development
Vite - Next generation frontend tooling
Maven - Build automation and dependency management (Backend)
Node.js & npm - JavaScript runtime and package manager (Frontend)
**Styling**
Tailwind CSS - Utility-first CSS framework
PostCSS - For processing CSS with Tailwind
Autoprefixer - For CSS vendor prefixing
**Development Tools**
ESLint - For code linting
TypeScript - For type checking (though not heavily used based on the config)
Spring Boot DevTools - For faster development restarts
API
RESTful API - For communication between frontend and backend
JSON - Data interchange format
This stack provides a modern, full-stack solution with a robust backend and a responsive frontend, 




