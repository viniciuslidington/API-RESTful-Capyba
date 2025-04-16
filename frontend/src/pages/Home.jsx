import { useState, useContext } from "react";
import { AuthContext } from "../App";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/Home.module.css";

// Funções auxiliares
const getFirstName = (fullName) => fullName?.split(" ")[0] || "Usuário";
const getInitials = (name) => {
  if (!name) return "US";
  const names = name.split(" ");
  return `${names[0][0]}${names[1]?.[0] || ""}`.toUpperCase();
};

export default function Home() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } finally {
      setUser(null);
      navigate("/", { replace: true });
    }
  };

  return (
    <div className={styles.homeContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.logoText}>CapybAcademy</h2>
          <div className={styles.userContainer}>
            <div className={styles.userAvatar}>
              {getInitials(user?.name)}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{getFirstName(user?.name)}</span>
              <span className={styles.userEmail}>{user?.email}</span>
            </div>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <Link to="/home/perfil" className={styles.navLink}>
            <i className={`${styles.navIcon} fas fa-user`}></i>
            Meu Perfil
          </Link>
          
          <Link to="/home/projetos" className={styles.navLink}>
            <i className={`${styles.navIcon} fas fa-folder`}></i>
            Projetos
          </Link>

          <button 
            onClick={handleLogout}
            className={styles.logoutButton}
            disabled={isLoggingOut}
          >
            <i className={`${styles.navIcon} ${
              isLoggingOut ? "fas fa-spinner fa-spin" : "fas fa-sign-out-alt"
            }`}></i>
            {isLoggingOut ? "Saindo..." : "Sair"}
          </button>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}