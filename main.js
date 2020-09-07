require("reflect-metadata");
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const appHome = require("./appHome");
const cron = require("node-cron");
const { createConnection } = require("typeorm");
const { App, ExpressReceiver } = require("@slack/bolt");

const { User } = require("./models/User");
const { Ping } = require("./models/Ping");

const appId = "A01ABCY8TJQ";
const teamId = "T019X9L8ATB";

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
  const connection = await createConnection({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: 5432,
    username: "postgres",
    password: process.env.POSTGRES_PASSWORD,
    database: "yukibot",
    entities: [require("./entity/PingSchema"), require("./entity/UserSchema")],
    synchronize: true,
    logging: true,
  });

  const pingRepository = connection.getRepository(Ping);
  const userRepository = connection.getRepository(User);

  // Start the app
  const port = process.env.PORT || 3000;
  await app.start(port);

  //   app.event(eventType, fn);

  app.event("app_home_opened", async ({ event, context, payload }) => {
    //Display app home
    const ping = await pingRepository.find({
      where: { user: { id: event.user } },
    });
    const homeView = await appHome.createHome(event, ping);
    const user = new User();
    user.id = event.user;
    user.channel = event.channel;
    try {
      const result = await app.client.views.publish({
        token: context.botToken,
        user_id: event.user,
        view: homeView,
      });
      await userRepository.save(user);
    } catch (e) {
      app.error(e);
    }
  });

  // Receive button action from App Home UI "Send Me a Message"
  app.action("message_me", async ({ body, context, ack }) => {
    ack();

    // Open a modal window with forms to be submitted by a user
    console.log("jere");
    const view = appHome.openModal();
    console.log("jere2");

    try {
      const result = await app.client.views.open({
        token: context.botToken,
        trigger_id: body.trigger_id,
        view: view,
      });
    } catch (e) {
      console.log(e);
      app.error(e);
    }
  });

  app.action("ping_preference_option", async ({ ack, body, view, client }) => {
    await ack();

    // Open a modal window with forms to be submitted by a user
    console.log("bere");
    const user = await userRepository.find({
      where: {
        id: body.user.id,
      },
    });

    console.log(user);

    const ping = new Ping();
    ping.user = user[0];
    ping.interval = body.actions[0].selected_option.value;

    await pingRepository.save(ping);
    console.log(body);

    console.log("bere2");
  });

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
          image_url: `https://app.yukichiko.com/static/${img}`,
          alt_text: "marg",
        },
      ],
    });
  });

  console.log(`⚡️ Bolt app is running on ${port}`);

  cron.schedule("* * * * *", async () => {
    console.log("running a task every minute");
    const client = app.client;
    const pings = await pingRepository.find({ relations: ["user"] });
    console.log("PINGS:", pings);
    for (const ping of pings) {
      const user = ping.user;
      console.log(user, ping);
      const result = await client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: user.channel,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: randomElement(sayings),
            },
          },
          {
            type: "image",
            image_url: `https://app.yukichiko.com/static/${randomElement(
              files
            )}`,
            alt_text: "marg",
          },
        ],
      });
      console.log("RESULT", result);
    }
  });
})();

module.exports = { app };

app.error((error) => {
  // Check the details of the error to handle special cases (such as stopping the app or retrying the sending of a message)
  console.error(error);
});

async function logEvent({ payload, event, next }) {
  console.log("payload:", payload, "\n\nevent:", event);
  const startTimeMs = Date.now();

  await next();

  const endTimeMs = Date.now();
  console.log(`Total processing time: ${endTimeMs - startTimeMs}`);
}

app.use(logEvent);

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}
