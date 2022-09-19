import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Authentication from './pages/login/authentication';

export default function App() {
  return (<Routes>
            <Route path='/' element={<Authentication />} />
        </Routes>
);
}
