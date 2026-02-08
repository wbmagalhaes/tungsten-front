import { Fragment, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';

const isStandalone = window.location === window.parent.location;
const Router = isStandalone ? BrowserRouter : Fragment;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router basename='/'>
      <App />
    </Router>
  </StrictMode>,
);
