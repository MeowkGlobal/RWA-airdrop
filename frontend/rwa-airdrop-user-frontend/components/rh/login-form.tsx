'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Logging in...');

    try {
      const res = await fetch('/api/rh/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem('rhUserId', data.userId);
        sessionStorage.setItem('loggedIn', 'true');
        setMessage('Login successful! Redirecting...');
        router.push('/');
        // window.location.reload();
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (error) {
      setMessage('An error occurred');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 w-[400px] space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
      </div>
      <div className="space-y-2">
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Login
      </Button>
      {message && (
        <p className="text-center text-sm text-muted-foreground">{message}</p>
      )}
    </form>
  );
}
