const NodeHelper = require("node_helper");
const Log = require("logger");
const TelegramFetcher = require("./telegramfetcher");

module.exports = NodeHelper.create({
	// Override start method.
	start () {
		Log.log(`Starting node helper for: ${this.name}`);
		this.fetchers = [];
	},

	// Override socketNotificationReceived.
	socketNotificationReceived (notification, payload) {
		if (notification === "ADD_TELEGRAM") {
			this.createFetcher(payload.config);
		}
	},

	/**
	 * Creates a fetcher for Telegram messages if it doesn't exist yet.
	 * Otherwise it reuses the existing one.
	 * @param {object} config The configuration object
	 */
	createFetcher (config) {
		const identifier = `${config.botToken}_${config.chatId}`; // Unique identifier
		const botToken = config.botToken || "";
		const chatId = config.chatId || "";
		const updateInterval = config.updateInterval || 60 * 1000;
		const maxMessages = config.maxMessages || 5;

		// Validate configuration
		if (!botToken || !chatId) {
			Log.error("Error: Missing Telegram bot token or chat ID");
			this.sendSocketNotification("TELEGRAM_ERROR", { 
				error_type: "MODULE_ERROR_MISSING_CREDENTIALS" 
			});
			return;
		}

		let fetcher;
		if (typeof this.fetchers[identifier] === "undefined") {
			Log.log(`Create new Telegram fetcher for chat: ${chatId} - Interval: ${updateInterval}`);
			fetcher = new TelegramFetcher(botToken, chatId, updateInterval, maxMessages);

			fetcher.onReceive(() => {
				this.broadcastMessages(identifier);
			});

			fetcher.onError((fetcher, error) => {
				Log.error("Error: Could not fetch Telegram messages: ", error);
				let error_type = NodeHelper.checkFetchError(error);
				this.sendSocketNotification("TELEGRAM_ERROR", {
					error_type
				});
			});

			this.fetchers[identifier] = fetcher;
		} else {
			Log.log(`Use existing Telegram fetcher for chat: ${chatId}`);
			fetcher = this.fetchers[identifier];
			fetcher.setUpdateInterval(updateInterval);
			fetcher.broadcastMessages();
		}

		fetcher.startFetch();
	},

	/**
	 * Broadcasts the Telegram messages for a specific fetcher.
	 * @param {string} identifier The fetcher identifier
	 */
	broadcastMessages (identifier) {
		if (this.fetchers[identifier]) {
			const messages = this.fetchers[identifier].messages();
			this.sendSocketNotification("TELEGRAM_MESSAGES", messages);
		}
	}
});
