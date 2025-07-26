# Milestonely

This web application allows users to manage tasks and collaborative projects in a structured and organized way. It is designed to be user-friendly and intuitive, streamlining task, teams, and project management.

[Website](https://milestonely.vercel.app/)

## Features

- Create projects.
- Add as many teams as you need to each project, and group participants accordingly.
- Assign tasks to team members and track their progress.
- Post updates and comments on each tasks.
- Customize the application's appearance by toggling between light and dark themes.
- Update your profile information.

## Tech Stack

- Vue.js
- TypeScript
- Tailwind CSS
- Vite
- Node.js (it is required to have Node.js >= 22.0.0 installed)
- Supabase

## Getting Started

To get started with the application, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/nruizcano/milestonely.git
    ```

2. Create a Supabase database using the schema provided in the `schema.sql` file.

3. Create a Supabase storage bucket for user profile pictures, set it to public, and configure the following policies:
    - Give authenticated users read access to all images (SELECT).
    - Give authenticated users write access to their own folder (INSERT, UPDATE, DELETE).

4. Configure environment variables: Copy the `env.default` file, rename it to `.env` and fill in the variables with your own values.

5. Install dependencies:

    ```bash
    npm install
    ```

6. Run the application (in development mode):

    ```bash
    npm run dev
    ```

7. Open your web browser and navigate to `http://localhost:5173`.