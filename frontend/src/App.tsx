import React, { useState } from 'react';

function App() {
  const [options, setOptions] = useState<any[]>([]);
  const [price, setPrice] = useState('');
  const [tickerInput, setTickerInput] = useState('');
  const [time, setTime] = useState('');

  const fetchOptions = async () => {
    const res = await fetch('http://localhost:8080/api/options');
    const json = await res.json();
    setOptions(json);
  };

  const fetchPrice = async () => {
    if (!tickerInput) return;
    const res = await fetch(`http://localhost:8080/api/price/${tickerInput}`);
    const text = await res.text();
    setPrice(text);
  };

  const fetchTime = async () => {
    const res = await fetch('http://localhost:8080/api/server-time');
    const text = await res.text();
    setTime(text);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📈 Options Trading Dashboard</h2>

      <button onClick={fetchOptions}>View Available Options</button>
      <ul>
        {options.map((opt, idx) => (
          <li key={idx}>
            {opt.ticker} {opt.type.toUpperCase()} @ {opt.strike} → ${opt.price}
          </li>
        ))}
      </ul>

      <div>
        <h3>Check Market Price</h3>
        <input
          value={tickerInput}
          onChange={(e) => setTickerInput(e.target.value)}
          placeholder="Enter ticker (e.g., AAPL)"
        />
        <button onClick={fetchPrice}>Get Price</button>
        <p>{price}</p>
      </div>

      <div>
        <button onClick={fetchTime}>Get Server Time</button>
        <p>{time}</p>
      </div>
    </div>
  );
}

export default App;
