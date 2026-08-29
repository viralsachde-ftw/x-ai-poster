const { TwitterApi } = require('twitter-api-v2');

let client = null;

function getClient() {
  if (!client) {
    client = new TwitterApi({
      appKey: process.env.X_API_KEY,
      appSecret: process.env.X_API_SECRET,
      accessToken: process.env.X_ACCESS_TOKEN,
      accessSecret: process.env.X_ACCESS_SECRET,
    });
  }
  return client;
}

async function postTweet(text) {
  const twitter = getClient();
  const result = await twitter.v2.tweet(text);
  return result;
}

module.exports = { postTweet };
