require("dotenv").config();

const accountSid = "AC8aa1a1a39e712c53990d60d6d8c394f1";
const authtoken = "5db5215accea6f23e0cb087293664775";

const client = require("twilio")(accountSid, authtoken);

const sendSMS = async (body) => {
  let msgOptions = {
    from: "+18653441673",
    to: "+919833921091",
    body: "hello my self dev ally",
  };
  try {
    const message = await client.messages.create(msgOptions);
    console.log(message);
  } catch (error) {
    console.log(error);
  }
};
sendSMS("hello fom devally");
