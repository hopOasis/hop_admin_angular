HopOasis admin panel

HopOasis - Project for administrators includes a wide range of features such as searching and sorting products, viewing orders, editing reviews, authentication system.

🚀 Core Features

Product Management: Add, edit, and delete products

User Authentication: Secure login with JWT tokens

Order Management: View and manage customer orders

Review Moderation: Approve or reject customer reviews

Dashboard Analytics: Key business metrics overview

🛠️ Tech Stack

Angular 18

TypeScript

Angular Material

REST API Integration

👷‍♀️ Local Setup Instructions

1️⃣ Install Node.js and npm

Recommended version: Node.js 22+

Linux:

sudo apt update && sudo apt install nodejs npm
node -v   # Verify installation

Windows:

winget install OpenJS.NodeJS
node -v

macOS:

brew install node
node -v

2️⃣ Install Angular CLI

npm install -g @angular/cli@18
ng version # Verify installation

3️⃣ Download and install VSCode

Download VSCode

4️⃣ Clone the Repository

cd /your/desired/directory

git clone https://github.com/hopOasis/hop_admin_angular.git
cd hop_admin_angular

5️⃣ Install Dependencies

npm install

6️⃣ Open VSCode & Add Project to Workspace

7️⃣ Request Environment Configuration from PM

Ask the PM for the .env file containing environment variables. Once received:

Create a .env file in the root directory of the project.

Copy and paste the received variables into .env.

Current example:

VITE_API_BASE_URL="https://hopoasis.onrender.com"

8️⃣ Run the Local Server

npm run dev

The frontend will be available at: http://localhost:4200

🔄 Git Workflow Guidelines

📌 Creating a New Branch

A new branch should be created from staging .

The branch name should be descriptive (e.g., auth-p for authentication-related changes).

📝 Commits

Write clear and concise commit messages.

It is recommended to limit commits to 5 per task.

Example:

feat: added product filtering form

🔀 Pull Request (PR)

After completing a task, create a Pull Request.

A PR is considered approved after receiving at least one approval from a colleague.

Approved branches are merged into staging.

✅ Deployment Process

The staging branch is deployed to Render.

Deployment method: TBD (CI/CD or manual process)

To create an optimized production build, run:

npm run build

The build will be saved in the dist/ folder and will be ready for deployment.
