document.addEventListener('DOMContentLoaded', function () {
    const chatMessages = document.getElementById('chat-messages');
    const assistantInfoWrapper = document.getElementById('assistant-info-wrapper');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const loginBtn = document.getElementById('login-btn');
    const clearChatBtn = document.getElementById('clear-chat-btn');
    const authWrapper = document.querySelector('.auth-wrapper');


    // Fetch chat history from local storage and display it
    chrome.storage.local.get(['chatHistory', 'selectedTextQueue'], function (result) {
        const chatHistory = result.chatHistory || [];

        if (chatHistory.length > 0) {
            // display the chat history
            displayMessages(chatHistory);

            // scroll to bottom of chat-messages div    
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } else {
            // show a image of the icon and a text with "how can I help you?"
            displayAssistanInfo();
        }

        checkClearChatBtn();

        // focus on the input field
        // userInput.value = result.selectedTextQueue || '';
        adjustInputSize(userInput);
        userInput.focus();
    });


    // disable the send button by default
    sendBtn.disabled = true;

    // disable the send button if the input field is empty
    userInput.addEventListener('keyup', function () {
        const userMessage = userInput.value.trim();
        sendBtn.disabled = userMessage === '';
    });

    // If the user presses enter, click the send button
    userInput.addEventListener('keyup', function (event) {
        if (event.code === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendBtn.click();
        }
    });

    // Auto-resize the input field based on the content
    userInput.addEventListener('input', (e) => adjustInputSize(e.target));

    function adjustInputSize(input) {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 150) + 'px';
        input.style.overflowY = input.scrollHeight > 150 ? 'scroll' : 'auto';
    }

    // Send user's input to background script when the send button is clicked
    sendBtn.addEventListener('click', function () {
        const userMessage = userInput.value.trim();
        if (userMessage !== '') {
            sendMessage(userMessage);
            userInput.value = ''; // Clear the input field

            // disable the send button
            sendBtn.disabled = true;
            // remove the icon from the send button and add the loading indicator
            sendBtn.innerHTML = '<i class="fa fa-spinner fa-pulse"></i>';

            // disable input field while the assistant is typing
            userInput.disabled = true;
            userInput.style.height = 'auto'; // Reset the height

            // scroll to bottom of chat-messages div
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.answer || message.imageUrl) {
            // Display the assistant's response
            displayMessage('assistant', message.answer || message.imageUrl);
        } else if (message.error) {
            // Display the error message
            displayMessage('system', message.error);
        } else if (message.imageUrl) {
            // Display the image in the chat
            displayMessage('assistant', message.imageUrl);
        } else if (message.userInput) {
            displayMessage('user', message.userInput);
        } else if (message.fromSelect) {
            displayMessage('user', message.fromSelect);
        }

        // Enable the send button again
        sendBtn.disabled = false;
        // Add the send icon to the send button and remove the loading indicator
        sendBtn.innerHTML = '<img src="/assets/icons/paper-plane.svg" alt="Send">';

        // Enable the input field again
        userInput.disabled = false;
    });

    // Function to send user's input to the background script and display it in the chat
    function sendMessage(userMessage) {
        const message = { userInput: userMessage };
        // Send the user's message to the background script
        chrome.runtime.sendMessage(message);

        // Display the user's message in the chat
        displayMessage('user', userMessage);
    }

    // Function to display messages in the chat
    function displayMessage(role, content, isImage = false) {
        console.log('displayMessage', content);
        
        const messageElement = document.createElement('div');
        // add id to the message element
        messageElement.classList.add('message');
        messageElement.classList.add(role);

        if (document.getElementById('assistant-info-wrapper')) {
            hideAssistanInfo();
        }

        // check of message starts with a dall-e image URL
        if (isImage) {
            const img = createImageElem(content, 'pasted-image', 'pasted image');

            messageElement.appendChild(img);
        } else { // if it's not an image, it's a text message
            // format the message content
            content = formatMessageContent(content);

            // add the message content to the message element
            messageElement.innerHTML = content;

            // add a copy button to the message if it's from the assistant
            if (role === 'assistant') {
                // create container for the action buttons
                const actionBtns = document.createElement('div');

                actionBtns.className = 'action-btns';
                messageElement.appendChild(actionBtns);

                const copyIcon = createCopyIcon(content)
                
                actionBtns.appendChild(copyIcon);
            }
        }
        
        chatMessages.appendChild(messageElement);

        // enable the clear chat button
        checkClearChatBtn();

        // scroll to the displayed message in the chat-messages div
        messageElement.scrollIntoView();
    }

    function createCopyIcon(content) {
        const copyIcon = document.createElement('i');
        copyIcon.className = 'fa fa-copy action-btn';
        copyIcon.title = 'Copy to clipboard';
        copyIcon.addEventListener('click', function () {
            // Copy the message to the clipboard
            navigator.clipboard.writeText(content)
                .then(() => {
                    // Change the icon to a check
                    copyIcon.className = 'fa fa-check action-btn';

                    // Revert to the default icon after 2 seconds
                    setTimeout(() => {
                        copyIcon.className = 'fa fa-copy action-btn';
                    }, 2000);
                })
                // Display an x icon if the copy operation fails
                .catch(() => {
                    copyIcon.className = 'fa fa-times action-btn';

                    // Revert to the default icon after 2 seconds
                    setTimeout(() => {
                        copyIcon.className = 'fa fa-copy action-btn';
                    }, 2000);
                });
        });

        return copyIcon;
    }

    function formatMessageContent(text) {
        return text.replace(/```(\w+)([\s\S]*?)```/g, function (match, lang, code) {
            // Create a code element
            var codeElement = document.createElement('code');
            // remove the first line break from the code
            code = code.replace(/^\n/, '');

            // Add the code to the code element
            codeElement.innerText = code;

            // Create a container for the code element
            var codeContainer = document.createElement('div');
            codeContainer.appendChild(codeElement);

            // Set the class of the container based on the language (optional)
            codeContainer.className = 'code-block';

            // Return the HTML content with the replaced code
            return codeContainer.outerHTML;
        });
    }

    // Function to display an array of messages
    function displayMessages(messages) {
        for (const message of messages) {
            if (message.role !== 'system') {
                displayMessage(message.role, message.content);
            }
        }
    }

    // fucntion to check if the clear chat button should be enabled or disabled
    function checkClearChatBtn() {
        chrome.storage.local.get(['chatHistory'], function (result) {
            const chatHistory = result.chatHistory || [];
            if (chatHistory.length > 0) {
                clearChatBtn.disabled = false;
            } else {
                clearChatBtn.disabled = true;
            }
        });
    }

    // Clear the chat history when the clear chat button is clicked
    clearChatBtn.addEventListener('click', function () {
        // Display a confirmation popup
        const isConfirmed = window.confirm('Are you sure you want to clear the chat history?');

        // If the user confirms, clear the chat history
        if (isConfirmed) {
            chrome.storage.local.set({ chatHistory: [] }, function () {
                console.log('Chat history cleared');
                chatMessages.innerHTML = '';
                sendBtn.disabled = true;
                checkClearChatBtn();
                displayAssistanInfo();
            });
        }
    });

    loginBtn.addEventListener('click', function () {
        if (authWrapper.classList.contains('hidden')) {
            authWrapper.classList.remove('hidden');
        } else {
            authWrapper.classList.add('hidden');
        }
    });

    authWrapper.addEventListener('click', () => {
        abortAuth();
    });

    function abortAuth() {
        authWrapper.classList.add('hidden');
    }

    // Screenshot button click event
    // document.getElementById('screenshot-btn').addEventListener('click', function () {
    //     chrome.tabs.captureVisibleTab(null,{},function(dataUri){
    //         console.log(dataUri);
    //     });
    // });

    // On image pasted
    document.onpaste = function (event) {
        var items = (event.clipboardData || event.originalEvent.clipboardData).items;
        console.log(JSON.stringify(items)); // might give you mime types
        for (var index in items) {
            var item = items[index];
            if (item.kind === 'file') {
                var blob = item.getAsFile();
                var reader = new FileReader();
                reader.onload = function (event) {
                    displayMessage('user', event.target.result, true); // data url!
                    // TODO: send to background as message
                }; 
                reader.readAsDataURL(blob);
            }
        }
    };

    

    function displayAssistanInfo() {
        assistantInfoWrapper.style.display = 'flex';
    }

    function hideAssistanInfo() {
        assistantInfoWrapper.style.display = 'none';
    }

    function createImageElem(src, className, alt) {
        const imgElem = document.createElement('img');
        imgElem.src = src;
        imgElem.alt = alt;
        imgElem.className = className;
        return imgElem;
    }

    function setFromSelect(text) {
        userInput.value = text;
    }
});