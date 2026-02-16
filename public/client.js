// DOM Elements
const startScreen = document.getElementById('startScreen');
const waitingScreen = document.getElementById('waitingScreen');
const chatScreen = document.getElementById('chatScreen');
const startChatBtn = document.getElementById('startChatBtn');
const cancelWaitBtn = document.getElementById('cancelWaitBtn');
const endChatBtn = document.getElementById('endChatBtn');
const nextChatBtn = document.getElementById('nextChatBtn');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');
const userIdSpan = document.getElementById('userId');
const systemMessage = document.getElementById('systemMessage');
const partnerStatus = document.getElementById('partnerStatus');
const waitingMessage = document.getElementById('waitingMessage');
const typingIndicator = document.getElementById('typingIndicator');
const onlineUsersSpan = document.getElementById('onlineUsers');

// Initialize Socket.io connection
const socket = io();

// Chat state
let currentPartnerId = null;
let isTyping = false;
let typingTimeout = null;

// Show screen helper function
function showScreen(screen) {
    startScreen.classList.remove('active');
    waitingScreen.classList.remove('active');
    chatScreen.classList.remove('active');
    screen.classList.add('active');
}

// Add message to chat
function addMessage(message, type = 'system', sender = '', time = '') {
    const messageDiv = document.createElement('div');
    
    if (type === 'system') {
        messageDiv.className = 'system-message';
        messageDiv.textContent = message;
    } else {
        messageDiv.className = `message ${type}`;
        
        if (sender) {
            const senderSpan = document.createElement('div');
            senderSpan.className = 'sender';
            senderSpan.textContent = sender === socket.id ? 'You' : 'Stranger';
            messageDiv.appendChild(senderSpan);
        }
        
        const messageText = document.createElement('div');
        messageText.textContent = message;
        messageDiv.appendChild(messageText);
        
        if (time) {
            const timeSpan = document.createElement('div');
            timeSpan.className = 'time';
            timeSpan.textContent = formatTime(time);
            messageDiv.appendChild(timeSpan);
        }
    }
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Format time helper
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Scroll to bottom of chat
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Enable chat input
function enableChat() {
    messageInput.disabled = false;
    sendBtn.disabled = false;
    messageInput.focus();
}

// Disable chat input
function disableChat() {
    messageInput.disabled = true;
    sendBtn.disabled = true;
}

// Clear messages except system message
function clearMessages() {
    const messages = chatMessages.querySelectorAll('.message');
    messages.forEach(msg => msg.remove());
}

// Reset chat state
function resetChatState() {
    currentPartnerId = null;
    disableChat();
    clearMessages();
    systemMessage.textContent = '';
}

// Event Listeners

// Start chat button
startChatBtn.addEventListener('click', () => {
    socket.emit('find_stranger');
    showScreen(waitingScreen);
    waitingMessage.textContent = 'Looking for a stranger...';
});

// Cancel wait button
cancelWaitBtn.addEventListener('click', () => {
    resetChatState();
    showScreen(startScreen);
});

// End chat button
endChatBtn.addEventListener('click', () => {
    socket.emit('end_chat');
    resetChatState();
    showScreen(startScreen);
});

// Next chat button
nextChatBtn.addEventListener('click', () => {
    socket.emit('end_chat');
    resetChatState();
    socket.emit('find_stranger');
    showScreen(waitingScreen);
    waitingMessage.textContent = 'Looking for a new stranger...';
});

// Send message
function sendMessage() {
    const message = messageInput.value.trim();
    
    if (message && currentPartnerId) {
        socket.emit('send_message', { message });
        
        // Add my message to chat
        addMessage(message, 'sent', socket.id, new Date().toISOString());
        
        messageInput.value = '';
        socket.emit('stop_typing');
    }
}

// Send button click
sendBtn.addEventListener('click', sendMessage);

// Enter key to send message
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Typing indicator
messageInput.addEventListener('input', () => {
    if (!isTyping && currentPartnerId) {
        isTyping = true;
        socket.emit('typing');
    }
    
    // Clear previous timeout
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
    
    // Stop typing after 1 second of inactivity
    typingTimeout = setTimeout(() => {
        if (isTyping) {
            isTyping = false;
            socket.emit('stop_typing');
        }
    }, 1000);
});

// Socket Events

// Welcome message from server
socket.on('system_message', (data) => {
    if (data.type === 'welcome') {
        userIdSpan.textContent = data.userId;
    } else if (data.type === 'waiting') {
        waitingMessage.textContent = data.message;
    } else if (data.type === 'error') {
        addMessage(data.message, 'system');
    }
});

// Chat started
socket.on('chat_started', (data) => {
    currentPartnerId = data.partnerId;
    partnerStatus.textContent = 'Connected with stranger';
    enableChat();
    
    addMessage('You are now connected with a stranger. Say hello!', 'system');
    
    // Hide waiting screen and show chat
    waitingScreen.classList.remove('active');
    chatScreen.classList.add('active');
});

// Receive message
socket.on('receive_message', (data) => {
    addMessage(data.message, 'received', data.senderId, data.timestamp);
});

// Typing events
socket.on('partner_typing', () => {
    typingIndicator.classList.add('visible');
    scrollToBottom();
});

socket.on('partner_stop_typing', () => {
    typingIndicator.classList.remove('visible');
});

// Chat ended
socket.on('chat_ended', (data) => {
    addMessage(data.message, 'system');
    disableChat();
    currentPartnerId = null;
    
    // Update status
    partnerStatus.textContent = 'Chat ended';
    
    // Disable input until new chat starts
    messageInput.disabled = true;
    sendBtn.disabled = true;
});

// Connection status
socket.on('connect', () => {
    console.log('Connected to server');
});

// Receive online count from server
socket.on('online_count', (count) => {
    console.log('Online users:', count);
    onlineUsersSpan.textContent = count;
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    addMessage('Disconnected from server. Please refresh the page.', 'system', '', new Date().toISOString());
});

// Connection error
socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
    addMessage('Failed to connect to server. Please try again.', 'system', '', new Date().toISOString());
});

// Initialize
showScreen(startScreen);

