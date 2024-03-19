#!/bin/bash

# Variables
DB_USER="myuser"
DB_PASSWORD="password"
DB_NAME="applicationDB"

# Install PostgreSQL
echo "Installing PostgreSQL..."
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
echo "Starting PostgreSQL service..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create a new PostgreSQL role and database
echo "Creating new PostgreSQL role and database..."
sudo -u postgres psql -c "CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "ALTER ROLE $DB_USER CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME WITH OWNER $DB_USER;"

echo "PostgreSQL database setup completed successfully."