const EntitySchema = require("typeorm").EntitySchema;
const User = require("../models/User").User;

module.exports = new EntitySchema({
  name: "User",
  target: User,
  columns: {
    id: {
      primary: true,
      type: "text",
    },
    name: {
      type: "text",
      nullable: true,
    },
    channel: {
      type: "text",
    },
  },
});
