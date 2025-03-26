
import React from 'react';
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { AppLogo } from '@/components/auth/AppLogo';
import { RegisterForm } from '@/components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      
      <div className="w-full max-w-md animate-fade-in">
        <AppLogo />
        
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-xl">Create an Account</CardTitle>
            <CardDescription>
              Sign up to start managing your inventory
            </CardDescription>
          </CardHeader>
          <RegisterForm />
        </Card>
      </div>
    </div>
  );
};

export default Register;
