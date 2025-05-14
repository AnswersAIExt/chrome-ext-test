// Initialize chat history
let chatHistory;
let selectedTab;
let selectedText;

// Listen for when the extension is installed
chrome.runtime.onInstalled.addListener(function () {
    // Set default API model
    checkAndCleanToken();
    let defaultModel = "gpt-4.1-nano";
    chrome.storage.local.set({ apiModel: defaultModel });

    // Set empty chat history
    chrome.storage.local.set({ chatHistory: [] });

    // Open the options page
    // chrome.runtime.openOptionsPage();

    // Periodically check if token expired every 5 minutes
    setInterval(checkAndCleanToken, 5 * 60 * 1000);

    createContext();

});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'openSidePanel') {
      // This will open the panel in all the pages on the current window.
      chrome.sidePanel.open({ windowId: tab.windowId });
    }
  });

function createContext() {
    chrome.contextMenus.create({
        id: 'openSidePanel',
        title: 'Open side panel',
        contexts: ['all']
      });
}
 
  async function checkAndCleanToken() {
    const { accessToken, expirationTime } = await chrome.storage.local.get(['accessToken', 'expirationTime']);
  
    if (accessToken && expirationTime && Date.now() > expirationTime) {
      console.log('Token expired. Clearing token.');
      await chrome.storage.local.remove(['accessToken', 'expirationTime']);
    }
  }

  chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {

    if (message.userInput) {

        // Get the API key from local storage
        const { apiKey } = await getStorageData(["apiKey"]);
        // Get the model from local storage
        const { apiModel } = await getStorageData(["apiModel"]);

        // get the chat history from local storage
        const result = await getStorageData(["chatHistory"]);

        if (!result.chatHistory || result.chatHistory.length === 0) {
            chatHistory = [
                { role: "system", content: "I'm your helpful chat bot! I provide helpful and concise answers." },
            ];
        } else {
            chatHistory = result.chatHistory;
        }

        // save user's message to message array
        chatHistory.push({ role: "user", content: message.userInput });

        if (apiModel === "dall-e-3") {
            /**
            // Send the user's message to the OpenAI API
            const response = await fetchImage(message.userInput, apiKey, apiModel);

            if (response && response.data && response.data.length > 0) {
                // Get the image URL
                const imageUrl = response.data[0].url;

                // Add the assistant's response to the message array
                chatHistory.push({ role: "assistant", content: imageUrl });

                // save message array to local storage
                chrome.storage.local.set({ chatHistory: chatHistory });

                // Send the image URL to the popup script
                chrome.runtime.sendMessage({ imageUrl: imageUrl });

                console.log("Sent image URL to popup:", imageUrl);
            }
            return true; // Enable response callback
            */
        } else {
            // Send the user's message to the OpenAI API
            // const response = await fetchChatCompletion(chatHistory, apiKey, apiModel);
            const response = await getAnswer(chatHistory, apiKey, apiModel);

            if (response && response.choices && response.choices.length > 0) {

                // Get the assistant's response
                const assistantResponse = response.choices[0].message.content;

                // Add the assistant's response to the message array
                chatHistory.push({ role: "assistant", content: assistantResponse });

                // save message array to local storage
                chrome.storage.local.set({ chatHistory: chatHistory });

                // Send the assistant's response to the popup script
                chrome.runtime.sendMessage({ answer: assistantResponse });

                console.log("Sent response to popup:", assistantResponse);
            }
            return true; // Enable response callback
        }
    } else if (message.fromSelect) {
        setFromSelect();
    } else if (message.textSelected) {
        
        chrome.storage.local.set({selectedTextQueue: message.textSelected})
        updateSelectedTab();
    }

    return true; // Enable response callback
});

const simulateNetworkDelay = (response, delay = 200) => {
    return new Promise((resolve) => setTimeout(() => resolve(response), delay));
};

/**
 * Mock getAnswer function
 * @param {string} q 
 * @returns {Promise<string>}
 */
function getAnswer(chatHistory) {
    /**
     * @type {Object<{role: string, content: string}>}
     */
    const q = chatHistory[chatHistory.length - 1].content;
    
    console.log(`Mock getAnswer called with question: ${q}`);

    const mockAnswers = {
        'hello': 'Hello there!',
        'what is your name': 'I am a mock AI assistant.',
        'how are you': 'I am functioning within normal parameters.',
        'long answer': `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).`
    };

    const lowerQ = q.trim().toLowerCase();
    const answer = mockAnswers[lowerQ] || `I'm not sure how to answer that, but I'm learning! Try: ${Object.keys(mockAnswers).join(', ')}`;

    return simulateNetworkDelay({choices: [{message: {content: answer}}]});
}

// Fetch data from the OpenAI Chat Completion API
async function fetchChatCompletion(messages, apiKey, apiModel='gpt-4.1-nano') {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                "messages": messages,
                "model": 'gpt-4.1-nano',
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Unauthorized - Incorrect API key
                throw new Error("Looks like your API key is incorrect. Please check your API key and try again.");
            } else {
                throw new Error(`Failed to fetch. Status code: ${response.status}`);
            }
        }

        return await response.json();
    } catch (error) {
        // Send a response to the popup script
        chrome.runtime.sendMessage({ error: error.message });

        console.error(error);
    }
}

// Fetch Image from the OpenAI DALL-E API
async function fetchImage(prompt, apiKey, apiModel) {
    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                "prompt": prompt,
                "model": apiModel,
                "n": 1,
                "size": "1024x1024",
            })
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Unauthorized - Incorrect API key
                throw new Error("Looks like your API key is incorrect. Please check your API key and try again.");
            } else {
                throw new Error(`Failed to fetch. Status code: ${response.status}`);
            }
        }

        return await response.json();
    } catch (error) {
        // Send a response to the popup script
        chrome.runtime.sendMessage({ error: error.message });

        console.error(error);
    }
}

// Get data from local storage
function getStorageData(keys) {
    return new Promise((resolve) => {
        chrome.storage.local.get(keys, (result) => resolve(result));
    });
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

function setFromSelect() {
    if (!selectedTab) {
        updateSelectedTab();
        return;
    }

    chrome.sidePanel.open({ windowId: selectedTab.windowId });
}

async function updateSelectedTab() {
    selectedTab = await getCurrentTab();
    console.log('selected', selectedTab.windowId);
    
}