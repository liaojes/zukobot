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

  console.log(`⚡️ Bolt app is running on ${port}`);
})();

app.event("app_home_opened", ({ event, say }) => {
  say(`Hello world, <@${event.user}>!`);
});
