import React, { createContext, useState, useContext } from 'react';

// Tạo Context
export const DarkModeContext = createContext();

// Tạo Provider
export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Hàm toggle để chuyển đổi chế độ tối
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Tạo hook useDarkMode
export const useDarkMode = () => {
  return useContext(DarkModeContext);
};
