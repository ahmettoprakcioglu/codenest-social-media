# CodeNest Social Media Platform

<div align="center">
  <h3>A Modern Community Forum & Q&A Platform</h3>

  <p align="center">
    <img src="https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/-TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  </p>
</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Environment Setup](#-environment-setup)

## 🌟 Overview

CodeNest is a modern social media platform built with React and Supabase, featuring real-time interactions, GitHub authentication, and a beautiful UI with glassmorphism effects. The platform allows developers to share knowledge, ask questions, and engage in meaningful discussions within a community-driven environment.

## 🚀 Features

- **Secure Authentication**
  - GitHub OAuth integration
  - Protected routes and user sessions
  - User profile management

- **Real-time Interactions**
  - Live post updates and notifications
  - Dynamic voting system
  - Instant comment updates

- **Rich Content Creation**
  - Markdown support for posts
  - Image upload capabilities
  - Code snippet sharing with syntax highlighting

- **Modern UI/UX**
  - Responsive design for all devices
  - Glassmorphism effects
  - Dark/Light mode support
  - Smooth animations and transitions

## ⚙️ Tech Stack

- **Frontend:**
  - React 18 with TypeScript
  - Vite for fast development
  - TailwindCSS for styling
  - React Query for data fetching

- **Backend:**
  - Supabase for backend services
  - Real-time subscriptions
  - PostgreSQL database
  - Storage for media files

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ahmettoprakcioglu/codenest-social-media
   cd codenest-social-media
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
codenest-social-media/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/        # Page components
│   ├── api/          # API integration
│   ├── hooks/        # Custom React hooks
│   ├── context/      # React context providers
│   └── assets/       # Static assets
├── public/           # Public assets
└── ...config files
```

## 🔧 Environment Setup

1. Create a new project in Supabase
2. Set up the following tables:
   - users
   - posts
   - comments
   - votes
3. Configure authentication providers
4. Set up storage buckets for media
