// compatível com versões anteriores
import 'react-app-polyfill/stable'
import 'react-app-polyfill/ie9'
import 'react-app-polyfill/ie11'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';



ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );


