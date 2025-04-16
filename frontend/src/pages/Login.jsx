import { useState, useContext, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import styles from "../styles/Login.module.css";
import logo from "../assets/logo.png";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginRequest = async (credentials) => {
    const response = await axios.post("/api/auth/login", credentials);
    return response.data;
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      
      // Validação simples do cliente
      if (!formData.email || !formData.password) {
        return setError("Por favor, preencha todos os campos");
      }

      setIsLoading(true);

      try {
        const data = await loginRequest(formData);
        
        // Armazena o token com expiração (1 dia)
        Cookies.set("token", data.token, { expires: 1, secure: true });
        setUser(data.user);
        
        // Redireciona para a página inicial
        navigate("/home", { replace: true });
        
      } catch (err) {
        console.error("Erro no login:", err);
        
        const errorMessage = err.response?.data?.message 
          || err.message 
          || "Erro ao conectar com o servidor";
          
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, setUser, navigate]
  );

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginBox}>
          <div className={styles.loginHeader}>
            <img 
              src={logo} 
              alt="Logo da Capyba" 
              className={styles.logoImage} 
              loading="lazy"
            />
            <h1 className={styles.loginTitle}>CapybAcademy</h1>
          </div>

          <form onSubmit={handleSubmit} className={styles.loginForm} noValidate>
            {error && (
              <div className={styles.errorMessage} role="alert">
                {error}
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.inputLabel}>
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                className={styles.inputField}
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.inputLabel}>
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Digite sua senha"
                className={styles.inputField}
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                autoComplete="current-password"
                minLength={6}
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton} 
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <span className={styles.buttonLoader}></span>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <div className={styles.registerLink}>
            <p>Não tem uma conta?</p>
            <button 
              type="button" 
              className={styles.registerButton} 
              onClick={() => navigate("/register")}
            >
              Cadastre-se
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}