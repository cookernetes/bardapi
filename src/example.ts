import { config } from "dotenv";
import { BardAPI } from "./Bard.js";

config();

if (!process.env.TOKEN)
  throw new Error("No token provided in .env file with name TOKEN");

const bard = new BardAPI({
  sessionId: process.env.TOKEN,
});

const res = await bard.ask({ message: "Pick a random number" });
const res1choice2 = res.otherChoices[1];

const res2 = await bard.ask({
  message: "What number did you pick?",
  previousChoiceId: res.otherChoices[1].choiceId,
});

console.log({ res, res2 });
console.log(res.otherChoices);
console.log(res2.otherChoices);
