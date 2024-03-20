# Project Setup

## Configuration Setup

### NPM

You can run 'npm init' from the root directory to install

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

Edit/save the following variables in your ./api/.env file:  
API_PORT  
RESUME_ROUTE

For example:  
API_PORT=5000  
RESUME_ROUTE=http://localhost:5173/applications/

Edit/save the following variable in your ./client/.env file (create if you don't have one):
VITE_API_URL

For example:  
VITE_API_URL=http://localhost:5000

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
