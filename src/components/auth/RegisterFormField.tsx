
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RegisterFormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RegisterFormField: React.FC<RegisterFormFieldProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  error,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required
        value={value}
        onChange={onChange}
        className={error ? "border-destructive" : ""}
      />
      {error && (
        <p className="text-destructive text-xs mt-1">{error}</p>
      )}
    </div>
  );
};
