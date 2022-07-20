import React from 'react';
import ReactDOM from 'react-dom/client';
// import TKD from './TKD';
import './index.css';
import App from './componts/App';
import ChatState from "./componts/context/ChatState";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChatState>
      <App />
    </ChatState>
  </React.StrictMode>
);
