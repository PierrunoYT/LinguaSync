import React, { useState, useEffect } from 'react';
import './App.css';

type Tab = 'translation' | 'grammarCheck' | 'vocabularyExplanation' | 'usageExamples';

function App() {
  const [query, setQuery] = useState('');
  const [inputLanguage, setInputLanguage] = useState('');
  const [outputLanguage, setOutputLanguage] = useState('');
  const [streamingResponse, setStreamingResponse] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('translation');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const key = process.env.REACT_APP_OPENROUTER_API_KEY;
    if (key) {
      setApiKey(key);
    } else {
      console.error('OpenRouter API key is not set in environment variables');
      setError('API key is missing. Please set the REACT_APP_OPENROUTER_API_KEY environment variable.');
    }
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

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setStreamingResponse('');
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    setStreamingResponse('');
    setIsLoading(true);

    if (!query) {
      setError('Please enter a query.');
      setIsLoading(false);
      return;
    }

    if (!apiKey) {
      setError('API key is missing. Please set the REACT_APP_OPENROUTER_API_KEY environment variable.');
      setIsLoading(false);
      return;
    }

    let prompt = '';
    switch (activeTab) {
      case 'translation':
        prompt = `Translate the following text from ${inputLanguage} to ${outputLanguage}: "${query}"`;
        break;
      case 'grammarCheck':
        prompt = `Check the grammar of the following text and provide corrections if needed: "${query}"`;
        break;
      case 'vocabularyExplanation':
        prompt = `Explain the vocabulary used in the following text, providing definitions and context: "${query}"`;
        break;
      case 'usageExamples':
        prompt = `Provide usage examples for the words or phrases in the following text: "${query}"`;
        break;
    }

    try {
      console.log('Sending request to OpenRouter API...');
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": `${window.location.href}`,
          "X-Title": "InstantLingo",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "anthropic/claude-3.5-sonnet",
          "messages": [
            {
              "role": "user",
              "content": prompt
            }
          ],
          "stream": true
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('API response not OK:', response.status, response.statusText, errorBody);
        throw new Error(`API response not OK: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonData = JSON.parse(line.slice(6));
              if (jsonData.choices && jsonData.choices[0].delta.content) {
                setStreamingResponse(prev => prev + jsonData.choices[0].delta.content);
              }
            } catch (parseError) {
              console.error('Error parsing streaming response:', parseError);
              console.log('Problematic line:', line);
              // Attempt to extract content without parsing JSON
              const content = line.slice(6).trim();
              if (content && content !== '[DONE]') {
                setStreamingResponse(prev => prev + content);
              }
            }
          } else if (line.trim() && line.trim() !== '[DONE]') {
            // Handle non-JSON responses
            console.log('Received non-JSON response:', line);
            setStreamingResponse(prev => prev + line + '\n');
          }
        }
      }
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      if (error instanceof Error) {
        setError(`Failed to get response from AI: ${error.message}`);
      } else {
        setError('An unknown error occurred while calling the AI service.');
      }
    } finally {
      setIsLoading(false);
    }
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
        <div className="tab-container">
          <button className={`tab ${activeTab === 'translation' ? 'active' : ''}`} onClick={() => handleTabChange('translation')}>Translation</button>
          <button className={`tab ${activeTab === 'grammarCheck' ? 'active' : ''}`} onClick={() => handleTabChange('grammarCheck')}>Grammar Check</button>
          <button className={`tab ${activeTab === 'vocabularyExplanation' ? 'active' : ''}`} onClick={() => handleTabChange('vocabularyExplanation')}>Vocabulary Explanation</button>
          <button className={`tab ${activeTab === 'usageExamples' ? 'active' : ''}`} onClick={() => handleTabChange('usageExamples')}>Usage Examples</button>
        </div>
        <div className="tab-content">
          {activeTab === 'translation' && (
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
          )}
          <textarea
            value={query}
            onChange={handleInputChange}
            placeholder={`Enter your ${activeTab === 'translation' ? 'text to translate' : 
                          activeTab === 'grammarCheck' ? 'text to check grammar' : 
                          activeTab === 'vocabularyExplanation' ? 'text for vocabulary explanation' : 
                          'text for usage examples'}...`}
            rows={5}
            className="language-input"
          />
          <button onClick={handleSubmit} className="submit-button" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        {streamingResponse && (
          <div className="response-container">
            <h2>AI Response:</h2>
            <p className="streaming-response">{streamingResponse}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
