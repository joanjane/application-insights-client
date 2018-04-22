# Application Insights Log

This is a responsive Application Insights log client that enables to query traces with analytics API. Setup the application id and generate an api key in azure. It's still a work in progress ;)

This application is built with react, redux and redux-observable. It's not publicly deployed, but it will be soon.

## Features
* Query traces with a clean interface and logger style interface
* Query exceptions
* Store multiple credentials of distinct apps and switchable
* Open an app directly with a single link: http://localhost:3000?app_id={your_app_id}&api_key={your_api_key}
* Auto refresh each 30 seconds (toggleable)

## Query language
Read the log analytics language reference: https://docs.loganalytics.io/docs/Language-Reference/

Some simple samples:

`traces | where severityLevel > 2 | sort by timestamp desc | limit 200`

`traces | where message has 'Error' | sort by timestamp desc | limit 200`

`exceptions | sort by timestamp desc | limit 200`

## Running this app
Install dependencies with `npm install` and continue starting up the app with `npm start`. Open this url http://localhost:3000/ and enter the credentials on top and search for traces.