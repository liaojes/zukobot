const EntitySchema = require("typeorm").EntitySchema;
const Ping = require("../models/Ping").Ping;
const User = require("../models/User").User;

module.exports = new EntitySchema({
  name: "Ping",
  target: Ping,
  columns: {
    interval: {
      type: "text",
    },
  },
  relations: {
    user: {
      target: "User",
      type: "one-to-one",
      cascade: true,
      eager: true,
      joinColumn: "userId",
      primary: true,
    },
  },
});
