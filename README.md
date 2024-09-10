# LLM-4-NPC

Project Name
Project Overview
Project Name is a B2B platform designed to enhance game development interactivity by generating NPC dialogues that align with specific IP backgrounds and character settings. The project utilizes Large Language Models (LLM) and Retrieval-Augmented Generation (RAG) technology to generate conversations, support file uploads, vector storage, and custom NPC assistant creation. It provides API integrations for automating dialogue creation within game development workflows.

Environment Setup
Prerequisites
Before starting the project, ensure that the following dependencies are installed on your machine:

Node.js (Recommended v16 or higher)
npm (Comes with Node.js)
Installation Steps
Clone the repository

git clone https://github.com/your-repo/project-name.git
cd project-name
Install dependencies

In the project root directory, run the following command to install all required dependencies:

npm install
Running the Project
Starting the Backend
Navigate to the server directory:

cd server
Run the following command to start the backend:

npm run serve
The backend will start on the default port (e.g., http://localhost:5000).

Starting the Frontend
From the project root, navigate to the client directory:

cd client
Run the following command to start the frontend:

npm run dev
The frontend will start on the default port (e.g., http://localhost:3000).

Project Structure

project-name/
├── client/       # Frontend code
├── server/       # Backend code
├── node_modules/ # npm installed modules
├── package.json  # Project dependencies and scripts
├── README.md     # Project documentation
└── ...


Notes
Ensure that the backend is running before accessing the API endpoints from the frontend.
If there are port conflicts, adjust the frontend or backend port settings as needed.
Troubleshooting
If you encounter issues while starting the project, check the following:

Ensure the Node.js version meets the required version.
npm dependencies are installed correctly. If not, try re-running npm install.
Verify that both the backend and frontend are running and check the terminal for the correct port information.
Contributing
Feel free to submit issues and pull requests to improve the project.

