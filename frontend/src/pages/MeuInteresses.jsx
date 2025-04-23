import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../App";
import axios from "axios";
import styles from "../styles/Home.module.css";
import Sidebar from "../components/Sidebar";

export default function MeuInteresses() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEmailVerificationLoading, setIsEmailVerificationLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`/api/interesse/interesses`);
      setItems(response.data.itens);
    } catch (err) {
      if (err.response?.status === 403) {
        setError(err.response.data.message);
      } else {
        setError("Erro ao carregar seus interesses.");
      }
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
  }, []);

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
              <h2>Meus Interesses</h2>
            </div>

            {loading ? (
              <div className={styles.loading}>
                <i className="fas fa-spinner fa-spin"></i> Carregando...
              </div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
            ) : (
              <div className={styles.itemsList}>
                {items.length === 0 ? (
                  <div className={styles.noItems}>
                    Você ainda não possui interesses marcados.
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className={styles.itemCard}>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <div className={styles.itemFooter}>
                        <span className={styles.itemType}>{item.type}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}