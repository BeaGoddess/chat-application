import React from 'react';
import { Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import './index.css';
import Profile from './components/Perfil/setProfile';
import Room from './components/Room/chat';
import reportWebVitals from './reportWebVitals';
import { SocketProvider } from './utils/SocketContext';

export default function App() {
  return (
    <Routes>
      <SocketProvider>
          <Route path="/" exact component={<Profile />} />
          <Route path="/room" component={<Room />} />
      </SocketProvider>

    </Routes>

  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
