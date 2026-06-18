# Pinterest Clone

A modern, feature-rich clone of Pinterest built with React, Express, MongoDB, and Tailwind CSS.

## Features

### Frontend
- **Responsive Design**: Built with Tailwind CSS for a seamless experience on desktop, tablet, and mobile devices.
- **Modern UI/UX**: A visually appealing interface inspired by the original Pinterest platform.
- **Routing**: Client-side routing powered by `react-router-dom`.
- **State Management**: Built-in React state management with Context API for simple state.
- **Form Handling**: Efficient form management with `react-hook-form` and validation with `zod`.

### Backend
- **RESTful API**: Clean and organized API endpoints for all core functionalities.
- **Database**: MongoDB for scalable data storage.
- **Authentication**: Secure user authentication and session management.
- **Image Uploads**: Multer integration for handling file uploads.
- **Security**: Helmet for setting HTTP headers and CORS configuration.

## Tech Stack

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Forms**: React Hook Form & Zod
- **Build Tool**: Vite

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Validation**: Zod
- **Middleware**: Multer, Helmet, CORS

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **MongoDB**: Running locally or a MongoDB Atlas connection string

## Installation

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend` directory and add your configuration:
   ```env
   PORT=8080
   MONGODB_URI=mongodb://localhost:27017/pinterest_clone
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the API URL. By default, it points to `http://localhost:8080`. To change it, edit `src/api.ts`.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

Once both the backend and frontend are running:

1. Open your browser and navigate to `http://localhost:5173` (or the port your frontend is running on).
2. Sign up or log in to access the Pinterest feed.
3. Explore the features: create pins, browse feeds, and interact with posts.

## License

ISC