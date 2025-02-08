# Task Management Application
This is a simple Task Management application built with Next.js, using Server Actions for CRUD operations and MongoDB for data persistence.

## Features
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Responsive design with a dark theme
- Toast notifications for user feedback

## Tech Stack
- Frontend: Next.js 13 (App Router)
- Backend: Next.js Server Actions
- Database: MongoDB
- Styling: Tailwind CSS and shadcn/ui components
- Deployment: Vercel

## Setup Instructions
1. Clone the repository:
2. Open Termnilnal and cd <application-folder>
3. Run `npm install --legacy-peer-deps` or `npm install --force` to install dependencies
4. Run `npm run dev`

## NextJS Server Action Functions 
- **getTasks()** → Fetch all tasks from the database.
- **createTask(task)** → Insert a new task into the database.
- **updateTask(id, updates)** → Update an existing task.
- **editTask(id, updatedFields)** → Partially update a task.
- **deleteTask(id)** → Delete a task from the database.

