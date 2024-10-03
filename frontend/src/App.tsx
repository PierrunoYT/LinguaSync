import React, { useState, useEffect, useCallback } from 'react';
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
  const [isWaiting, setIsWaiting] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const key = process.env.REACT_APP_OPENROUTER_API_KEY;
    if (key) {
      setApiKey(key);
    } else {
      console.error('OpenRouter API key is not set in environment variables');
      setError('API key is missing. Please set the REACT_APP_OPENROUTER_API_KEY environment variable.');
    }
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    if (!isInitializing) {
      if (!apiKey) {
        setError('API key is missing. Please set the REACT_APP_OPENROUTER_API_KEY environment variable.');
      } else {
        setError('');
      }
    }
  }, [apiKey, isInitializing]);

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      setIsWaiting(true);
      timeoutId = setTimeout(() => {
        setIsWaiting(false);
        func(...args);
      }, delay);
    };
  };

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
    setQuery(''); // Clear the query when switching tabs
  };

  const processQuery = useCallback(async () => {
    setError('');
    setStreamingResponse('');
    setIsLoading(true);

    if (!query) {
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
        prompt = `Translate the following text from ${inputLanguage} to ${outputLanguage}. Provide only the translation without any explanations: "${query}"`;
        break;
      case 'grammarCheck':
        prompt = `Check the grammar of the following text and provide corrections if needed. Be concise and only point out errors: "${query}"`;
        break;
      case 'vocabularyExplanation':
        prompt = `Provide a comprehensive explanation of the following text: "${query}"

        Your explanation should include:
        1. An overall interpretation or meaning of the text.
        2. Explanation of any challenging words, phrases, or idioms used in the text.
        3. Any relevant cultural or contextual information that helps understand the text better.
        4. If it's a single word, provide its definition, part of speech, and a few example sentences showing its usage in different contexts.
        5. If it's a phrase or sentence, explain how the words work together to convey the meaning.
        6. Mention any grammatical structures or language features that are notable in the text.

        Please provide your explanation in a clear, easy-to-read format, using paragraphs or bullet points as appropriate.`;
        break;
      case 'usageExamples':
        prompt = `Provide 2-3 brief usage examples for the key words or phrases in the following text. Format as a list: "${query}"`;
        break;
    }

    try {
      console.log('Sending request to OpenRouter API...');
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": `${window.location.href}`,
          "X-Title": "LinguaSync",
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
          "max_tokens": 1000
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('API response not OK:', response.status, response.statusText, errorBody);
        throw new Error(`API response not OK: ${response.status} ${response.statusText}`);
      }

      const jsonResponse = await response.json();
      if (jsonResponse.choices && jsonResponse.choices[0] && jsonResponse.choices[0].message) {
        setStreamingResponse(jsonResponse.choices[0].message.content);
      } else {
        throw new Error('Unexpected response format from OpenRouter API');
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
  }, [query, apiKey, activeTab, inputLanguage, outputLanguage]);

  useEffect(() => {
    if (query) {
      const timeoutId = setTimeout(() => {
        processQuery();
      }, 1000);
      return () => clearTimeout(timeoutId);
    } else {
      setStreamingResponse('');
    }
  }, [query, processQuery]);

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese', 'Japanese', 'Korean'
  ];

  if (isInitializing) {
    return <div className="App">Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>LinguaSync: AI-Powered Language Assistant</h1>
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
          <button onClick={processQuery} className="submit-button" disabled={isLoading || !query.trim()}>
            Submit
          </button>
        </div>
        {isWaiting && <div className="waiting-indicator">Waiting for you to finish typing...</div>}
        {isLoading && <div className="loading-indicator">Processing...</div>}
        {error && <div className="error-message">{error}</div>}
        {streamingResponse && (
          <div className="response-container">
            <h2>AI Response:</h2>
            <div className="response-wrapper">
              <p className="response">{streamingResponse}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
