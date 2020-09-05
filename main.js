require("dotenv").config();
const { App } = require("@slack/bolt");

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  //   app.event(eventType, fn);
  app.event("app_home_opened", ({ event, say }) => {
    say(`Hello world, <@${event.user}>!`);
  });

  console.log("⚡️ Bolt app is running!");
})();
