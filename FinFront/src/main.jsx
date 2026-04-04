import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { CustomThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CustomThemeProvider>
        <CurrencyProvider>
          <App />
        </CurrencyProvider>
      </CustomThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
);
