require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const { App, ExpressReceiver } = require("@slack/bolt");

const files = fs.readdirSync(path.join(__dirname, "pics"));
const sayings = JSON.parse(
  fs.readFileSync(path.join(__dirname, "zukisms.json"))
);
console.log(files);

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
  receiver,
  token: process.env.SLACK_BOT_TOKEN,
});

receiver.router.use("/static", express.static(path.join(__dirname, "pics")));

(async () => {
  // Start the app
  const port = process.env.PORT || 3000;
  await app.start(port);

  //   app.event(eventType, fn);

  app.event("message", ({ event, say }) => {
    //console.log(event);
    //say(`Hello world, <@${event.user}>!`);
    const img = randomElement(files);
    const saying = randomElement(sayings);

    say({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: saying,
          },
        },
        {
          type: "image",
          title: {
            type: "plain_text",
            text: saying,
            emoji: true,
          },
          image_url: `https://yuchiko-bot.herokuapp.com/static/${img}`,
          alt_text: "marg",
        },
      ],
    });
  });

  console.log(`⚡️ Bolt app is running on ${port}`);
})();

app.error((error) => {
  // Check the details of the error to handle special cases (such as stopping the app or retrying the sending of a message)
  console.error(error);
});

async function logEvent({ payload, context, next }) {
  console.log("payload:", payload, "\n\ncontext:", context);
  const startTimeMs = Date.now();

  await next();

  const endTimeMs = Date.now();
  console.log(`Total processing time: ${endTimeMs - startTimeMs}`);
}

app.use(logEvent);

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}
