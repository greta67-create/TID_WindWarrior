# WindWarrior

A React-based web application for wind sports enthusiasts to discover spots, join sessions, and connect with other riders. Please follow the setup guide to run the app.

## Setup

### 1. Install Dependencies
In the terminal run the following command
```bash
npm install
```

### 2. Environment Variables
**Note:** The `.env` file is gitignored and will not be committed to the repository.
Therefore you have to create a `.env` file in the root directory with the following variables:

```env
VITE_MAPBOX_TOKEN=your_mapbox_access_token_here
VITE_PARSE_APP_ID=your_parse_app_id_here
VITE_PARSE_JS_KEY=your_parse_javascript_key_here
VITE_PARSE_SERVER_URL=your_parse_server_url_here
```
You can find the variables in the report.

### 3. Starting the App 

Start the development server:

```bash
npm run dev
```

Use the following placeholder credentials to log in:

- **Username:** `evan.sup`
- **Password:** `hej`

*Note: Replace with actual Parse/Back4App user credentials from your backend.*



The application will be available at `http://localhost:5173` 
