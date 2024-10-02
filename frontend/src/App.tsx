import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [inputLanguage, setInputLanguage] = useState('');
  const [outputLanguage, setOutputLanguage] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(event.target.value);
  };

  const handleInputLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInputLanguage(event.target.value);
  };

  const handleOutputLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOutputLanguage(event.target.value);
  };

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean'
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>InstantLingo: Real-time AI Language Assistant</h1>
      </header>
      <main>
        <div className="language-controls">
          <div className="language-select">
            <label htmlFor="input-language">Input Language:</label>
            <select
              id="input-language"
              value={inputLanguage}
              onChange={handleInputLanguageChange}
            >
              <option value="">Select language</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          <div className="language-select">
            <label htmlFor="output-language">Output Language:</label>
            <select
              id="output-language"
              value={outputLanguage}
              onChange={handleOutputLanguageChange}
            >
              <option value="">Select language</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>
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
