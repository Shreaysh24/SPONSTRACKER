// usePubNub.js
import PubNub from "pubnub";

export let pubnub = null;

export const initPubNub = (uuid) => {
  if (!pubnub && uuid) {
    pubnub = new PubNub({
      publishKey: process.env.NEXT_PUBLIC_PUB_KEY,
      subscribeKey: process.env.NEXT_PUBLIC_SUB_KEY,
      uuid,
    });
  }
};

export const sendMessagePubNub = (channel, message) => {
  if (!pubnub) throw new Error("PubNub not initialized.");

  return new Promise((resolve, reject) => {
    pubnub.publish({ channel, message }, (status, response) => {
      if (status.error) {
        console.error("PubNub publish error:", status);
        reject(status);
      } else {
        resolve(response);
      }
    });
  });
};

export const subscribeToChannel = (channel, callback, uuid) => {
  initPubNub(uuid);
  pubnub.subscribe({ channels: [channel] });

  pubnub.addListener({
    message: (event) => {
      callback(event.message);
    },
  });
};
