import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddPizza() {

  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userType');
    if (!role || role !== 'admin') {
      alert('You must be an admin to access this page.');
      navigate('/');
    }
  }, [navigate]);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });
  const [file, setFile] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert('No image selected');
    const data = new FormData();
    data.append('image', file);

    const res = await fetch('http://localhost:5050/api/upload', {
      method: 'POST',
      body: data
    });

    const result = await res.json();  
    setForm(prev => ({ ...prev, image: result.imageUrl }));
    alert('Image uploaded!');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // from login

    const res = await fetch('http://localhost:5050/api/pizzas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    const result = await res.json();
    if (res.ok) {
      alert('Pizza created!');
      setForm({ name: '', description: '', price: '', image: '' });
      setFile(null);
    } else {
      alert(result.error || 'Failed to create pizza');
    }
  };

  return (
    <div>
      <h2>Add New Pizza</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
        <input type="file" onChange={handleFileChange} />
        <button type="button" onClick={handleUpload}>Upload Image</button>
        <br />
        {form.image && <img src={`http://localhost:5050${form.image}`} alt="Preview" width={150} />}
        <br />
        <button type="submit">Add Pizza</button>
      </form>
    </div>
  );
}

export default AddPizza;
