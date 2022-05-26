import Discord from "discord.js-v11-stable";
import fetch from 'node-fetch';

export class DiscordCaller {

    #channels;
    #userToken;
    #client;

    constructor(userToken, channels = []) {
        this.#userToken = userToken;
        this.#channels = channels;
        this.#client = new Discord.Client();

        this.#client.on('ready', () => {
            console.log(`Logged in as ${this.#client.user.tag}!`);
        });

        this.#client.on('message', async msg => {
            const channelId = msg.channel.id;

            const channel = this.#channels.find(c => c.id === channelId);
            if (channel) {
                await fetch(`${API_URL}/message`, {
                    method: "post",
                    body: JSON.stringify({
                        channel: "921918027186995213",
                        message: `${channel.name} - ${msg.content}`
                    }),
                    headers: {'Content-Type': 'application/json'}
                });
            }
        });

        this.#client.login(userToken);
    }

    getUserToken() {
        return this.#userToken;
    }

    getChannels() {
        return this.#channels;
    }

    addChannel(channel) {
        this.#channels = [...this.#channels, channel];
    }

}