import React, { useState } from 'react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);

  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:8080/');
      const text = await response.text();
      setMessages((prev) => [...prev, text]);
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={handleClick}>Fetch Message</button>
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
