import Discord from "discord.js";
import express from "express";

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

client.on("ready", () => {
    const app = express();
    app.use(express.json());

    app.post("/message", async (req, res) => {
        try {
            const channel = client.channels.cache.get(req.body.channel);
            const message = await channel.send(req.body.message);

            return res.json(message);
        } catch (ex) {
            return res.json({ status: "404", error: "Bad Request" });
        }
    });

    app.listen(process.env.PORT || 9000);
});

await client.login(process.env.DISCORD_TOKEN);
