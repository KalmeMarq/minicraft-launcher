import React, { createContext, useState } from 'react';

interface Configuration {
  sortBy: 'last-played' | 'name';
  releases: boolean;
  betas: boolean;
}

const UIStateContext = createContext<{
  minicraftPlus: {
    configurations: Configuration;
  };
  minicraft: {
    configurations: Configuration;
  };
}>({
  minicraftPlus: {
    configurations: {
      sortBy: 'name',
      releases: true,
      betas: true
    }
  },
  minicraft: {
    configurations: {
      sortBy: 'name',
      releases: true,
      betas: true
    }
  }
});

const UIStateProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [minicraftPlusConfig, setMinicraftPlusConfig] = useState<Configuration>({
    sortBy: 'name',
    releases: true,
    betas: true
  });
  const [minicraftConfig, setMinicraftConfig] = useState<Configuration>({
    sortBy: 'name',
    releases: true,
    betas: true
  });

  return (
    <UIStateContext.Provider
      value={{
        minicraft: {
          configurations: minicraftConfig
        },
        minicraftPlus: {
          configurations: minicraftPlusConfig
        }
      }}
    ></UIStateContext.Provider>
  );
};
