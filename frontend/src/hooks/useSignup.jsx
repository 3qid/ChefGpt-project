import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, extraFields = {}) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch('/api/user/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, ...extraFields }),
    });

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      
      // التعديل هنا:
      // بما أن السيرفر يرسل { errors: { email: '...', password: '...' } }
      // سنقوم بعرض أول خطأ متاح (إما الإيميل أو الباسورد)
      if (json.errors) {
        setError(json.errors.email || json.errors.password);
      } else {
        setError("Something went wrong");
      }
    }

    if (response.ok) {
      // حفظ المستخدم في الـ Local Storage
      localStorage.setItem('user', JSON.stringify(json));

      // تحديث الـ Auth Context
      dispatch({ type: 'LOGIN', payload: json });

      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};