// src/app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import styles from './Login.module.scss'; // Create this SCSS module for styling
import { User, Lock } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      console.log('Login successful:', response.data);
      // Store JWT token
      localStorage.setItem('heirloom_jwt_token', response.data.token);
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.loginBox} soft-box`}>
        <h1 className={styles.title}>Login to Heirloom</h1>
        <p className={styles.subtitle}>Access your TTRPG campaigns.</p>
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
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
        <p className={styles.registerLink}>
          Don't have an account? <span onClick={() => router.push('/register')}>Register here</span>
        </p>
      </div>
    </div>
  );
}