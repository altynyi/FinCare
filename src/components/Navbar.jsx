function Navbar({ currentPage, onChangePage }) {
  return (
    <nav className="bottom-nav">
      <button
        className={currentPage === 'dashboard' ? 'bottom-nav-item active' : 'bottom-nav-item'}
        onClick={() => onChangePage('dashboard')}
      >
        Главная
      </button>

      <button
        className={currentPage === 'achievements' ? 'bottom-nav-item active' : 'bottom-nav-item'}
        onClick={() => onChangePage('achievements')}
      >
        Достижения
      </button>

      <button
        className={currentPage === 'future' ? 'bottom-nav-item active' : 'bottom-nav-item'}
        onClick={() => onChangePage('future')}
      >
        Цели
      </button>
    </nav>
  );
}

export default Navbar;