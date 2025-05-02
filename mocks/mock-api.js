// Simulate network latency
const simulateNetworkDelay = (response, delay = 200) => {
    return new Promise((resolve) => setTimeout(() => resolve(response), delay));
};

/**
 * Mock authentication function
 * @param {string} login 
 * @param {string} pass 
 * @returns {Promise<{ success: boolean, token?: string, error?: string }>}
 */
function auth(login, pass) {
    console.log(`Mock auth called with login: ${login}, pass: ${pass}`);

    if (login === 'admin' && pass === 'password') {
        return simulateNetworkDelay({
            success: true,
            token: 'mock-token-123456'
        });
    } else {
        return simulateNetworkDelay({
            success: false,
            error: 'Invalid login credentials'
        });
    }
}

/**
 * Mock getHistory function
 * @returns {Promise<Array<{ date: string, author: 'user'|'ai', text: string }>>}
 */
function getHistory() {
    console.log('Mock getHistory called');

    const mockHistory = [
        {
            date: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            author: 'user',
            text: 'Hello, who are you?'
        },
        {
            date: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
            author: 'ai',
            text: 'I am an AI assistant!'
        },
        {
            date: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
            author: 'user',
            text: 'What can you do?'
        },
        {
            date: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            author: 'ai',
            text: 'I can help answer your questions and assist with various tasks.'
        }
    ];

    return simulateNetworkDelay(mockHistory);
}

/**
 * Mock getAnswer function
 * @param {string} q 
 * @returns {Promise<string>}
 */
function getAnswer(q) {
    console.log(`Mock getAnswer called with question: ${q}`);

    const mockAnswers = {
        'hello': 'Hello there!',
        'what is your name': 'I am a mock AI assistant.',
        'how are you': 'I am functioning within normal parameters.',
        'long answer': `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).`
    };

    const lowerQ = q.trim().toLowerCase();
    const answer = mockAnswers[lowerQ] || "I'm not sure how to answer that, but I'm learning!";

    return simulateNetworkDelay(answer);
}
