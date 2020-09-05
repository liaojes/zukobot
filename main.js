require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const { App, ExpressReceiver } = require("@slack/bolt");

const files = fs.readdirSync(path.join(__dirname, "pics"));
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
    say({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "Ma, *feed me*",
          },
        },
        {
          type: "image",
          title: {
            type: "plain_text",
            text: "Ma, *feed me*",
            emoji: true,
          },
          image_url:
            "https://assets3.thrillist.com/v1/image/1682388/size/tl-horizontal_main.jpg",
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
