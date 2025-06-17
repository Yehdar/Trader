import React, { useState } from 'react';

function App() {
  const [options, setOptions] = useState<any[]>([]);
  const [price, setPrice] = useState('');
  const [tickerInput, setTickerInput] = useState('');
  const [time, setTime] = useState('');
  const [tradeResponse, setTradeResponse] = useState('');
  const [selectedOptionId, setSelectedOptionId] = useState<number>(0);

  const handleTrade = async (action: string) => {
    if (!selectedOptionId) return alert("Select a valid Option ID");

    try {
      const response = await fetch('http://localhost:8080/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionId: selectedOptionId, action })
      });
      const data = await response.json();
      setTradeResponse(`${data.message} (${data.timestamp})`);
    } catch (error) {
      console.error('Trade failed:', error);
    }
  };

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
        <h3>📊 Trade Options</h3>
        <input
          type="number"
          value={selectedOptionId}
          onChange={(e) => setSelectedOptionId(Number(e.target.value))}
          placeholder="Enter Option ID"
        />
        <button onClick={() => handleTrade('buy')}>Buy</button>
        <button onClick={() => handleTrade('sell')}>Sell</button>
        <p>{tradeResponse}</p>
      </div>

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
