import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './store/index.js'
window.addEventListener('error', (event) => {
  if (event.message.includes('Failed to execute \'removeChild\'') && event.filename.includes('react-dom')) {
    event.preventDefault();
    console.warn('Ignoring extension-induced DOM error');
  }
});
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Provider store={store}>
      <App />
      </Provider>
    
    </Router>
    
  </StrictMode>,
)
