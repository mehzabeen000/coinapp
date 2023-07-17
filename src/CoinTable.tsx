import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  priceUsd: string;
  iconUrl: string;
  marketCapUsd: string;
  vwap24Hr: string;
  supply: string;
  volumeUsd24Hr: string;
  changePercent24Hr: string;
}

const CoinTable: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const pageSize = 50;

  const fetchCoins = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.coincap.io/v2/assets?limit=${pageSize}&offset=${(page - 1) * pageSize}`
      );
      console.log(response);

      const fetchedCoins: Coin[] = response.data.data;
      const coinPromises = fetchedCoins.map(async (coin) => {
        const iconUrl = `https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`;
        return {
          ...coin,
          iconUrl: iconUrl,
        };
      });
      const coinsWithIcons = await Promise.all(coinPromises);
      setCoins(coinsWithIcons);
    } catch (error) {
      console.error('Error fetching coins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, [page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const formatValue = (value: string): string => {
    return Intl.NumberFormat().format(parseFloat(value));
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="coin table">
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Coin</TableCell>
                  <TableCell>Price (USD)</TableCell>
                  <TableCell>Market Cap (USD)</TableCell>
                  <TableCell>VWAP (24Hr)</TableCell>
                  <TableCell>Supply</TableCell>
                  <TableCell>Volume (24Hr)</TableCell>
                  <TableCell>Change (24Hr)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coins.map((coin) => (
                  <TableRow
                    key={coin.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{coin.rank}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <img src={coin.iconUrl} alt={coin.symbol} width={36} height={36} />
                        <Box ml={1} display={'flex'} flexDirection={'column'}>
                          <Typography variant="body1" component="span" fontWeight="bold">
                            {coin.name}
                          </Typography>
                          <Typography variant="body2" component="span" color="textSecondary">
                            {coin.symbol}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{formatValue(coin.priceUsd)}</TableCell>
                    <TableCell>{formatValue(coin.marketCapUsd)}</TableCell>
                    <TableCell>{formatValue(coin.vwap24Hr)}</TableCell>
                    <TableCell>{formatValue(coin.supply)}</TableCell>
                    <TableCell>{formatValue(coin.volumeUsd24Hr)}</TableCell>
                    <TableCell>{parseFloat(coin.changePercent24Hr).toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={2} display="flex" justifyContent="center">
            <Button variant="contained" onClick={handleLoadMore}>
              Load More
            </Button>
          </Box>
        </div>
      )}
    </div>
  );
};

export default CoinTable;
