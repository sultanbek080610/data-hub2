// AI Chat Widget - Universal Module
(function() {
    'use strict';

    // Chat configuration
    const chatConfig = {
        // ============================================
        // OpenRouter API Configuration
        // ============================================
        // OpenRouter API endpoint
        apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
        
        // OpenRouter API ключ (получите на https://openrouter.ai/)
        apiKey: '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',
        
        // Модель AI (можно изменить на другую модель OpenRouter)
        // Популярные модели: 'openai/gpt-4', 'openai/gpt-3.5-turbo', 'anthropic/claude-3-opus', 'google/gemini-pro'
        model: 'openai/gpt-3.5-turbo',
        
        defaultGreeting: 'Здравствуйте! Я AI помощник DataHub. Чем могу помочь?',
        animationDuration: 300
    };

    // Create chat HTML structure
    function createChatHTML() {
        const chatHTML = `
            <button class="ai-chat-button" id="aiChatButton" aria-label="Открыть AI чат">
                <i class="fas fa-comments"></i>
            </button>
            
            <div class="ai-chat-window" id="aiChatWindow">
                <div class="ai-chat-header">
                    <button class="ai-chat-back" id="aiChatBack" aria-label="Назад">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <h3>AI Помощник</h3>
                    <button class="ai-chat-close" id="aiChatClose" aria-label="Закрыть">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="ai-chat-messages" id="aiChatMessages">
                    <!-- Messages will be added here -->
                </div>
                <div class="ai-chat-input-area">
                    <input type="text" class="ai-chat-input" id="aiChatInput" placeholder="Введите сообщение..." autocomplete="off">
                    <button class="ai-chat-send" id="aiChatSend" aria-label="Отправить">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    // Add chat styles
    function addChatStyles() {
        if (document.getElementById('aiChatStyles')) return;

        const style = document.createElement('style');
        style.id = 'aiChatStyles';
        style.textContent = `
            /* AI Chat Widget Styles */
            .ai-chat-button {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, #2563eb, #1e40af);
                color: white;
                border: none;
                cursor: pointer;
                box-shadow: 0 10px 30px rgba(37, 99, 235, 0.4);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .ai-chat-button:hover {
                transform: scale(1.1);
                box-shadow: 0 15px 40px rgba(37, 99, 235, 0.5);
            }
            .ai-chat-button.active {
                background: #dc2626;
            }
            .ai-chat-button.active:hover {
                background: #991b1b;
            }

            .ai-chat-window {
                position: fixed;
                bottom: 100px;
                right: 30px;
                width: 350px;
                height: 500px;
                max-height: calc(100vh - 140px);
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                display: none;
                flex-direction: column;
                overflow: hidden;
                animation: aiChatSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .ai-chat-window.open {
                display: flex;
            }
            @keyframes aiChatSlideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .ai-chat-header {
                background: linear-gradient(135deg, #2563eb, #1e40af);
                color: white;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 15px;
            }
            .ai-chat-header h3 {
                font-size: 1.1rem;
                font-weight: 700;
                margin: 0;
                flex: 1;
                text-align: center;
            }
            .ai-chat-back,
            .ai-chat-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
                flex-shrink: 0;
            }
            .ai-chat-back:hover,
            .ai-chat-close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }
            .ai-chat-close:hover {
                transform: rotate(90deg) scale(1.1);
            }

            .ai-chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: #f8fafc;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            .ai-chat-messages::-webkit-scrollbar {
                width: 6px;
            }
            .ai-chat-messages::-webkit-scrollbar-track {
                background: #f1f5f9;
            }
            .ai-chat-messages::-webkit-scrollbar-thumb {
                background: #2563eb;
                border-radius: 3px;
            }
            .ai-chat-messages::-webkit-scrollbar-thumb:hover {
                background: #1e40af;
            }

            .ai-message {
                max-width: 80%;
                padding: 12px 16px;
                border-radius: 18px;
                font-size: 0.9rem;
                line-height: 1.5;
                word-wrap: break-word;
                animation: aiMessageAppear 0.3s ease-out;
            }
            @keyframes aiMessageAppear {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            .ai-message.user {
                background: linear-gradient(135deg, #2563eb, #1e40af);
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 4px;
            }
            .ai-message.bot {
                background: white;
                color: #0f172a;
                align-self: flex-start;
                border-bottom-left-radius: 4px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .ai-message.typing {
                background: white;
                padding: 15px;
                align-self: flex-start;
            }
            .ai-message.typing::after {
                content: '...';
                animation: aiTypingDots 1.5s infinite;
            }
            @keyframes aiTypingDots {
                0%, 20% { content: '.'; }
                40% { content: '..'; }
                60%, 100% { content: '...'; }
            }

            .ai-chat-input-area {
                padding: 15px;
                background: white;
                border-top: 1px solid #e2e8f0;
                display: flex;
                gap: 10px;
            }
            .ai-chat-input {
                flex: 1;
                padding: 12px 18px;
                border: 2px solid #e2e8f0;
                border-radius: 25px;
                font-size: 0.9rem;
                font-family: 'Manrope', sans-serif;
                outline: none;
                transition: all 0.3s;
            }
            .ai-chat-input:focus {
                border-color: #2563eb;
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            }
            .ai-chat-send {
                width: 45px;
                height: 45px;
                border-radius: 50%;
                background: linear-gradient(135deg, #2563eb, #1e40af);
                color: white;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
                flex-shrink: 0;
            }
            .ai-chat-send:hover {
                transform: scale(1.1);
                box-shadow: 0 5px 15px rgba(37, 99, 235, 0.3);
            }
            .ai-chat-send:active {
                transform: scale(0.95);
            }
            .ai-chat-send:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .ai-chat-window {
                    width: calc(100% - 40px);
                    right: 20px;
                    bottom: 100px;
                    height: calc(100vh - 200px);
                    max-height: 600px;
                }
                .ai-chat-button {
                    bottom: 20px;
                    right: 20px;
                    width: 55px;
                    height: 55px;
                    font-size: 1.3rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Chat state
    let chatState = {
        isOpen: false,
        messages: [],
        isLoading: false
    };

    // Initialize chat
    function initChat() {
        createChatHTML();
        addChatStyles();
        setupEventListeners();
        
        // Load saved messages if any
        loadChatHistory();
    }

    // Setup event listeners
    function setupEventListeners() {
        const chatButton = document.getElementById('aiChatButton');
        const chatWindow = document.getElementById('aiChatWindow');
        const chatClose = document.getElementById('aiChatClose');
        const chatBack = document.getElementById('aiChatBack');
        const chatInput = document.getElementById('aiChatInput');
        const chatSend = document.getElementById('aiChatSend');

        // Toggle chat
        chatButton.addEventListener('click', toggleChat);
        chatClose.addEventListener('click', closeChat);
        chatBack.addEventListener('click', closeChat);

        // Send message
        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Close on outside click (optional)
        chatWindow.addEventListener('click', function(e) {
            if (e.target === chatWindow) {
                closeChat();
            }
        });
    }

    // Toggle chat
    function toggleChat() {
        if (chatState.isOpen) {
            closeChat();
        } else {
            openChat();
        }
    }

    // Open chat
    function openChat() {
        const chatWindow = document.getElementById('aiChatWindow');
        const chatButton = document.getElementById('aiChatButton');
        const chatInput = document.getElementById('aiChatInput');
        
        chatWindow.classList.add('open');
        chatButton.classList.add('active');
        chatState.isOpen = true;
        
        chatInput.focus();
        
        // Add welcome message if chat is empty
        if (chatState.messages.length === 0) {
            addBotMessage(chatConfig.defaultGreeting);
        }
    }

    // Close chat
    function closeChat() {
        const chatWindow = document.getElementById('aiChatWindow');
        const chatButton = document.getElementById('aiChatButton');
        
        chatWindow.classList.remove('open');
        chatButton.classList.remove('active');
        chatState.isOpen = false;
    }

    // Send message
    async function sendMessage() {
        const chatInput = document.getElementById('aiChatInput');
        const message = chatInput.value.trim();
        
        if (!message || chatState.isLoading) return;

        // Add user message
        addUserMessage(message);
        chatInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Get bot response
        try {
            const response = await getBotResponse(message);
            hideTypingIndicator();
            addBotMessage(response);
        } catch (error) {
            hideTypingIndicator();
            addBotMessage('Извините, произошла ошибка. Попробуйте еще раз.');
            console.error('Chat error:', error);
        }
    }

    // Get bot response (OpenRouter API integration)
    async function getBotResponse(userMessage) {
        // If API endpoint is configured, use it
        if (chatConfig.apiEndpoint && chatConfig.apiKey) {
            try {
                // Формируем историю сообщений для OpenRouter (OpenAI формат)
                const messages = [];
                
                // Добавляем системное сообщение
                messages.push({
                    role: 'system',
                    content: 'Ты полезный AI помощник для платформы DataHub - каталога университетов Казахстана. Помогай пользователям с информацией о программах, поступлении, стоимости обучения, рейтингах и других вопросах, связанных с университетами.'
                });
                
                // Добавляем историю сообщений (последние 10 для экономии токенов)
                const recentMessages = chatState.messages.slice(-10);
                recentMessages.forEach(msg => {
                    messages.push({
                        role: msg.type === 'user' ? 'user' : 'assistant',
                        content: msg.text
                    });
                });
                
                // Добавляем текущее сообщение пользователя
                messages.push({
                    role: 'user',
                    content: userMessage
                });
                
                // Отправляем запрос в OpenRouter
                const response = await fetch(chatConfig.apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${chatConfig.apiKey}`,
                        'HTTP-Referer': window.location.origin, // Опционально, для отслеживания
                        'X-Title': 'DataHub University Catalog' // Опционально
                    },
                    body: JSON.stringify({
                        model: chatConfig.model,
                        messages: messages,
                        temperature: 0.7,
                        max_tokens: 500
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error?.message || `API error: ${response.status}`);
                }
                
                const data = await response.json();
                
                // OpenRouter возвращает ответ в формате OpenAI
                const aiResponse = data.choices?.[0]?.message?.content;
                
                if (aiResponse) {
                    return aiResponse.trim();
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (error) {
                console.error('OpenRouter API error:', error);
                // Fallback to local responses
                return getLocalResponse(userMessage);
            }
        }
        
        // Use local responses if API is not configured
        return getLocalResponse(userMessage);
    }

    // Local response logic (fallback)
    function getLocalResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('привет') || message.includes('здравствуй') || message.includes('добрый')) {
            return 'Здравствуйте! Рад помочь вам. Что вас интересует?';
        }
        if (message.includes('программ') || message.includes('специальност')) {
            return 'В нашем каталоге представлены различные академические программы: бакалавриат, магистратура и докторантура. Вы можете посмотреть подробную информацию на странице "Академические программы".';
        }
        if (message.includes('поступлен') || message.includes('документ') || message.includes('грант')) {
            return 'Для поступления необходимо подготовить документы об образовании, удостоверение личности, медицинскую справку и фотографии. Подробная информация доступна в разделе "Приём и поступление".';
        }
        if (message.includes('стоимость') || message.includes('цена') || message.includes('оплат')) {
            return 'Стоимость обучения зависит от программы и уровня образования. Бакалавриат от 450 000 ₸/год, магистратура от 550 000 ₸/год. Также доступны различные стипендии и гранты.';
        }
        if (message.includes('рейтинг') || message.includes('qs')) {
            return 'Многие университеты Казахстана входят в международные рейтинги QS и THE. КазНУ занимает 175 место в QS World University Rankings.';
        }
        if (message.includes('контакт') || message.includes('адрес') || message.includes('телефон')) {
            return 'Контактная информация каждого университета указана на его странице. Вы можете найти адрес, телефон, email и веб-сайт в разделе "Контакты".';
        }
        if (message.includes('сравнен') || message.includes('сравнить')) {
            return 'Вы можете сравнить несколько университетов по различным параметрам на странице "Функция сравнения". Там доступно сравнение программ, стоимости обучения, рейтингов и инфраструктуры.';
        }
        if (message.includes('международн') || message.includes('erasmus') || message.includes('обмен')) {
            return 'Многие университеты предлагают программы международного обмена, включая Erasmus, Mevlana и Academic Mobility. Подробности в разделе "Международное сотрудничество".';
        }
        if (message.includes('спасибо') || message.includes('благодар')) {
            return 'Пожалуйста! Если у вас есть ещё вопросы, обращайтесь. Удачи в выборе университета!';
        }
        
        return 'Спасибо за вопрос! Я могу помочь с информацией о программах, поступлении, стоимости обучения, рейтингах и многом другом. Задайте более конкретный вопрос, пожалуйста.';
    }

    // Add user message
    function addUserMessage(text) {
        const messagesContainer = document.getElementById('aiChatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message user';
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        
        chatState.messages.push({ type: 'user', text: text, timestamp: Date.now() });
        scrollToBottom();
        saveChatHistory();
    }

    // Add bot message
    function addBotMessage(text) {
        const messagesContainer = document.getElementById('aiChatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message bot';
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        
        chatState.messages.push({ type: 'bot', text: text, timestamp: Date.now() });
        scrollToBottom();
        saveChatHistory();
    }

    // Show typing indicator
    function showTypingIndicator() {
        const messagesContainer = document.getElementById('aiChatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message typing';
        typingDiv.id = 'aiTypingIndicator';
        messagesContainer.appendChild(typingDiv);
        scrollToBottom();
        chatState.isLoading = true;
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('aiTypingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        chatState.isLoading = false;
    }

    // Scroll to bottom
    function scrollToBottom() {
        const messagesContainer = document.getElementById('aiChatMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Save chat history
    function saveChatHistory() {
        try {
            localStorage.setItem('aiChatHistory', JSON.stringify(chatState.messages));
        } catch (e) {
            console.warn('Could not save chat history:', e);
        }
    }

    // Load chat history
    function loadChatHistory() {
        try {
            const saved = localStorage.getItem('aiChatHistory');
            if (saved) {
                chatState.messages = JSON.parse(saved);
                // Restore messages to UI
                chatState.messages.forEach(msg => {
                    if (msg.type === 'user') {
                        const messagesContainer = document.getElementById('aiChatMessages');
                        const messageDiv = document.createElement('div');
                        messageDiv.className = 'ai-message user';
                        messageDiv.textContent = msg.text;
                        messagesContainer.appendChild(messageDiv);
                    } else if (msg.type === 'bot') {
                        const messagesContainer = document.getElementById('aiChatMessages');
                        const messageDiv = document.createElement('div');
                        messageDiv.className = 'ai-message bot';
                        messageDiv.textContent = msg.text;
                        messagesContainer.appendChild(messageDiv);
                    }
                });
            }
        } catch (e) {
            console.warn('Could not load chat history:', e);
        }
    }

    // Public API for configuring chat
    window.AIChat = {
        init: function() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initChat);
            } else {
                initChat();
            }
        },
        setAPIEndpoint: function(endpoint) {
            chatConfig.apiEndpoint = endpoint;
        },
        setAPIKey: function(key) {
            chatConfig.apiKey = key;
        },
        setModel: function(model) {
            chatConfig.model = model;
        },
        open: openChat,
        close: closeChat,
        toggle: toggleChat
    };

    // Auto-initialize when script loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChat);
    } else {
        initChat();
    }

})();

