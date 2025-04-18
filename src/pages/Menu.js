// src/pages/Menu.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Pagination,
  useTheme,
} from '@mui/material';

// Local fallback pizzas
const localPizzas = [
  { _id: 'local-1', name: 'Margherita', description: 'Mozzarella, tomato, basil.', price: 9.99, image: '/images/margherita.jpg' },
  { _id: 'local-2', name: 'Pepperoni', description: 'Spicy pepperoni slices.', price: 11.49, image: '/images/pepperoni.jpg' },
  { _id: 'local-3', name: 'BBQ Chicken', description: 'Sweet BBQ sauce & grilled chicken.', price: 12.99, image: '/images/bbq-chicken.jpg' },
  { _id: 'local-4', name: 'Veggie', description: 'Bell peppers, olives, onions, mushrooms.', price: 10.99, image: '/images/veggie.jpg' },
  { _id: 'local-5', name: 'Hawaiian', description: 'Ham & pineapple on cheese.', price: 11.99, image: '/images/hawaiian.jpg' },
  { _id: 'local-6', name: 'Meat Lovers', description: 'Sausage, bacon, pepperoni, beef.', price: 13.49, image: '/images/meatlovers.jpg' },
];

export default function Menu() {
  const theme = useTheme();
  const [pizzaData, setPizzaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('lowToHigh');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(1);

  const perPage = 6;

  useEffect(() => {
    fetch('http://localhost:5050/api/pizzas')
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(data => setPizzaData([...localPizzas, ...data]))
      .catch(err => {
        console.error(err);
        setError('Could not load online menu – showing local items only.');
        setPizzaData(localPizzas);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (pizza) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item._id === pizza._id);
    if (existing) existing.quantity++;
    else cart.push({ ...pizza, price: Number(pizza.price), quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    setSnackbar({ open: true, message: `${pizza.name} added to cart!`, severity: 'success' });
  };

  const handleCloseSnackbar = () => setSnackbar(s => ({ ...s, open: false }));

  // Filter & sort
  const filtered = pizzaData.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sorted = filtered.sort((a, b) =>
    sortOrder === 'lowToHigh' ? a.price - b.price : b.price - a.price
  );

  // Pagination
  const pageCount = Math.ceil(sorted.length / perPage);
  const paged = sorted.slice((page - 1) * perPage, page * perPage);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4, backgroundColor: theme.palette.background.default }}>
      <Typography variant="h4" gutterBottom>Our Menu</Typography>
      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Search & Sort Controls */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          label="Search pizzas"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
        />
        <FormControl variant="outlined" size="small">
          <InputLabel id="sort-label">Sort by</InputLabel>
          <Select
            labelId="sort-label"
            label="Sort by"
            value={sortOrder}
            onChange={e => { setSortOrder(e.target.value); setPage(1); }}
          >
            <MenuItem value="lowToHigh">Price: Low → High</MenuItem>
            <MenuItem value="highToLow">Price: High → Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Pizza Grid */}
      <Grid container spacing={4}>
        {paged.map(pizza => (
          <Grid item key={pizza._id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 6,
                },
              }}
            >
              <Box
                sx={{
                  height: 200,
                  backgroundImage: `url(${
                    pizza.image.startsWith('/images')
                      ? pizza.image
                      : `http://localhost:5050${pizza.image}`
                  })`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>{pizza.name}</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {pizza.description}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  ${pizza.price.toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button fullWidth variant="contained" onClick={() => handleAddToCart(pizza)}>
                  Add to Order
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination controls */}
      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
          />
        </Box>
      )}

      {/* Snackbar feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
