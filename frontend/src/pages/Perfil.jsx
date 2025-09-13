import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../App";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

// It's better to use Home.module.css for the main layout for consistency,
// and Perfil.module.css for styles specific to the profile content itself.
import homeStyles from "../styles/Home.module.css"; // For homeContainer, mainContent
import styles from "../styles/Perfil.module.css";   // For perfilCard, perfilHeader, etc.
import Sidebar from "../components/Sidebar";
import logo from "../assets/logo.png";

export default function Perfil() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senhaAtual: "",
    novaSenha: "",
    foto: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setIsFetching(true);
      try {
        const { data } = await axios.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        setFormData({
          nome: data.name || "",
          email: data.email || "",
          senhaAtual: "",
          novaSenha: "",
          foto: null,
        });

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } finally {
      setUser(null);
      Cookies.remove("token");
      navigate("/", { replace: true });
      setIsLoggingOut(false);
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
      formDataToSend.append("nome", formData.nome);
      formDataToSend.append("email", formData.email);

      if (formData.novaSenha) {
        if (!formData.senhaAtual) {
          throw new Error("Para alterar a senha, informe a senha atual");
        }
        formDataToSend.append("senhaAtual", formData.senhaAtual);
        formDataToSend.append("novaSenha", formData.novaSenha);
      }

      if (formData.foto) {
        formDataToSend.append("foto", formData.foto);
      }

      const { data } = await axios.put("/api/auth/editaruser", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      setUser(data.user);
      setSuccess("Perfil atualizado com sucesso!");

      setFormData((prev) => ({
        ...prev,
        senhaAtual: "",
        novaSenha: "",
      }));
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError(
        err.response?.data?.message || err.message || "Erro ao atualizar perfil"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Using homeStyles for the outer layout
    <div className={homeStyles.homeContainer}> 
      <Sidebar />
      {/* Using homeStyles for the main content area */}
      <main className={homeStyles.mainContent}> 
        {/* Using Perfil.module.css 'styles' for the content specific to the profile page */}
        <div className={styles.perfilCard}> 
          <header className={styles.perfilHeader}>
            <img
              src={logo}
              alt="Logo da CapybAcademy"
              className={styles.logoImage}
              loading="lazy"
            />
            <h1>Meu Perfil</h1>
            <p>Gerencie suas informações pessoais</p>
          </header>

          <form onSubmit={handleSubmit} className={styles.perfilForm} noValidate>
            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}

            <div className={styles.inputGroup}>
              <label htmlFor="nome">Nome Completo</label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className={styles.passwordSection}>
              <h3>Alterar Senha</h3>
              <div className={styles.inputGroup}>
                <label htmlFor="senhaAtual">Senha Atual</label>
                <input
                  id="senhaAtual"
                  name="senhaAtual"
                  type="password"
                  value={formData.senhaAtual}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="novaSenha">Nova Senha</label>
                <input
                  id="novaSenha"
                  name="novaSenha"
                  type="password"
                  value={formData.novaSenha}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" disabled={isLoading || isLoggingOut}>
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </button>
              <button type="button" onClick={() => navigate(-1)} disabled={isLoading || isLoggingOut}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}