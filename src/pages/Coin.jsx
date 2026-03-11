import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Grid
} from '@mui/material';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Coin = () => {
  const { coinId } = useParams();
  const [coin, setCoin] = useState(null);
  const [historicData, setHistoricData] = useState([]);
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`);
        setCoin(data);
      } catch (error) {
        console.error('Error fetching coin data:', error);
      }
    };
    fetchCoin();
  }, [coinId]);

  useEffect(() => {
    const fetchHistoricData = async () => {
      if (!coinId) return;
      setLoading(true);
      try {
        const { data } = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
        );
        setHistoricData(data.prices);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistoricData();
  }, [coinId, days]);

  const handleDaysChange = (event, newDays) => {
    if (newDays !== null) {
      setDays(newDays);
    }
  };

  if (!coin) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
        <CircularProgress color="primary" size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {/* Sidebar Info */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 4, height: '100%' }}>
            <Box component="img" src={coin?.image.large} alt={coin?.name} sx={{ height: 160, mb: 3 }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
              {coin?.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ width: '100%', mb: 2, textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: coin?.description.en.split('. ')[0] + '.' }} />
            
            <Box sx={{ width: '100%', mt: 4 }}>
              <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <span style={{ fontWeight: 600 }}>Rank:</span> 
                {coin?.market_cap_rank}
              </Typography>
              <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <span style={{ fontWeight: 600 }}>Current Price:</span> 
                ${coin?.market_data.current_price.usd.toLocaleString()}
              </Typography>
              <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600 }}>Market Cap:</span> 
                ${coin?.market_data.market_cap.usd.toLocaleString().slice(0, -6)} M
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Chart Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            {!historicData || loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 400 }}>
                <CircularProgress color="secondary" size={60} />
              </Box>
            ) : (
              <>
                <Box sx={{ width: '100%', mb: 4 }}>
                  <Line
                    data={{
                      labels: historicData.map((coinData) => {
                        let date = new Date(coinData[0]);
                        let time =
                          date.getHours() > 12
                            ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                            : `${date.getHours()}:${date.getMinutes()} AM`;
                        return days === 1 ? time : date.toLocaleDateString();
                      }),
                      datasets: [
                        {
                          data: historicData.map((coinData) => coinData[1]),
                          label: `Price ( Past ${days} Days ) in USD`,
                          borderColor: '#00e676',
                          backgroundColor: 'rgba(0, 230, 118, 0.1)',
                          borderWidth: 2,
                          fill: true,
                          pointRadius: 0,
                          pointHoverRadius: 6,
                          tension: 0.1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                          labels: {
                            color: '#fff',
                            font: { size: 14 }
                          }
                        },
                      },
                      scales: {
                        x: {
                          grid: { display: false, color: 'rgba(255,255,255,0.1)' },
                          ticks: { color: '#b2bac2' }
                        },
                        y: {
                          grid: { color: 'rgba(255,255,255,0.1)' },
                          ticks: { color: '#b2bac2' }
                        }
                      },
                      interaction: {
                        mode: 'index',
                        intersect: false,
                      },
                    }}
                  />
                </Box>
                
                <ToggleButtonGroup
                  color="primary"
                  value={days}
                  exclusive
                  onChange={handleDaysChange}
                  aria-label="time range"
                  sx={{ mt: 'auto' }}
                >
                  <ToggleButton value={1} sx={{ px: 4, py: 1 }}>24 Hours</ToggleButton>
                  <ToggleButton value={30} sx={{ px: 4, py: 1 }}>30 Days</ToggleButton>
                  <ToggleButton value={90} sx={{ px: 4, py: 1 }}>3 Months</ToggleButton>
                  <ToggleButton value={365} sx={{ px: 4, py: 1 }}>1 Year</ToggleButton>
                </ToggleButtonGroup>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Coin;
