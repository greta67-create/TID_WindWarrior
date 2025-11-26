# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




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