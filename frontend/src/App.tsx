import React, { useState, useEffect } from 'react';
import './App.css';

interface AIModel {
  id: string;
  name: string;
}

function App() {
  const [query, setQuery] = useState('');
  const [inputLanguage, setInputLanguage] = useState('');
  const [outputLanguage, setOutputLanguage] = useState('');
  const [aiModels, setAiModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState('');

  useEffect(() => {
    // Fetch AI models from OpenRouter API
    fetch('https://openrouter.ai/api/v1/models')
      .then(response => response.json())
      .then(data => {
        const models = data.data.map((model: any) => ({
          id: model.id,
          name: model.name
        }));
        setAiModels(models);
      })
      .catch(error => console.error('Error fetching AI models:', error));
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(event.target.value);
  };

  const handleInputLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInputLanguage(event.target.value);
  };

  const handleOutputLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOutputLanguage(event.target.value);
  };

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
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
        <div className="controls">
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
          <div className="model-select">
            <label htmlFor="ai-model">AI Model:</label>
            <select
              id="ai-model"
              value={selectedModel}
              onChange={handleModelChange}
            >
              <option value="">Select AI model</option>
              {aiModels.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
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
