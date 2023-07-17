import React from 'react';
import './App.css';
import CoinTable from './CoinTable';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>CoinCap Landing Page</h1>
          <CoinTable />
        </div>
      </header>
    </div>
  );
}

export default App;
