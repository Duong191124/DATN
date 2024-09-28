// src/App.jsx
import React, { useContext } from 'react';
import { DarkModeContext } from './DarkModeContext'; // Import Context

const sunIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.343 17.657l-1.414 1.414M18.364 17.657l-1.414-1.414M6.343 6.343l-1.414-1.414M12 7a5 5 0 100 10 5 5 0 000-10z" />
  </svg>
);

const moonIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 118.646 3.646a9.003 9.003 0 0011.708 11.708z" />
  </svg>
);

const App = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? 'dark-mode' : 'light-mode'}>
      <header>
        <h1>My Website</h1>
        <button onClick={toggleDarkMode} style={{ fontSize: '24px', padding: '10px', cursor: 'pointer' }}>
          {darkMode ? sunIcon : moonIcon}
        </button>
      </header>

      <main>
        <h2>Welcome to My Website</h2>
        <p>This is an example of how to implement dark mode in React with an icon.</p>
      </main>

      <footer>
        <p>&copy; 2024 My Website. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
