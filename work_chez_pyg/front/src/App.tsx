import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Authentication from './pages/userAccount/authentication';

export default function App() {
  return (<BrowserRouter>
                <Routes>
                  <Route path='/' element={<Authentication />} />
                </Routes>
          </BrowserRouter>);
}

// import './App.css';
// import { useState } from 'react';
// import Login from './Login';
// import Home from './Home';

// const App = () => {

//   const [isLoggedIn, setIsLoggedIn] = useState(false)

//   if (isLoggedIn)
//     return (
//       <Home setIsLoggedIn={setIsLoggedIn}/>
//     )
//   else
//     return (
//       <Login setIsLoggedIn={setIsLoggedIn}/>
//     )
// }

// export default App;
