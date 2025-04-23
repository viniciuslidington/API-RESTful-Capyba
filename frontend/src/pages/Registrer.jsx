import { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Register.module.css"; // Novo arquivo CSS
import logo from "../assets/logo.png";
import registerImage from "../assets/register-illustration.png"; // Adicione uma imagem ilustrativa

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: null
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      return setError("Por favor, preencha todos os campos obrigatórios");
    }

    if (formData.password !== confirmPassword) {
      return setError("As senhas não coincidem");
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      await axios.post('/api/auth/register', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate("/", { state: { success: "Cadastro realizado com sucesso! Faça login." } });
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setError(err.response?.data?.message || "Erro ao realizar cadastro");
    } finally {
      setIsLoading(false);
    }
  }, [formData, confirmPassword, navigate]);

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerGrid}>
        {/* Seção Ilustrativa */}
        <div className={styles.illustrationSection}>
          <img 
            src={registerImage} 
            alt="Ilustração de cadastro" 
            className={styles.illustration}
          />
          <h2 className={styles.illustrationTitle}>Junte-se à nossa comunidade</h2>
          <p className={styles.illustrationText}>
            Conecte-se com outros estudantes e acelere seu aprendizado
          </p>
        </div>

        {/* Seção do Formulário */}
        <div className={styles.formSection}>
          <div className={styles.formContainer}>
            <img 
              src={logo} 
              alt="Logo da Capyba Academy" 
              className={styles.logoImage} 
            />
            <h1 className={styles.formTitle}>Criar Conta</h1>

            <form onSubmit={handleSubmit} className={styles.registerForm} noValidate>
              {error && (
                <div className={styles.errorMessage} role="alert">
                  {error}
                </div>
              )}

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label htmlFor="name" className={styles.inputLabel}>
                    Nome Completo
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Seu nome completo"
                    className={styles.inputField}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

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
                  />
                </div>
              </div>

              <div className={styles.inputRow}>
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
                    minLength={6}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="confirmPassword" className={styles.inputLabel}>
                    Confirmar Senha
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    className={styles.inputField}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="photo" className={styles.inputLabel}>
                    Foto (Opcional)
                  </label>
                  <label className={styles.fileInput}>
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      disabled={isLoading}
                      style={{ display: 'none' }}
                    />
                    <span className={styles.fileInputText}>
                      {formData.photo ? formData.photo.name : "Selecionar"}
                    </span>
                  </label>
                </div>
              </div>

              {preview && (
                <div className={styles.previewContainer}>
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className={styles.imagePreview} 
                  />
                </div>
              )}

              <button 
                type="submit" 
                className={styles.submitButton} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.buttonLoader}></span>
                    Criando conta...
                  </>
                ) : "Cadastrar"}
              </button>
            </form>

            <div className={styles.loginRedirect}>
              Já tem uma conta?{' '}
              <button 
                type="button" 
                className={styles.loginLink} 
                onClick={() => navigate("/", { state: { success: "Cadastro realizado com sucesso! Faça login." } })}
              >
                Faça login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}