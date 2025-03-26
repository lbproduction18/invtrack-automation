
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RegisterFormField } from './RegisterFormField';
import { useRegisterForm } from '@/hooks/useRegisterForm';

export const RegisterForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { formData, errors, loading, setLoading, handleChange, validate } = useRegisterForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);

    try {
      // Simulating registration for demo purposes
      // Will be replaced with Supabase Auth
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now sign in.",
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <RegisterFormField
          id="fullName"
          label="Full Name"
          placeholder="John Doe"
          value={formData.fullName}
          error={errors.fullName}
          onChange={handleChange}
        />
        
        <RegisterFormField
          id="email"
          label="Email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          error={errors.email}
          onChange={handleChange}
        />
        
        <RegisterFormField
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          error={errors.password}
          onChange={handleChange}
        />
        
        <RegisterFormField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          error={errors.confirmPassword}
          onChange={handleChange}
        />
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </form>
  );
};
