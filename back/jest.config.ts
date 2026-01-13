import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  // Forçar uso do ts-jest
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: false
    }]
  },
  
  // Arquivos de teste
  testMatch: [
    '**/__tests__/**/*.ts',  
    '**/?(*.)+(spec|test).ts'
  ],
  
  // Módulos
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Ignorar transformação do node_modules
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))'
  ]
};

export default config;