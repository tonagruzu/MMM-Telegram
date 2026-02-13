Module.register("MMM-Telegram", {
	// Default module config.
	defaults: {
		botToken: "", // Telegram bot token from @BotFather
		chatId: "", // Your chat ID or user ID
		updateInterval: 60 * 1000, // Check for new messages every 60 seconds
		maxMessages: 5, // Maximum number of messages to display
		animationSpeed: 2.5 * 1000,
		showSender: true, // Show sender name
		showTime: true, // Show message timestamp
		timeFormat: "relative", // "relative" or "absolute"
		fadeMessages: true, // Apply fade effect to older messages
		fadePoint: 0.6, // Start fading from this point (0-1)
		hideLoading: false,
		lengthDescription: 200, // Maximum message length to display
		truncateMessage: true // Truncate long messages
	},

	// Define required scripts.
	getScripts () {
		return ["moment.js"];
	},

	// Define required styles.
	getStyles () {
		return ["MMM-Telegram.css"];
	},

	// Define required translations.
	getTranslations () {
		// Translations for the module would go here
		// For now, using core translations
		return false;
	},

	// Define start sequence.
	start () {
		Log.info(`Starting module: ${this.name}`);

		// Set locale.
		moment.locale(config.language);

		this.messages = [];
		this.loaded = false;
		this.error = null;

		// Validate configuration
		if (!this.config.botToken || !this.config.chatId) {
			this.error = "Missing bot token or chat ID. Please configure the module.";
			Log.error(this.error);
			return;
		}

		// Register with node_helper
		this.sendSocketNotification("ADD_TELEGRAM", {
			config: this.config
		});
	},

	// Override socket notification handler.
	socketNotificationReceived (notification, payload) {
		if (notification === "TELEGRAM_MESSAGES") {
			this.messages = payload;

			if (!this.loaded) {
				if (this.config.hideLoading) {
					this.show();
				}
			}

			this.loaded = true;
			this.error = null;
			this.updateDom(this.config.animationSpeed);
		} else if (notification === "TELEGRAM_ERROR") {
			this.error = this.translate(payload.error_type);
			this.loaded = true;
			this.updateDom(this.config.animationSpeed);
		}
	},

	// Override dom generator.
	getDom () {
		const wrapper = document.createElement("div");
		wrapper.className = "telegram";

		// Show error if present
		if (this.error) {
			wrapper.innerHTML = this.error;
			wrapper.className = "dimmed light small telegram-error";
			return wrapper;
		}

		// Show loading state
		if (!this.loaded) {
			wrapper.innerHTML = this.translate("LOADING");
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		// Show message if no messages
		if (this.messages.length === 0) {
			wrapper.innerHTML = "No new messages";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		// Create messages list
		const messagesList = document.createElement("ul");
		messagesList.className = "telegram-messages";

		// Calculate fade parameters
		let startFade = this.messages.length;
		let fadeSteps = 0;
		if (this.config.fadeMessages && this.config.fadePoint < 1) {
			startFade = this.messages.length * this.config.fadePoint;
			fadeSteps = this.messages.length - startFade;
		}

		// Display messages
		this.messages.slice(0, this.config.maxMessages).forEach((message, index) => {
			const messageItem = document.createElement("li");
			messageItem.className = "telegram-message";

			// Apply fade effect
			if (this.config.fadeMessages && index >= startFade) {
				const fadeStep = index - startFade;
				messageItem.style.opacity = 1 - (1 / fadeSteps) * fadeStep;
			}

			// Sender name
			if (this.config.showSender && message.sender) {
				const senderSpan = document.createElement("div");
				senderSpan.className = "telegram-sender bright";
				senderSpan.innerHTML = message.sender;
				messageItem.appendChild(senderSpan);
			}

			// Message text
			const messageText = document.createElement("div");
			messageText.className = "telegram-text";
			let text = message.text || "";
			
			// Truncate message if needed
			if (this.config.truncateMessage && text.length > this.config.lengthDescription) {
				text = text.substring(0, this.config.lengthDescription) + "...";
			}
			
			messageText.innerHTML = text;
			messageItem.appendChild(messageText);

			// Timestamp
			if (this.config.showTime && message.date) {
				const timeSpan = document.createElement("div");
				timeSpan.className = "telegram-time dimmed xsmall";
				if (this.config.timeFormat === "relative") {
					timeSpan.innerHTML = moment(message.date).fromNow();
				} else {
					timeSpan.innerHTML = moment(message.date).format("HH:mm");
				}
				messageItem.appendChild(timeSpan);
			}

			messagesList.appendChild(messageItem);
		});

		wrapper.appendChild(messagesList);
		return wrapper;
	}
});
