import fs from "fs";

export const readCallers = () => {
    const response = fs.readFileSync("./callers.json");
    return JSON.parse(response.toString());
}

export const writeCallers = (callers) => {
    callers = callers.map((c) => {
        return {
            userToken: c.getUserToken(),
            channels: c.getChannels()
        }
    })
    fs.writeFileSync("./callers.json", JSON.stringify(callers));
}