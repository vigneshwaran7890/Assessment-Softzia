// pages/Login.tsx
import React from 'react';
import LoginForm from "@/components/auth/LoginForm";
import ThemeToggle from "@/components/ThemeToggle";

const Login: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      <LoginForm />
    </div>
  );
};

export default Login;