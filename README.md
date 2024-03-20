# This Repository

This is a skeleton repository that you can use to complete the take home challenge. It provides some
basic structure and tooling to get you started. You are welcome to use a different setup if you
prefer.

The `api` is a basic Express application and uses Prisma for data access with a SQLite database.

The `client` is a basic Vite + React application.

All dependencies are installed in the root of the project for simplicity. You can run both projects
together with

```
$> npm run start
```

or individually with

```
$> npm run start:api
$> npm run start:client
```

The API and client will both automatically reload on file changes to help speed up development.

# Hugo Full Stack Challenge

## Scenario

At Hugo, customers often start the insurance application process on an external third party site,
where that third party site then sends the collected information to our service so that the user can
continue their application process and receive a price quote.

## Task

### Backend

Create a web API that exposes four endpoints:

1. `POST` route that starts a new insurance application and initializes it with the provided data -
   This route should return a “resume” route that points to the frontend URL to load the created
   application
2. `GET` route that can retrieve the current insurance application
3. `PUT` route that will update the insurance application with provided data
    - This should accept partial fields from the quote application. Each submitted field needs to
      pass validation in order to be updated.
    - The quote application as a whole may still be incomplete and should not cause this route to
      fail.
4. `POST` route that validates the entire application and returns a price
    - You do not actually need to do any calculation here, returning a random number value would be
      sufficient

### Frontend

Create a React frontend that can display the current application state, and can allow information to
be added or edited. The frontend should do basic validation, and when all the required information
is completely filled out, allow the application to be submitted for completion, and display either
an error message if the application is not complete or the quoted price to purchase insurance.

## Data Specifications

The data that an insurance application needs consists of the following:

-   First and Last name
-   Date of Birth (validate that input is a date and at least 16 years old)
-   Address
    -   Street
    -   City
    -   State
    -   ZipCode (validate numeric, but don’t worry about validating if zip code exists)
-   Vehicle(s) (must have 1 vehicle, cannot have more than 3 total)
    -   VIN
    -   Year (validate numeric and valid year between 1985 and current year + 1)
    -   Make and Model

## Guidelines

-   Provide setup instructions for the frontend and backend projects
-   The submission should be self-contained and ran locally. Please avoid connecting to external
    services or databases.
    -   Instructions/scripts to provision local databases should be included with the submission.
-   Feel free to use any starter kit/bootstrapping tools you feel comfortable with to create the
    initial project (i.e. create-react-app, vite, etc for the front end) or use this one.
-   Don’t focus too much on the styling/UX of the frontend. Focus more on component
    organization/structure
-   Backend can use any flavor of SQL for data storage.
    -   Ensure that the frontend can resume the same application if the page is closed and reopened

## Stretch Goals

Implement the following if you have time or can plan to include within the time frame:

-   Use TypeScript with appropriate type definitions
-   Allow adding additional people to the insurance application:
    -   First and Last name
    -   Date of Birth
    -   Relationship (Spouse, Sibling, Parent, Friend, Other)

# Project Setup

## Configuration Setup

### PostgreSQL Setup

This section provides the instructions for setting up a PostgreSQL database for your local
development environment. Follow the steps below to configure the PostgreSQL database named
`applicationDB` on a linux environment. This setup was run on WSL 2.0.

#### Running the Setup Script

To prepare your PostgreSQL database, execute the setup script included in this repository. Start by
making the script executable, then run it with administrative privileges:

```bash
chmod +x setupDatabase.sh
sudo ./setupDatabase.sh
```

#### What the Script Does

The setupDatabase.sh script automates the following tasks to ensure a smooth setup for your
PostgreSQL environment:

Installs PostgreSQL: Updates the system's package lists and installs PostgreSQL along with its
contrib package, which includes additional utilities and functionality.

Starts and Enables PostgreSQL Service: Initiates the PostgreSQL service and sets it to automatically
start on system boot.

#### Creates a New User and Database:

Creates a new PostgreSQL user named myuser with the password password. This user has the necessary
permissions to create and manage databases. Creates a new database called applicationDB. This
database is set to be owned by myuser, ensuring that the user has full access to manage the
database.

#### Configuration Summary

After executing the script, the PostgreSQL database will be configured with the following settings:

Database Name: applicationDB Username: myuser Password: password Port: 5432 Host: Localhost
(127.0.0.1)

### Prisma Config

Edit/save the following line in your ./api/.env file (create if you don't have one):
DATABASE_URL="postgresql://myuser:password@localhost:5432/applicationDB"

### ENV Config

Edit/save the following variables in your ./api/.env file: API_PORT RESUME_ROUTE

For example: API_PORT=5000 RESUME_ROUTE=http://localhost:5173/applications/

Edit/save the following variable in your ./client/.env file (create if you don't have one):
VITE_API_URL

For example: VITE_API_URL=http://localhost:5000

### Starting the App

You can start the app with the following command:

```
$> npm run start
```

or individually with

```
$> npm run start:api
$> npm run start:client
```

## Using the App

### App Navigation

You can click on the link exposed by Vite as the app starts on root, for example:
http://localhost:5173/

Clicking on the "Start New Application" button will post a new application and redirect to a resume
route for that application id.

From here, you can enter information for the fields, and add/remove additional members or vehicles
with some constraints placed on certain fields.

If you click "Save" here the application will be stored in the backend with minimal data validation
and you will be able to resume your application when the url is refreshed or reopened. The save
state will overwrite any local storage state that was currently stored, and will be overwritten if
you do another save state.

If you do not save the application, then the application will use local storage to fill in fields if
the page is reloaded. This will no longer work once you have saved the application for the first
time as it will then only go off of the last saved application data.

Clicking submit will go through a more rigorous validation process that will confirm in the frontend
and the backend that all fields are entered and valid, and at least 1 and at most 3 vehicles are on
the form. Once passing this validation, the application will be updated in the system, and the user
will be rerouted to a page that displays a quote for the submitted application.

To go through the app again, the user can click on the "Home" button to return to root.
