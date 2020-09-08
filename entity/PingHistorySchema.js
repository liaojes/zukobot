const EntitySchema = require("typeorm").EntitySchema;
const PingHistory = require("../models/PingHistory").PingHistory;
const User = require("../models/User").User;

module.exports = new EntitySchema({
  name: "PingHistory",
  target: PingHistory,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    ts: {
      type: "timestamp",
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      cascade: true,
      eager: true,
      joinColumn: true,
      inverseSide: "PingHistory",
    },
  },
});
