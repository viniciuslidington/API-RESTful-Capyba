import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import axios from "axios";
import styles from "../styles/Home.module.css";

const getFirstName = (fullName) => fullName?.split(" ")[0] || "Usuário";
const getInitials = (name) => {
  if (!name) return "US";
  const names = name.split(" ");
  return `${names[0][0]}${names[1]?.[0] || ""}`.toUpperCase();
};

export default function Sidebar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isHome = location.pathname === '/home';
  const isPerfil = location.pathname === '/home/perfil';
  const isProjetos = location.pathname === '/home/projetos';

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post('https://backend-api-restful-capyba-production.up.railway.app/api/auth/logout', {}, { withCredentials: true });
    } finally {
      setUser(null);
      navigate("/", { replace: true });
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.logoText}>Capyba Academy</h2>
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
        <Link 
          to="/home" 
          className={`${styles.navLink} ${isHome ? styles.navLinkActive : ''}`}
        >
          <i className={`${styles.navIcon} fas fa-book`}></i>
          Cursos e Artigos
        </Link>

        <Link 
          to="/home/projetos" 
          className={`${styles.navLink} ${isProjetos ? styles.navLinkActive : ''}`}
        >
          <i className={`${styles.navIcon} fas fa-folder`}></i>
          Projetos
        </Link>

        <Link
          to="/home/interesses" 
          className={styles.navLink} 
        >
          <i className={`${styles.navIcon} fas fa-heart`}></i>
          Meus Interesses
        </Link>

        <Link 
          to="/home/perfil" 
          className={`${styles.navLink} ${isPerfil ? styles.navLinkActive : ''}`}
        >
          <i className={`${styles.navIcon} fas fa-user`}></i>
          Meu Perfil
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
  );
}