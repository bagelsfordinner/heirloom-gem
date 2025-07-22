// src/app/register/page.tsx
'use client'; // This page will have client-side interactivity

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api'; // Import your API client
import styles from './Register.module.scss'; // Create this SCSS module for styling
import { User, Lock, Mail } from 'lucide-react'; // Example icons

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/register', { username, email, password });
      console.log('Registration successful:', response.data);
      // Store JWT token
      localStorage.setItem('heirloom_jwt_token', response.data.token);
      // Redirect to dashboard or login
      router.push('/dashboard'); // Assuming you'll have a dashboard page
    } catch (err: any) {
      console.error('Registration failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.registerBox} soft-box`}>
        <h1 className={styles.title}>Register for Heirloom</h1>
        <p className={styles.subtitle}>Start managing your TTRPG campaigns today!</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <User size={20} className={styles.icon} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <Mail size={20} className={styles.icon} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <Lock size={20} className={styles.icon} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className={styles.loginLink}>
          Already have an account? <span onClick={() => router.push('/login')}>Login here</span>
        </p>
      </div>
    </div>
  );
}