import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { MedicationProvider } from './context/MedicationContext';
import { ThemeProvider } from './context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <MedicationProvider>
        <App />
      </MedicationProvider>
    </ThemeProvider>
  </React.StrictMode>
);
