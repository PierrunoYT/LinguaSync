import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>InstantLingo: Real-time AI Language Assistant</h1>
      </header>
      <main>
        <textarea
          value={query}
          onChange={handleInputChange}
          placeholder="Enter your language query here..."
          rows={5}
          className="language-input"
        />
      </main>
    </div>
  );
}

export default App;
