@freetoolsddoss

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const fullContactApiKey = 'YOUR_FULLCONTACT_API_KEY';
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/trackmail (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const email = match[1];

    try {
        const response = await axios.get(`https://api.fullcontact.com/v3/person.enrich?email=${email}`, {
            headers: {
                'Authorization': `Bearer ${fullContactApiKey}`
            }
        });
        const userData = response.data;

        // Extract relevant information
        const fullName = userData.fullName;
        const location = userData.location;
        const socialProfiles = userData.socialProfiles;
        const browserInfo = userData.browser;
        const ipAddress = userData.ipAddress;
        const phoneNumbers = userData.phoneNumbers;

        // Construct message with the extracted information
        let message = `Informasi Email:
Email: ${email}
Nama: ${fullName}
Kota: ${location.city}
Koordinat: ${location.latitude}, ${location.longitude}`;

        // Add browser info if available
        if (browserInfo) {
            message += `
Browser: ${browserInfo.name}
Sistem Operasi: ${browserInfo.os}`;
        }

        // Add IP address if available
        if (ipAddress) {
            message += `
Alamat IP: ${ipAddress}`;
        }

        // Add phone numbers if available
        if (phoneNumbers && phoneNumbers.length > 0) {
            message += `
Nomor Telepon: ${phoneNumbers.map(number => number.number).join(', ')}`;
        }

        // Add social profiles if available
        if (socialProfiles && socialProfiles.length > 0) {
            message += `
Akun Sosial Media: ${socialProfiles.map(profile => profile.url).join(', ')}`;
        }

        // Send the message
        bot.sendMessage(chatId, message);
    } catch (error) {
        console.error(error);
        bot.sendMessage(chatId, 'Terjadi kesalahan dalam memproses permintaan.');
    }
});

// Listen for any kind of message
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    // Echo the received message
    bot.sendMessage(chatId, 'Received your message: ' + msg.text);
});
