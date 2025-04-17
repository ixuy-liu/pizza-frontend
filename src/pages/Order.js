import React, { useState, useEffect } from 'react';

// function Order() {
//   return (
//     <div>
//       <h2>Order Summary</h2>
//       <p>This page will display the user's selected pizzas and allow them to place the order.</p>
//       <p>Feature to implement: cart items, quantities, total price, and checkout form.</p>
//     </div>
//   );
// }

function Order() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  // Simulate cart from localStorage or a future cart page
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  
    const sum = storedCart.reduce((acc, item) => acc + parseFloat(item.price || 0) * (item.quantity || 1), 0);
    setTotal(sum);
  }, []);
  

  const placeOrder = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5050/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            pizzaId: item._id,
            quantity: item.quantity
          })),
          total
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Order placed successfully!');
        localStorage.removeItem('cart');
        setCart([]);
        setTotal(0);
      } else {
        alert(data.error || 'Order failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error placing order');
    }
  };

  const payNow = async () => {
    const res = await fetch('http://localhost:5050/api/payments/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems: cart })
    });
  
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Failed to initiate payment');
    }
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  
    const newTotal = updatedCart.reduce((acc, item) => acc + parseFloat(item.price || 0) * (item.quantity || 1), 0);
    setTotal(newTotal);
  };
  
  

  return (
    <div>
      <h2>Order Summary</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul className="list-group mb-3">
            {cart.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between">
                <div>
                  <strong>{item.name}</strong> x {item.quantity}
                </div>
                <div className="d-flex align-items-center gap-2">
                <div>${(item.price * item.quantity).toFixed(2)}</div>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </button>
              </div>
              </li>
            ))}
          </ul>
          <h4>Total: ${total.toFixed(2)}</h4>
          <button className="btn btn-success" onClick={placeOrder}>
            Place Order
          </button>
          <button className="btn btn-primary" onClick={payNow}>
            Pay with Card
          </button>
        </div>
      )}
    </div>
  );
}

export default Order;