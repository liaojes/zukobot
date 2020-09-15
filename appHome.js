/*
 * Home View
 */

const updateView = async (event, ping) => {
  if (!event.view) {
    return "";
  }
  console.log("initial", ping);
  const initial_option = {
    text: {
      type: "plain_text",
      emoji: true,
      text: "Once a day",
    },
    value: "1",
  };
  // App Home Display
  let blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: ":wave: Hi there, my favorite human :heart:",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "\n\n\nThis is *Zuko Bot*, your favorite pup in *_bot form_* :scream_cat:\n\n_Through Zuko Bot, you can..._",
      },
      accessory: {
        type: "image",
        image_url: "https://app.yukichiko.com/static/IMG_3589.JPG",
        alt_text: "cute cat",
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      block_id: "ping_preference",
      text: {
        type: "mrkdwn",
        text:
          ":clock2:  *Receive pings from you're favorite  :dog:*\n\nI'll message you at random times during the day to remind you of me!",
      },
      accessory: {
        type: "static_select",
        action_id: "ping_preference_option",
        placeholder: {
          type: "plain_text",
          emoji: true,
          text: "Manage Frequency",
        },
        initial_option,
        options: [
          {
            text: {
              type: "plain_text",
              emoji: true,
              text: "Once a day",
            },
            value: "1",
          },
          {
            text: {
              type: "plain_text",
              emoji: true,
              text: "Twice a day",
            },
            value: "2",
          },
          {
            text: {
              type: "plain_text",
              emoji: true,
              text: "Three times a day",
            },
            value: "3",
          },
          {
            text: {
              type: "plain_text",
              emoji: true,
              text: "None",
            },
            value: "0",
          },
        ],
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:speech_balloon:  *<slack://app?team=${event.view.team_id}&id=${event.view.app_id}&tab=messages|Chat me> anytime*  :smiley: \n\nI'm always here for you. Chat me anytime in the <slack://app?team=${event.view.team_id}&id=${event.view.app_id}&tab=messages|message tab> and I'll respond with photos of me to brighten your day! :sunny:`,
      },
      accessory: {
        type: "image",
        image_url:
          "https://www.nicepng.com/png/detail/22-223232_speech-bubble-icon-blue.png",
        alt_text: "Talk to me!",
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          ":heart:  *Receive private messages from me anytime, anywhere in Slack  :slack:*\n\nToo lazy to jump to Zuko Bot but still want to see my beautiful face? Use the `/zuko` slash command in any channel I'll send you love through a hidden message just for you",
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          ":heavy_plus_sign:  *Augment my database*  :frame_with_picture:\n\nUpload more photos of me or _Yuk-isms_ (aka things I say) to be used when I chat with you using the `/zuko add` slash command",
      },
      accessory: {
        type: "image",
        image_url:
          "https://icon-library.com/images/database-png-icon/database-png-icon-0.jpg",
        alt_text: "Add more photos of me!",
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "_Ready to start?!_",
      },
      accessory: {
        type: "button",
        action_id: "message_me",
        text: {
          type: "plain_text",
          text: "Send Me a Message",
          emoji: true,
        },
        style: "primary",
        value: "message_me",
      },
    },
  ];

  let view = {
    type: "home",
    callback_id: "home_view",
    title: {
      type: "plain_text",
      text: "Main View",
    },
    blocks: blocks,
  };

  return view;
};

/* Display App Home */
const createHome = async (event, ping) => {
  const userView = await updateView(event, ping);

  return userView;
};

/* Open a modal */
const openModal = () => {
  const modal = {
    type: "modal",
    callback_id: "modal_view",
    title: {
      type: "plain_text",
      text: "Augment My Database",
    },
    submit: {
      type: "plain_text",
      text: "Add",
    },
    blocks: [
      {
        type: "input",
        element: {
          type: "plain_text_input",
          action_id: "add_saying",
          placeholder: {
            type: "plain_text",
            text: "What do I say?",
          },
        },
        label: {
          type: "plain_text",
          text: "Zukism Saying",
        },
      },
      {
        type: "input",
        element: {
          type: "plain_text_input",
          action_id: "add_photo",
          placeholder: {
            type: "plain_text",
            text: "https://app.yukichiko.com/static/pic.JPG",
          },
        },
        label: {
          type: "plain_text",
          text: "Photo of Me URL",
          emoji: true,
        },
      },
    ],
  };

  return modal;
};

module.exports = { createHome, openModal };
