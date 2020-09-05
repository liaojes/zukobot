require("dotenv").config();
const { App } = require("@slack/bolt");

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

(async () => {
  // Start the app
  const port = process.env.PORT || 3000;
  await app.start(port);

  //   app.event(eventType, fn);

  app.event("message.app_home", ({ event, say }) => {
    say(`Hello world, <@${event.user}>!`);
  });

  console.log(`⚡️ Bolt app is running on ${port}`);
})();

app.error((error) => {
  // Check the details of the error to handle special cases (such as stopping the app or retrying the sending of a message)
  console.error(error);
});

async function logEvent({ payload, context, next }) {
  console.log(`payload: ${payload}\ncontext: ${context}`);
  const startTimeMs = Date.now();

  await next();

  const endTimeMs = Date.now();
  console.log(`Total processing time: ${endTimeMs - startTimeMs}`);
}

app.use(logEvent);
