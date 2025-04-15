import { useState, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import styles from '../styles/Login.module.css';
import logo from '../assets/logo.png';

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('/api/auth/login', { email, password });
      Cookies.set('token', res.data.token);
      setUser(res.data.user);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginBox}>
          <div className={styles.loginHeader}>
            <img 
              src={logo} 
              alt="Logo da Empresa" 
              className={styles.logoImage}
            />
            <h1 className={styles.loginTitle}>Nome da Empresa</h1>
          </div>
          
          <form onSubmit={handleLogin} className={styles.loginForm}>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.inputLabel}>
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className={styles.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.inputLabel}>
                Senha
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className={styles.inputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.optionsContainer}>
              <div className={styles.rememberMe}>
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className={styles.rememberCheckbox}
                />
                <label htmlFor="remember-me" className={styles.rememberLabel}>
                  Lembrar de mim
                </label>
              </div>

              <div>
                <a href="#" className={styles.forgotPassword}>
                  Esqueceu sua senha?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
            >
              Entrar
            </button>
          </form>
          
          <div className={styles.loginFooter}>
            <p className={styles.footerText}>
              Não tem uma conta?{' '}
              <a href="#" className={styles.signupLink}>
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}