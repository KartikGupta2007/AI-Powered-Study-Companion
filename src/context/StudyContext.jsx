import React, { createContext, useState } from 'react';

export const StudyContext = createContext();

export const StudyProvider = ({ children }) => {
  const [study, setStudy] = useState({});

  const value = {
    study,
    setStudy,
  };

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  );
};
