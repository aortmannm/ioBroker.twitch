"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var utils = __toESM(require("@iobroker/adapter-core"));
var import_default_follower_keys_and_values = require("./helper/default-follower-keys-and-values");
var import_twitch_api = require("./lib/twitch-api");
const UPDATE_INTERVAL_IN_MILLISECONDS = 6e4;
class Twitch extends utils.Adapter {
  constructor(options = {}) {
    super({
      ...options,
      name: "twitch"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    if (!this.config.authToken) {
      this.log.error("Auth token is empty - please check instance configuration");
      return;
    }
    if (!this.config.username) {
      this.log.error("Username is empty - please check instance configuration");
      return;
    }
    this.twitchApi = new import_twitch_api.TwitchApi(this.config.authToken, this.config.username, this.log);
    try {
      await this.twitchApi.initialize();
    } catch (err) {
      await this.setStateAsync("info.connection", { val: false, ack: true });
      this.log.error(err);
      return;
    }
    await this.setStateAsync("info.connection", { val: true, ack: true });
    await this.createFolder("channels", "Followed Twitch Channels");
    this.updateFollowersInStore();
    this.setInterval(() => {
      this.updateFollowersInStore();
    }, UPDATE_INTERVAL_IN_MILLISECONDS);
  }
  async updateFollowersInStore() {
    this.log.debug("Updating Twich followers");
    const [followers, liveStreams] = await Promise.all([
      this.twitchApi.getFollowers(),
      this.twitchApi.getLiveStreamsIFollow()
    ]);
    if (!followers || followers.length === 0) {
      return;
    }
    await this.cleanUpOldFollowers(followers);
    for (const follower of followers) {
      const followerName = follower.broadcaster_name;
      const streamStatus = liveStreams.find((stream) => {
        return stream.user_name === followerName;
      });
      const followerChannelId = `channels.${followerName}`;
      await this.createFolder(followerChannelId, "Followed Twitch Channel", followerName);
      await this.createOrUpdateStates(followerChannelId, streamStatus);
    }
  }
  async cleanUpOldFollowers(followers) {
    const channels = await this.getChannelsAsync("channels");
    const channelsToDelete = channels.filter((channel) => {
      return !followers.find((follower) => {
        return follower.broadcaster_name === channel.native.twitchName;
      });
    });
    for (const channelToDelete of channelsToDelete) {
      this.log.debug(`Cleaning up unfollowed channel: ${channelToDelete._id}`);
      await this.deleteChannelAsync("channels", channelToDelete._id);
    }
  }
  async createFolder(id, name, followerName) {
    await this.setObjectNotExistsAsync(id, {
      type: "channel",
      common: {
        name
      },
      native: {
        twitchName: followerName
      }
    });
  }
  async createOrUpdateStates(followerId, stream) {
    for (const [stateNameInStore, defaultValuesAndLocation] of Object.entries(import_default_follower_keys_and_values.defaultFollowerKeysAndValues)) {
      const stateName = `${followerId}.${stateNameInStore}`;
      await this.setObjectNotExistsAsync(stateName, {
        type: "state",
        common: {
          name: defaultValuesAndLocation.description,
          type: defaultValuesAndLocation.type,
          role: "indicator",
          read: true,
          write: false
        },
        native: {}
      });
      let value = defaultValuesAndLocation.defaultValue;
      if (stream) {
        if (stateNameInStore === "online") {
          value = true;
        } else {
          value = stream[defaultValuesAndLocation.findIn];
        }
      }
      await this.setStateAsync(stateName, { val: value, ack: true });
    }
  }
  onUnload(callback) {
    try {
      this.setState("info.connection", { val: false, ack: true });
      callback();
    } catch (e) {
      callback();
    }
  }
  onStateChange(id, state) {
    if (state) {
      this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
    } else {
      this.log.info(`state ${id} deleted`);
    }
  }
}
if (require.main !== module) {
  module.exports = (options) => new Twitch(options);
} else {
  (() => new Twitch())();
}
//# sourceMappingURL=main.js.map
