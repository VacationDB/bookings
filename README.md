# Project Name

> A dynamic component for booking homes on a vacation rental site.

## Related Projects

  - https://github.com/VacationDB/photos
  - https://github.com/VacationDB/reviews
  - https://github.com/VacationDB/listing-details

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

> Select a check-in date by clicking 'Check-In' 

> Select a check-out date

> Review final pricing

> Add any additional guests

> Submit your request by clicking the 'Request to book' button


## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- Docker



### Installation instructions

If not already done, install docker.

### Startup Instructions

From the root directory:

```sh
npm run start-dev
``` 

Service is now running at localhost:3004.
Visit a particular listing via the "listing/\<listing number\>" path


## Development - CRUD API 

To add a dataset to the database, use a HTTP POST request with url endpoint '/api/submit' and a request body shaped as a JSON object with the following format:
``````````````
const reqBody = {
  id,
  checkIn,
  checkOut,
};
``````````````

To read a dataset from the database, use a HTTP GET request with url endpoint '/api/listings/:listingId' with the listingId of the dataset requested.

To update a dataset in the database, use a HTTP PUT request with url endpoint '/api/update/:listingId' with the listingId of the dataset to be updated and a request body shaped as a JSON object with the following format with the updated information:
``````````````
const reqBody = {
  checkIn,
  checkOut,
};

``````````````

To delete a dataset from the database, use a HTTP DELETE request with url endpoint '/api/delete/:listingId' with the listingId to be deleted from the database.