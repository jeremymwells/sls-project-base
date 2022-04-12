import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"; 
import { useEffect } from 'react';

import { config } from './config';
import WelcomingPage from "./pages/WelcomingPage";

import './App.scss';

function App(_props: any) {

  useEffect(() => { });

  return (
    <>
    <span data-testid="author" className="author">Jeremy Wells</span>
    <BrowserRouter basename={config.baseHref}>
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />
        <Route path="/welcome" element={ < WelcomingPage /> } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
