import { DiscordCaller } from "./DiscordCaller.js";
import { readCallers, writeCallers } from "./callers.js";
import express from "express";

let callers = [];

export const API_URL = "https://discord-caller-api.herokuapp.com/";

const json = readCallers();

json.forEach((caller) => {
    callers = [
        ...callers,
        new DiscordCaller(caller.userToken, caller.channels),
    ];
});

const app = express();

app.use(express.json());

app.post("/caller", (req, res) => {
    const caller = req.body;

    const existingCaller = callers.find(
        (c) => c?.getUserToken() === caller?.userToken
    );
    if (existingCaller) {
        existingCaller.addChannel(caller?.channel);
        writeCallers(callers);
        return res.json({
            userToken: existingCaller.getUserToken(),
            channels: existingCaller.getChannels(),
        });
    }

    callers = [
        ...callers,
        new DiscordCaller(caller.userToken, [caller.channel]),
    ];
    writeCallers(callers);
    return res.json({
        userToken: caller.userToken,
        channels: [caller.channel],
    });
});

app.get("/caller/:userToken", (req, res) => {
    const caller = callers.find(
        (c) => c?.getUserToken() === req.params.userToken
    );

    if (!caller)
        return res.status(404).json({ status: 404, message: "Not found" });

    return res.json({
        userToken: caller.getUserToken(),
        channels: caller.getChannels(),
        channelCount: caller.getChannels().length,
    });
});

app.listen(process.env.PORT || 9000);

// keep alive
setInterval(() => {
    fetch(API_URL)
        .then((res) => res.json())
        .then(console.log);
}, 1000 * 60 * 25);
