import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Pagination, 
  Box, 
  CircularProgress,
  Avatar,
  TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
      );
      setCoins(data);
    } catch (error) {
      console.error('Error fetching coins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mt: 4 }}>
          Cryptocurrency Prices by Market Cap
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom align="center">
          Track the latest trends of the top cryptocurrencies globally
        </Typography>
        <TextField 
          label="Search For a Crypto Currency..." 
          variant="outlined" 
          sx={{ mb: 4, mt: 3, width: { xs: '100%', sm: '60%' } }} 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <Table sx={{ minWidth: 650 }} aria-label="crypto table">
            <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Coin</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>24h Change</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Market Cap</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {handleSearch()
                .slice((page - 1) * 10, (page - 1) * 10 + 10)
                .map((row) => {
                  const profit = row.price_change_percentage_24h > 0;
                  return (
                    <TableRow
                      key={row.name}
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.08)'
                        }
                      }}
                      onClick={() => navigate(`/coin/${row.id}`)}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={row.image} alt={row.name} sx={{ width: 40, height: 40 }} />
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                              {row.symbol}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {row.name}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        ${row.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell 
                        align="right" 
                        sx={{ color: profit ? '#00e676' : '#ff1744', fontWeight: 500 }}
                      >
                        {profit && '+'}{row.price_change_percentage_24h?.toFixed(2)}%
                      </TableCell>
                      <TableCell align="right">
                        ${row.market_cap.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {!loading && handleSearch().length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 6 }}>
          <Pagination 
            count={Math.ceil(handleSearch().length / 10)} 
            color="primary" 
            page={page}
            onChange={(_, value) => {
              setPage(value);
              window.scroll(0, 450);
            }} 
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default Home;
