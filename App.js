import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, NavLink, Routes, Route, Redirect } from 'react-router-dom';
import './App.css';
import LoginPage from './LoginPage';

const Card = ({ id, name, hostname, location, price, minimum_nights }) => {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Azonosító: {id}</p>
      <p>Név: {hostname}</p>
      <p>Hely: {location}</p>
      <p>Ár: {price} $</p>
      <p>Minimum Éjszaka: {minimum_nights}</p>
    </div>
  );
};

const AddItem = ({ addItem }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    hostname: '',
    location: '',
    price: '',
    minimum_nights: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addItem(formData);
  };

  return (
    <div>
      <h1>Hozzáadás</h1>
      <form onSubmit={handleSubmit}>
        <label>ID:</label>
        <input type="number" name="id" value={formData.id} onChange={handleChange} />
        <br />
        <label>Név:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
        <br />
        <label>Hostname:</label>
        <input type="text" name="hostname" value={formData.hostname} onChange={handleChange} />
        <br />
        <label>Hely:</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} />
        <br />
        <label>Ár:</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} />
        <br />
        <label>Minimum Éjszaka:</label>
        <input type="number" name="minimum_nights" value={formData.minimum_nights} onChange={handleChange} />
        <br />
        <button type="submit">Hozzáadás</button>
      </form>
    </div>
  );
};

const SearchItem = () => {
  const [id, setId] = useState('');
  const [itemData, setItemData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://nodejs.sulla.hu/data/${id}`);
      if (response.ok) {
        const jsonData = await response.json();
        setItemData(jsonData);
        setError(null);
      } else {
        setError('A keresett szállás nem található.');
        setItemData(null);
      }
    } catch (error) {
      console.error('Error fetching item data:', error);
      setError('Error fetching item data');
      setItemData(null);
    }
  };

  return (
    <div>
      <h1>Keresés</h1>
      <label>ID:</label>
      <input type="number" value={id} onChange={(e) => setId(e.target.value)} />
      <button onClick={handleSearch}>Keresés</button>

      {error && <p>{error}</p>}

      {itemData && (
        <div className="card">
          <h2>{itemData.name}</h2>
          <p>Azonosító: {itemData.id}</p>
          <p>Név: {itemData.hostname}</p>
          <p>Hely: {itemData.location}</p>
          <p>Ár: {itemData.price} $</p>
          <p>Minimum Éjszaka: {itemData.minimum_nights}</p>
        </div>
      )}
    </div>
  );
};

const EditItem = ({ updateItem }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    hostname: '',
    location: '',
    price: '',
    minimum_nights: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateItem(formData);
  };

  return (
    <div>
      <h1>Módosítás</h1>
      <form onSubmit={handleSubmit}>
        <label>ID:</label>
        <input type="number" name="id" value={formData.id} onChange={handleChange} />
        <br />
        <label>Név:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
        <br />
        <label>Hosztnév:</label>
        <input type="text" name="hostname" value={formData.hostname} onChange={handleChange} />
        <br />
        <label>Hely:</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} />
        <br />
        <label>Ár:</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} />
        <br />
        <label>Minimum Éjszaka:</label>
        <input type="number" name="minimum_nights" value={formData.minimum_nights} onChange={handleChange} />
        <br />
        <button type="submit">Módosítás</button>
      </form>
    </div>
  );
};

const DeleteItem = ({ deleteItem }) => {
  const [id, setId] = useState('');

  const handleDelete = () => {
    deleteItem(id);
  };

  return (
    <div>
      <h1>Törlés</h1>
      <label>ID:</label>
      <input type="number" value={id} onChange={(e) => setId(e.target.value)} />
      <button onClick={handleDelete}>Törlés</button>
    </div>
  );
};

function App() {
  const [data, setData] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://nodejs.sulla.hu/data');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addItem = async (formData) => {
    try {
      const response = await fetch('https://nodejs.sulla.hu/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Item added successfully');
        fetchData();
      } else {
        console.error('Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const updateItem = async (formData) => {
    try {
      const response = await fetch(`https://nodejs.sulla.hu/data/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Item updated successfully');
        fetchData();
      } else {
        console.error('Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`https://nodejs.sulla.hu/data/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        console.log('Item deleted successfully');
        fetchData();
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <Router>
      <div>
        {loggedIn ? (
          <>
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
              <NavLink to="/" exact activeClassName="active">Szállások</NavLink>
              <NavLink to="/search" activeClassName="active">Keresés</NavLink>
              <NavLink to="/add" activeClassName="active">Hozzáadás</NavLink>
              <NavLink to="/edit" activeClassName="active">Módosítás</NavLink>
              <NavLink to="/delete" activeClassName="active">Törlés</NavLink>
              <button onClick={handleLogout}>Kijelentkezés</button>
            </nav>

            <Routes>
              <Route path="/" element={<h1>Szállások</h1>} />
              <Route path="/search" element={<SearchItem />} />
              <Route path="/add" element={<AddItem addItem={addItem} />} />
              <Route path="/edit" element={<EditItem updateItem={updateItem} />} />
              <Route path="/delete" element={<DeleteItem deleteItem={deleteItem} />} />
            </Routes>

            {data && data.map((item) => (
              <Card
                key={item.id}
                id={item.id}
                name={item.name}
                hostname={item.hostname}
                location={item.location}
                price={item.price}
                minimum_nights={item.minimum_nights}
              />
            ))}
          </>
        ) : (
          <LoginPage setLoggedIn={setLoggedIn} />
        )}
      </div>
    </Router>
  );
}

export default App;