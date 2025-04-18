import React, { useEffect, useState } from 'react';

// ✅ Place this here, outside the component
const localPizzas = [
  {
    _id: 'local-1',
    name: 'Margherita',
    description: 'Classic delight with mozzarella and basil.',
    price: 9.99,
    image: '/images/margherita.jpg'
  },
  {
    _id: 'local-2',
    name: 'Pepperoni',
    description: 'Topped with spicy pepperoni slices.',
    price: 11.49,
    image: '/images/pepperoni.jpg'
  },
  {
    _id: 'local-3',
    name: 'BBQ Chicken',
    description: 'Sweet BBQ sauce and grilled chicken.',
    price: 12.99,
    image: '/images/bbq-chicken.jpg'
  },
  {
    _id: 'local-4',
    name: 'Veggie',
    description: 'Bell peppers, olives, onions, and mushrooms.',
    price: 10.99,
    image: '/images/veggie.jpg'
  },
  {
    _id: 'local-5',
    name: 'Hawaiian',
    description: 'Ham and pineapple on cheese.',
    price: 11.99,
    image: '/images/hawaiian.jpg'
  },
  {
    _id: 'local-6',
    name: 'Meat Lovers',
    description: 'Sausage, bacon, pepperoni, and beef.',
    price: 13.49,
    image: '/images/meatlovers.jpg'
  }
];

function Menu() {
  const [pizzaData, setPizzaData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5050/api/pizzas')
      .then(res => res.json())
      .then(data => {
        setPizzaData(data); // ✅ only show backend pizzas
      })
      .catch(err => {
        console.error('Failed to load pizzas from backend:', err);
        setPizzaData(localPizzas); // 👈 fallback to local only
      });
  }, []);

  const addToCart = (pizza) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item._id === pizza._id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...pizza, price: parseFloat(pizza.price), quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${pizza.name} added to cart!`);
  };

  return (
    <div>
      <h2 className="mb-4">Our Menu</h2>
      <div className="row">
        {pizzaData.map((pizza, index) => (
          <div className="col-md-4" key={index}>
            <div className="card mb-4">
              <img
                src={pizza.image.startsWith('/images') ? pizza.image : `http://localhost:5050${pizza.image}`}
                className="card-img-top"
                alt={pizza.name}
              />
              <div className="card-body">
                <h5 className="card-title">{pizza.name}</h5>
                <p className="card-text">{pizza.description}</p>
                <p className="card-text fw-bold">${pizza.price}</p>
                <button className="btn btn-primary" onClick={() => addToCart(pizza)}>
                  Add to Order
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
