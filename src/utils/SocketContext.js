import React, { createContext, useState } from 'react';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [name, setUsername] = useState('');

  const setValue = (newName) => {
    setUsername(newName);
  };

  return (
    <SocketContext.Provider value={{ name, setUsername: setValue }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };