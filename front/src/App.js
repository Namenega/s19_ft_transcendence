import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import Login from './Login.tsx';
import Home from './Home';

const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (isLoggedIn)
    return (
      <Home />
    )
  else
    return (
      <Login setIsLoggedIn={setIsLoggedIn}/>
    )
}

export default App;
