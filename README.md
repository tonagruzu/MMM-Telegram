# MMM-Telegram

A MagicMirror² module to display your latest Telegram messages on your smart mirror.

## Features

- Display latest unread Telegram messages
- Configurable number of messages to show
- Auto-refresh on a configurable interval
- Shows sender name and timestamp
- Relative or absolute time display
- Message truncation for long messages
- Fade effect for older messages

## Installation

1. Navigate to your MagicMirror's `modules` folder:
```bash
cd ~/MagicMirror/modules
```

2. The module should already be in the `modules/MMM-Telegram/` folder.

## Getting Started

### 1. Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow the instructions to name your bot
4. BotFather will give you a **Bot Token** - save this for later
5. The token looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

### 2. Get Your Chat ID

You need to get your personal Chat ID to receive messages from yourself:

**Option A: Using a Bot**
1. Search for `@userinfobot` in Telegram
2. Start a chat with it
3. It will reply with your Chat ID (a number like `123456789`)

**Option B: Manual Method**
1. Send a message to your newly created bot
2. Open this URL in a browser (replace `YOUR_BOT_TOKEN` with your actual token):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
3. Look for `"chat":{"id":123456789` - that number is your Chat ID

### 3. Configure the Module

Add the module to your `config/config.js` file:

```javascript
{
    module: "MMM-Telegram",
    position: "top_right", // Choose your desired position
    config: {
        botToken: "123456789:ABCdefGHIjklMNOpqrsTUVwxyz", // Your bot token from BotFather
        chatId: "123456789", // Your chat ID
        updateInterval: 60000, // Check every 60 seconds (60000 ms)
        maxMessages: 5 // Show 5 latest messages
    }
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `botToken` | String | **REQUIRED** | Your Telegram bot token from @BotFather |
| `chatId` | String | **REQUIRED** | Your Telegram chat ID |
| `updateInterval` | Number | `60000` | How often to check for new messages (in milliseconds) |
| `maxMessages` | Number | `5` | Maximum number of messages to display |
| `animationSpeed` | Number | `2500` | Speed of the update animation (in milliseconds) |
| `showSender` | Boolean | `true` | Show the sender's name |
| `showTime` | Boolean | `true` | Show message timestamp |
| `timeFormat` | String | `"relative"` | Time format: "relative" (e.g., "5 minutes ago") or "absolute" (e.g., "14:30") |
| `fadeMessages` | Boolean | `true` | Apply fade effect to older messages |
| `fadePoint` | Number | `0.6` | Start fading from this point (0-1, where 0.6 = 60% of messages) |
| `hideLoading` | Boolean | `false` | Hide module until first messages are loaded |
| `lengthDescription` | Number | `200` | Maximum message length to display |
| `truncateMessage` | Boolean | `true` | Truncate long messages |

## Usage

1. Once configured, messages you send to your bot will appear on the Magic Mirror
2. The module will check for new messages every `updateInterval` milliseconds
3. Only messages sent **after** the module starts will be displayed initially
4. The module shows the latest messages in chronological order (newest first)

## Sending Messages

To test the module:
1. Open Telegram
2. Find your bot (search for the name you gave it)
3. Send a message to your bot
4. Wait for the next update interval (default: 60 seconds)
5. Your message should appear on the Magic Mirror!

## Security Notes

⚠️ **Important Security Information:**

1. **Never commit your bot token or chat ID to a public repository**
2. Keep your `config/config.js` file private
3. Consider using environment variables for sensitive data
4. Anyone with your bot token can read your messages

## Troubleshooting

### Module shows "Missing bot token or chat ID"
- Make sure both `botToken` and `chatId` are configured in `config.js`
- Check that the values are in quotes (strings)

### Module shows "No new messages"
- Send a message to your bot in Telegram
- Wait for the `updateInterval` to pass (default 60 seconds)
- Check the MagicMirror console for errors: `pm2 logs mm` or check browser console

### Messages not appearing
- Verify your bot token is correct
- Verify your chat ID is correct
- Make sure you sent messages to the bot (not to yourself)
- Check the MagicMirror logs for errors

### Getting errors in the console
- Check your bot token format (should be like `123456789:ABCdefGHI...`)
- Verify internet connection
- Try sending a test message directly to the bot

## How It Works

1. The module uses the Telegram Bot API to fetch messages
2. It polls the API every `updateInterval` milliseconds
3. New messages are filtered by your `chatId`
4. Messages are displayed in the MagicMirror UI
5. The module tracks the last update ID to avoid showing duplicate messages

## Future Enhancements

Potential features for future versions:
- Group chat support
- Message filtering by keyword or sender
- Notification sounds
- Webhook support for real-time updates
- Send messages from the mirror (with voice or keyboard)
- Support for photos and media
- Multiple bot support

## Contributing

This module is part of the MMM-Core project. Contributions are welcome!

## License

This module follows the same license as MagicMirror².

## Credits

Developed for MagicMirror²
Based on the MagicMirror module architecture
Uses Telegram Bot API
