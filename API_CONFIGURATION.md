# API Конфигурация для AI Чата

## Способ 1: Прямо в chat.js (Рекомендуется)

Откройте файл `chat.js` и найдите строку 7:

```javascript
const chatConfig = {
    apiEndpoint: null, // Установите URL вашего API здесь
    ...
}
```

Замените `null` на URL вашего API:

```javascript
const chatConfig = {
    apiEndpoint: 'https://api.example.com/chat', // Ваш API endpoint
    defaultGreeting: 'Здравствуйте! Я AI помощник DataHub. Чем могу помочь?',
    animationDuration: 300
};
```

## Способ 2: Через JavaScript на странице

Добавьте в любой HTML файл перед закрывающим тегом `</body>`:

```html
<script>
    // Подключение API после загрузки chat.js
    if (window.AIChat) {
        window.AIChat.setAPIEndpoint('https://api.example.com/chat');
    }
</script>
```

## Формат API запроса

Ваш API должен принимать POST запрос с JSON:

**Запрос:**
```json
{
    "message": "Текст сообщения пользователя",
    "history": [
        {"type": "user", "text": "...", "timestamp": 1234567890},
        {"type": "bot", "text": "...", "timestamp": 1234567891}
    ]
}
```

**Ответ:**
```json
{
    "response": "Ответ от AI",
    "message": "Ответ от AI" // альтернативное поле
}
```

## Примеры API endpoints

- OpenAI: `https://api.openai.com/v1/chat/completions`
- Custom API: `https://your-backend.com/api/chat`
- Local API: `/api/chat`

## Добавление API ключа (если требуется)

Если ваш API требует ключ авторизации, измените функцию `getBotResponse` в `chat.js` (строка ~414):

```javascript
const response = await fetch(chatConfig.apiEndpoint, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY' // Добавьте здесь
    },
    body: JSON.stringify({
        message: userMessage,
        history: chatState.messages
    })
});
```

Или добавьте в `chatConfig`:

```javascript
const chatConfig = {
    apiEndpoint: 'https://api.example.com/chat',
    apiKey: 'YOUR_API_KEY', // Добавьте ключ
    ...
}
```

И используйте:

```javascript
headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${chatConfig.apiKey}`
}
```

