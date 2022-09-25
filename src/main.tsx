import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './main.scss';
import { setAppElement } from 'react-modal';

setAppElement('#root');

const root = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(root).render(<App />);
