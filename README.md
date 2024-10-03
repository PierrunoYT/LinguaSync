# LinguaSync

LinguaSync is an AI-powered web application for language assistance. It offers translation, grammar checking, vocabulary explanation, and usage examples.

## Features

- Translation between multiple languages
- Grammar checking and correction suggestions
- Vocabulary explanations with definitions and context
- Usage examples for words and phrases
- AI-powered responses
- User-friendly interface with tabbed functionality

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- An OpenRouter API key

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/LinguaSync.git
   ```

2. Navigate to the project directory:
   ```
   cd LinguaSync
   ```

3. Install the dependencies:
   ```
   cd frontend && npm install
   ```

## Setting up the Environment

1. Obtain an API key from OpenRouter (https://openrouter.ai/).

2. Set the API key as a system environment variable:

   For Windows (Command Prompt, run as Administrator):
   ```
   setx REACT_APP_OPENROUTER_API_KEY "your_api_key_here" /M
   ```

   For macOS/Linux:
   ```
   echo "export REACT_APP_OPENROUTER_API_KEY=your_api_key_here" >> ~/.bash_profile
   source ~/.bash_profile
   ```

   Replace `your_api_key_here` with your actual OpenRouter API key.

3. Restart your terminal or command prompt for the changes to take effect.

## Running the Application

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Start the development server:
   ```
   npm start
   ```

3. Open your web browser and visit `http://localhost:3000` to use the application.

## Usage

1. Select the desired function from the tabs: Translation, Grammar Check, Vocabulary Explanation, or Usage Examples.

2. For translation, select the input and output languages from the dropdown menus.

3. Enter your text in the input field.

4. Click the "Submit" button to get the AI-generated response.

5. The response will appear in the output area below.

## Troubleshooting

If you encounter any issues:

1. Ensure that the API key is correctly set in your environment variables:
   - Windows: `echo %REACT_APP_OPENROUTER_API_KEY%`
   - macOS/Linux: `echo $REACT_APP_OPENROUTER_API_KEY`

2. If the API key is not visible, try setting it again and restart your terminal.

3. Check the browser console (F12) for any error messages.

4. Verify that you have an active internet connection.

5. Ensure that the OpenRouter API service is operational.

## Contributing

Contributions to LinguaSync are welcome. Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.

Alternatively, see the GitHub documentation on [creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
