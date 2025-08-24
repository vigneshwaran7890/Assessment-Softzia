
# Book Management System - Frontend

## 🚀 Overview
A modern, responsive web application built with React, TypeScript, and Vite for managing books with a clean, intuitive user interface.

## 🛠 Tech Stack
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Routing**: React Router
- **HTTP Client**: Axios
- **UI Components**: Radix UI Primitives with shadcn/ui

## 📁 Project Structure
```
frontend/
├── public/              # Static assets
├── src/
│   ├── api/             # API service layer
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable UI components
│   │   ├── auth/        # Authentication components
│   │   ├── dashboard/   # Dashboard components
│   │   └── ui/          # Base UI components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Application entry point
├── .env                 # Environment variables
├── package.json         # Project dependencies
└── tsconfig.json        # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation
1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

### Environment Setup
Create a [.env](cci:7://file:///d:/assessment/Assessment-Softzia/backend/.env:0:0-0:0) file in the frontend root directory:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

### Available Scripts
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🌟 Features
- User authentication (login/register)
- Book management (CRUD operations)
- Responsive design
- Form validation
- Toast notifications
- Protected routes
- File uploads

## 🧪 Testing
To run tests:
```bash
npm test
```

## 🚀 Deployment
The application can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Or any static file server

## 📚 Dependencies
- @radix-ui/react-*: Primitive UI components
- @hookform/resolvers: Form validation
- axios: HTTP client
- react-hook-form: Form handling
- react-router-dom: Routing
- tailwindcss: Utility-first CSS framework
- @types/*: TypeScript type definitions

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

