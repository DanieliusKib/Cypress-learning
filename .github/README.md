# Cypress Learning and personal project Repository

This repository contains automated test scripts created as part of my learning journey with Cypress. The goal is to showcase my skills and understanding of automation testing, organized into categories for easy reference.

## Installation & Setup

To set up the project locally, make sure you have **Node.js** and **npm** installed.

1. Clone the repository.
2. In the project directory, run the following command to install all dependencies:
   ```bash
   npm install


## Repository Folder Structure

- **.github**
  └── **workflows**: CI/CD setup with GitHub Actions for running tests.

- **cypress**
  └── **e2e**: Contains organized test scripts 
         └── **Ostrovit eshop mock automated test**: automated test in real life eshop, that logs in, searches for a product and
         └── **Daily CI Pipeline for skelbiu.lt Ad Refresh Automation**: Cypress scripts configured to run daily through a GitHub Actions workflow, automating the process of refreshing ads on skelbiu.lt. This setup demonstrates practical experience with CI pipeline configuration and VPN integration for secure testing.

         └── **Various practice scripts learning in's and out's of cypress functionalities**
  └── **fixtures**: Test data used for various tests.
  └── **support**: Contains custom commands and reusable functions to support test scripts and enhance Cypress functionalities.

## Running Tests locally

### Through Cypress GUI
```bash
npx cypress open
