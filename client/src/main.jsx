import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Admin from './admin/Admin.jsx';
import './theme.css';

// The static host serves index.html for every path (SPA catch-all), so we pick
// the app by pathname: /admin* → the editor, everything else → the memorial.
const isAdmin = window.location.pathname.replace(/\/+$/, '').startsWith('/admin');

createRoot(document.getElementById('root')).render(
  <StrictMode>{isAdmin ? <Admin /> : <App />}</StrictMode>,
);
