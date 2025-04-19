import React, { useState } from 'react'
import axios from 'axios'

export default function Reviews() {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')

  async function handleclick() {
    await axios.post('http://localhost:3000/reviews', {
      username: name,
      description: desc
    })
  }

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '40px auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        backgroundColor: '#f9f9f9',
      }}
    >
      <input
        type='text'
        placeholder='Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          padding: '10px',
          fontSize: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      <input
        type='text'
        placeholder='Review'
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        style={{
          padding: '10px',
          fontSize: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      />
      <button
        onClick={handleclick}
        style={{
          padding: '10px',
          backgroundColor: '#007bff',
          color: '#fff',
          fontSize: '16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Submit
      </button>
    </div>
  )
}
