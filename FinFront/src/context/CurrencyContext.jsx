import React, { createContext, useState, useEffect } from 'react';

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || '$';
  });

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  const currencyOptions = [
    { label: 'USD ($)', symbol: '$' },
    { label: 'INR (₹)', symbol: '₹' },
    { label: 'EUR (€)', symbol: '€' },
    { label: 'GBP (£)', symbol: '£' },
    { label: 'JPY (¥)', symbol: '¥' },
  ];

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, currencyOptions }}>
      {children}
    </CurrencyContext.Provider>
  );
};
