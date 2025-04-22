import { useState, useContext, useEffect } from "react";
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
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [orderDirection, setOrderDirection] = useState("desc");
  const pageSize = 5;

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`/api/items/getlist`, {
        params: {
          page,
          pageSize,
          search,
          orderBy,
          orderDirection,
        },
      });
      setItems(response.data.items);
      setTotalPages(Math.ceil(response.data.total / pageSize));
    } catch (err) {
      setError("Erro ao carregar os itens.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page, search, orderBy, orderDirection]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } finally {
      setUser(null);
      navigate("/", { replace: true });
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when searching
  };

  const handleSort = (field) => {
    if (orderBy === field) {
      setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(field);
      setOrderDirection('asc');
    }
    setPage(1);
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
        <div className={styles.itemsContainer}>
          <div className={styles.itemsHeader}>
            <input
              type="text"
              placeholder="Pesquisar itens..."
              value={search}
              onChange={handleSearch}
              className={styles.searchInput}
            />
            <div className={styles.sortButtons}>
              <button onClick={() => handleSort('title')}>
                Título {orderBy === 'title' && (orderDirection === 'asc' ? '↑' : '↓')}
              </button>
              <button onClick={() => handleSort('createdAt')}>
                Data {orderBy === 'createdAt' && (orderDirection === 'asc' ? '↑' : '↓')}
              </button>
    </div>
          </div>

          {loading ? (
            <div className={styles.loading}>Carregando...</div>
          ) : error ? (
            <div className={styles.error}>{error}</div>
          ) : (
            <>
              <div className={styles.itemsList}>
                {items.map((item) => (
                  <div key={item.id} className={styles.itemCard}>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className={styles.itemType}>{item.type}</span>
                  </div>
                ))}
              </div>

              <div className={styles.pagination}>
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className={`${styles.pageButton} ${styles.firstPage}`}
                  title="Primeira página"
                >
                  <i className="fas fa-chevron-double-left"></i>
                </button>
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className={`${styles.pageButton} ${styles.prevPage}`}
                  title="Página anterior"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <div className={styles.pageInfo}>
                  Página {page} de {totalPages}
                </div>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className={`${styles.pageButton} ${styles.nextPage}`}
                  title="Próxima página"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className={`${styles.pageButton} ${styles.lastPage}`}
                  title="Última página"
                >
                  <i className="fas fa-chevron-double-right"></i>
                </button>
    </div>
            </>
          )}
        </div>
        <Outlet />
      </main>
    </div>
  );
}