import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../App";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css";
import logo from "../assets/logo.png";

export default function Perfil() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senhaAtual: "",
    novaSenha: "",
    foto: null
  });

  // Preenche os dados do usuário ao carregar
  useEffect(() => {
    const fetchUserData = async () => {
      setIsFetching(true);
      try {
        const { data } = await axios.get('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        });

        // Preenche os campos com os dados do usuário
        setFormData({
          nome: data.name || "",
          email: data.email || "",
          senhaAtual: "",
          novaSenha: "",
          foto: null
        });

        // Define o preview da foto, se existir
        setPreview(data.fotoUrl || "");
      } catch (err) {
        console.error("Erro ao buscar informações do usuário:", err);
        setError("Não foi possível carregar as informações do usuário.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, foto: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.nome || !formData.email) {
      return setError("Nome e e-mail são obrigatórios");
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nome', formData.nome);
      formDataToSend.append('email', formData.email);
      
      if (formData.novaSenha) {
        if (!formData.senhaAtual) {
          throw new Error("Para alterar a senha, informe a senha atual");
        }
        formDataToSend.append('senhaAtual', formData.senhaAtual);
        formDataToSend.append('novaSenha', formData.novaSenha);
      }
      
      if (formData.foto) {
        formDataToSend.append('foto', formData.foto);
      }

      const { data } = await axios.put('/api/auth/editaruser', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });

      // Atualiza o contexto do usuário
      setUser(data.user);
      setSuccess("Perfil atualizado com sucesso!");
      
      // Limpa os campos de senha após sucesso
      setFormData(prev => ({
        ...prev,
        senhaAtual: "",
        novaSenha: ""
      }));
      
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError(err.response?.data?.message || err.message || "Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className={styles.loadingContainer}>
        <p>Carregando informações...</p>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginBox}>
          <div className={styles.loginHeader}>
            <img 
              src={logo} 
              alt="Logo da CapybAcademy" 
              className={styles.logoImage} 
              loading="lazy"
            />
            <h1 className={styles.loginTitle}>Meu Perfil</h1>
            <p className={styles.loginSubtitle}>Gerencie suas informações pessoais</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.loginForm} noValidate>
            {error && (
              <div className={styles.errorMessage} role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className={styles.successMessage} role="alert">
                {success}
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="nome" className={styles.inputLabel}>
                Nome Completo
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
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
                className={styles.inputField}
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                Foto de Perfil
              </label>
              <div className={styles.photoContainer}>
                {preview && (
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className={styles.photoPreview} 
                  />
                )}
                <label className={styles.fileInputLabel}>
                  {preview ? "Alterar Foto" : "Adicionar Foto"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    disabled={isLoading}
                    className={styles.fileInput}
                  />
                </label>
              </div>
            </div>

            <div className={styles.passwordSection}>
              <h3 className={styles.sectionTitle}>Alterar Senha</h3>
              
              <div className={styles.inputGroup}>
                <label htmlFor="senhaAtual" className={styles.inputLabel}>
                  Senha Atual
                </label>
                <input
                  id="senhaAtual"
                  name="senhaAtual"
                  type="password"
                  placeholder="••••••••"
                  className={styles.inputField}
                  value={formData.senhaAtual}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="novaSenha" className={styles.inputLabel}>
                  Nova Senha
                </label>
                <input
                  id="novaSenha"
                  name="novaSenha"
                  type="password"
                  placeholder="••••••••"
                  className={styles.inputField}
                  value={formData.novaSenha}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <p className={styles.passwordHint}>
                  Deixe em branco para manter a senha atual
                </p>
              </div>
            </div>

            <div className={styles.formActions}>
              <button 
                type="submit" 
                className={styles.submitButton} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className={styles.buttonLoader}></span>
                    Salvando...
                  </>
                ) : "Salvar Alterações"}
              </button>
              
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}