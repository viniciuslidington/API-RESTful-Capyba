import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../App";
import axios from "axios";
import styles from "../styles/Home.module.css";
import Sidebar from "../components/Sidebar";

export default function Projetos() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [orderDirection, setOrderDirection] = useState("desc");
  const [isEmailVerificationLoading, setIsEmailVerificationLoading] = useState(false);
  const pageSize = 5;

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`https://backend-api-restful-capyba-production.up.railway.app/api/items/getprojects`, {
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
      if (err.response?.status === 403) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao carregar os projetos.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerification = async () => {
    setIsEmailVerificationLoading(true);
    try {
      await axios.post('/api/email/enviar-confirmacao-email');
      setError("Email de verificação enviado! Por favor, verifique sua caixa de entrada.");
    } catch {
      setError("Erro ao enviar email de verificação. Tente novamente mais tarde.");
    } finally {
      setIsEmailVerificationLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page, search, orderBy, orderDirection]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
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
      <Sidebar />
      <main className={styles.mainContent}>
        {error && error.includes("Email não verificado") ? (
          <div className={styles.emailVerificationContainer}>
            <div className={styles.emailVerificationCard}>
          <h2>Acesso Restrito</h2>
          <p>{error}</p>
          <button
            onClick={handleEmailVerification}
            disabled={isEmailVerificationLoading}
            className={styles.verificationButton}
          >
            {isEmailVerificationLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Enviando...
              </>
            ) : (
              <>
                <i className="fas fa-envelope"></i>
                Enviar Email de Verificação
              </>
            )}
          </button>
        </div>
      </div>
      ) : (
          <div className={styles.itemsContainer}>
            <div className={styles.itemsHeader}>
              <input
                type="text"
                placeholder="Pesquisar projetos..."
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
              <div className={styles.loading}>
                <i className="fas fa-spinner fa-spin"></i> Carregando...
          </div>
            ) : error && !error.includes("Email não verificado") ? (
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
        )}
      </main>
    </div>
  );
}
