import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Coin from './pages/Coin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Box } from '@mui/material';

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/coin/:coinId" element={<Coin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
