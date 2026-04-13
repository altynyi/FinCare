import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import DashboardCards from './components/DashboardCards';
import TransactionForm from './components/TransactionForm';
import Achievements from './components/Achievements';
import FinancePet from './components/FinancePet';
import FuturePage from './components/FuturePage';
import FinanceOverview from './components/FinanceOverview';
import HistoryByDate from './components/HistoryByDate';
import FloatingAddButton from './components/FloatingAddButton';
import RegisterPage from './components/RegisterPage';
import DeleteConfirmModal from './components/DeleteConfirmModal';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [transactions, setTransactions] = useState([]);
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('expense');
  const [showForm, setShowForm] = useState(false);
  const [userName, setUserName] = useState('');
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const fetchTransactions = async () => {
    const res = await axios.get(`${API_URL}/api/transactions`);
    setTransactions(res.data);
  };

  const fetchAIAdvice = async () => {
    const res = await axios.get(`${API_URL}/api/ai/advice`);
    setAiData(res.data);
  };

  const reloadAllData = async () => {
    await fetchTransactions();
    await fetchAIAdvice();
  };

  useEffect(() => {
    const savedName = localStorage.getItem('finance_user_name');
    if (savedName) {
      setUserName(savedName);
    }

    reloadAllData();
  }, []);

  const handleRegister = (name) => {
    localStorage.setItem('finance_user_name', name);
    setUserName(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('finance_user_name');
    setUserName('');
  };

  const handleAddTransaction = async (formData) => {
    setLoading(true);
    await axios.post(`${API_URL}/api/transactions`, formData);
    await reloadAllData();
    setLoading(false);
    setShowForm(false);
  };

  const handleDeleteTransaction = async () => {
  if (!transactionToDelete) return;

  try {
    setLoading(true);
    await axios.delete(`${API_URL}/api/transactions/${transactionToDelete.id}`);
    await reloadAllData();
    setTransactionToDelete(null);
  } catch (error) {
    console.error(error);
    alert('Не удалось удалить транзакцию');
  } finally {
    setLoading(false);
  }
};

  if (!userName) {
    return <RegisterPage onRegister={handleRegister} />;
  }

  return (
    <div className="app mobile-style-app">
      <div className="container mobile-container">
        <Navbar currentPage={currentPage} onChangePage={setCurrentPage} />

        <div className="user-header">
  <h1>
    {currentPage === 'future' && 'Прогноз на будущее'}
    {currentPage === 'achievements' && 'Достижения'}
  </h1>

  {currentPage !== 'future' && (
    <div className="user-box">
      <span>Владелец: {userName}</span>
      <button className="logout-button" onClick={handleLogout}>
        Сменить имя
      </button>
    </div>
  )}
</div>

        {currentPage === 'dashboard' && (
          <>
            <DashboardCards stats={aiData?.stats} />

            <FinanceOverview
              transactions={transactions}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
            />

            <FinancePet
              pet={aiData?.stats?.pet}
              userName={userName}
            />

            {showForm && (
              <TransactionForm onSubmit={handleAddTransaction} loading={loading} />
            )}

            {activeTab !== 'accounts' && (
              <HistoryByDate
  transactions={
    activeTab === 'expense'
      ? transactions.filter((t) => t.type === 'expense')
      : transactions.filter((t) => t.type === 'income')
  }
  onAskDeleteTransaction={setTransactionToDelete}
/>
            )}

            <FloatingAddButton onClick={() => setShowForm((prev) => !prev)} />
          </>
        )}

        {currentPage === 'future' && (
          <FuturePage future={aiData?.stats?.future} />
        )}

        {currentPage === 'achievements' && (
          <Achievements transactions={transactions} stats={aiData?.stats} />
        )}
        <DeleteConfirmModal
  transaction={transactionToDelete}
  onClose={() => setTransactionToDelete(null)}
  onConfirm={handleDeleteTransaction}
/>
      </div>
    </div>
  );
}

export default App;