# QA Dashboard - Test Automation Project

A full-stack bug tracking dashboard created to practice and demonstrate software testing and test automation skills.

The project contains a frontend interface, a Node.js REST API backend with CRUD operations, automated UI tests with Cypress, and API testing with Postman/Newman.

![QA Dashboard](screenshots/Dashboard.PNG)

## Project Overview

The application allows users to:

* Create new bugs
* View existing bugs
* Change bug status
* Delete bugs
* Validate API responses
* Run automated UI and API tests

The main goal of this project is to demonstrate practical QA automation workflow.

---

# Technologies Used

## Frontend

* HTML
* CSS
* JavaScript (Fetch API for REST API communication)

## Backend

* Node.js
* Express.js
* REST API

## Test Automation

* Cypress (UI test automation)
* Postman (API testing)
* Newman (Postman CLI runner)

## Tools

* Visual Studio Code
* Git / GitHub

---

# Project Structure

```
Prodzs
│
├── frontend
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend
│   ├── server.js
│   ├── cypress
│   |    └── ...
│   ├── package-lock.json
│   └── package.json
│
├── cypress
│   ├── e2e
│   │   └── dashboard2.cy.js
│   ├── fixtures
│   ├── screenshots
│   ├── support
│   └── reports
│       ├── mochawesome.json
│       └── html
│           └── mochawesome.html

│
├── postman
│   ├── Dashboard2.postman_collection.json
│   ├── Dashboard2.postman_environment.json
│   └── newman-reports
│       └── dashboard-api-report.html
│
├── cypress.config.js
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

---

# Features Tested

## UI Tests (Cypress)

Automated tests cover:

* Dashboard loading
* Bug table visibility
* API status card validation
* Opening create bug modal
* Creating a new bug
* Validation when title is empty
* Priority selection
* Changing bug status from UI
* Confirm dialogs handling

Example:

```
should create a new bug
should not create bug without title
should change bug status from UI
```

---

## API Tests (Postman + Newman)

API testing covers:

* GET all bugs
* Validate response status codes
* Validate required fields
* Create bug requests
* Duplicate bug validation
* Update bug status
* Delete bug

## API Validation with Cypress

* Cypress also validates API-dependent UI elements.

---

# Running the Project

## Backend

Navigate to backend folder:

```
cd backend
```

Install dependencies:

```
npm install
```

Start server:

```
node server.js
```

Backend runs on:

```
http://localhost:3000
```

---

## Frontend

Open:

```
frontend/index.html
```

or run with a local server.

---

# Running Cypress Tests

Cypress tests are configured to run using Google Chrome browser.

Prerequisites:
- Node.js installed
- Google Chrome browser installed

Install dependencies from project root:

```bash
npm install
```

Open Cypress Test Runner:

```bash
npx cypress open
```

Run Cypress tests in Chrome:

```bash
npm run test:chrome
```

The automated UI tests are executed in Google Chrome browser.

Generate HTML report from Cypress results:

```bash
npx marge cypress/reports/mochawesome.json --reportDir cypress/reports/html --inline
```

# Running Postman Tests with Newman

Install Newman:

```
npm install -g newman
```

Run collection:

```
newman run postman/Dashboard2.postman_collection.json
```

Generate HTML report:

```
newman run postman/Dashboard2.postman_collection.json -r cli,htmlextra
```

---

# Test Results

The project includes:

* Cypress automated UI test suite
* Cypress HTML test report
* Postman API collection
* Newman HTML report included in postman/newman-reports

The tests validate both frontend behavior and backend API functionality.

---

# Purpose of the Project

This project was created as a QA automation portfolio project to demonstrate:

* Manual testing knowledge
* UI automation skills
* API testing experience
* JavaScript fundamentals
* REST API understanding
* Test reporting workflow

---

# Author

Created as an automation portfolio project by Huszty Richárd