# WindWarrior

### 🗺️ Running the Map Page Locally

To run the map feature on your local machine, you will need to install the required Mapbox dependencies and add your secret API key.

1. Install Dependencies

After pulling the branch, you must install the new Mapbox packages. From the root of the project, run:

npm install


2. Set Up Environment File

You will need to add a .env file to the root of the project to securely store your Mapbox API key.

Create a new file named .env in the root folder of TID_WeekendWarrior.

Add your Mapbox Access Token to this file. 

VITE_MAPBOX_TOKEN="YOUR_MAPBOX_SECRET_KEY_GOES_HERE"


Note: The .env file is included in .gitignore and will not be tracked by Git. This is intentional to protect our secret API keys.

⚠️ Important: Usage Limit

The Mapbox API has a free tier of 50,000 map loads per month. Please be mindful of this and avoid excessive refreshing while developing, otherwise, we may get charged.
