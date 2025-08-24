// pages/Signup.tsx
import React from 'react';
import SignupForm from '@/components/auth/SignupForm';
import ThemeToggle from "@/components/ThemeToggle";

const Signup: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      <SignupForm />
    </div>
  );
};

export default Signup;