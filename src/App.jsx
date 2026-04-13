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
import DailyLimitCalculator from './components/DailyLimitCalculator';
import TransactionModal from './components/TransactionModal';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [transactions, setTransactions] = useState([]);
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
const [activeTab, setActiveTab] = useState('accounts');  const [showForm, setShowForm] = useState(false);
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

  const idToDelete = transactionToDelete.id;

  setTransactionToDelete(null);

  const previousTransactions = transactions;
  const updatedTransactions = transactions.filter((tx) => tx.id !== idToDelete);

  setTransactions(updatedTransactions);

  try {
    await axios.delete(`${API_URL}/api/transactions/${idToDelete}`);
    fetchAIAdvice();
  } catch (error) {
    console.error(error);
    setTransactions(previousTransactions);
    alert('Не удалось удалить транзакцию');
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
    {currentPage === 'future' && 'Мои хотелки'}
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
    {activeTab === 'accounts' && (
  <>
    <DashboardCards stats={aiData?.stats} />

    <DailyLimitCalculator balance={aiData?.stats?.balance ?? 0} />

    <FinancePet
      pet={aiData?.stats?.pet}
      userName={userName}
    />
  </>
)}

    <FinanceOverview
      transactions={transactions}
      activeTab={activeTab}
      onChangeTab={setActiveTab}
    />

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

<FloatingAddButton onClick={() => setShowForm(true)} />  </>
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
      <TransactionModal
  isOpen={showForm}
  onClose={() => setShowForm(false)}
>
  <TransactionForm
    onSubmit={async (data) => {
      await handleAddTransaction(data);
      setShowForm(false);
    }}
    loading={loading}
  />
</TransactionModal>
    </div>
  );
}

export default App;