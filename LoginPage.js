import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const LoginPage = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [items, setItems] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://nodejs.sulla.hu/data');
      const jsonData = await response.json();
      setItems(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin') {
      setLoggedIn(true);
    } else {
      alert('Rossz felhasználónév vagy jelszó!');
    }
  };

  const fetchItemById = async (id) => {
    try {
      const response = await fetch(`https://nodejs.sulla.hu/data/${id}`);
      const jsonData = await response.json();
      setSearchResult(jsonData);
    } catch (error) {
      console.error('Error fetching item data:', error);
      setSearchResult(null);
    }
  };

  const handleSearch = () => {
    fetchItemById(searchId);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <ul className="navbar-nav mr-auto d-flex">
          <li className="nav-item">
            <NavLink to="/" exact activeClassName="active" className="nav-link">Szállások</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/search" activeClassName="active" className="nav-link">Keresés</NavLink>
          </li>
        </ul>
      </nav>
      <h1>Bejelentkezés</h1>
      <form>
        <label>Felhasználónév:</label>
        <input type="text" value={username} onChange={handleUsernameChange} />
        <br />
        <label>Jelszó:</label>
        <input type="password" value={password} onChange={handlePasswordChange} />
        <br />
        <button type="button" onClick={handleLogin}>Bejelentkezés</button>
      </form>
      <div>
        <h2>Keresés</h2>
        <label>Azonosító:</label>
        <input type="number" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
        <button type="button" onClick={handleSearch}>Keresés</button>
        {searchResult && (
          <div className="card">
            <h2>{searchResult.name}</h2>
            <p>Azonosító: {searchResult.id}</p>
            <p>Név: {searchResult.hostname}</p>
            <p>Hely: {searchResult.location}</p>
            <p>Ár: {searchResult.price} $</p>
            <p>Minimum Éjszaka: {searchResult.minimum_nights}</p>
          </div>
        )}
      </div>
      <div className="card-container">
        {items.map(item => (
          <div className="card" key={item.id}>
            <h2>{item.name}</h2>
            <p>Azonosító: {item.id}</p>
            <p>Név: {item.hostname}</p>
            <p>Hely: {item.location}</p>
            <p>Ár: {item.price} $</p>
            <p>Minimum Éjszaka: {item.minimum_nights}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoginPage;