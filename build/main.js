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
      await this.setStateAsync("info.connection", { val: true, ack: true });
    } catch (err) {
      await this.setStateAsync("info.connection", { val: false, ack: true });
    }
    await this.createFolder("channels", "Followed Twitch Channels");
    this.updateFollowersInStore();
    this.setInterval(() => {
      this.updateFollowersInStore();
    }, UPDATE_INTERVAL_IN_MILLISECONDS);
  }
  async updateFollowersInStore() {
    this.log.debug("Updating Twich followers");
    const followers = await this.twitchApi.getFollowers();
    if (!followers || followers.length === 0) {
      return;
    }
    await this.cleanUpOldFollowers(followers);
    const liveStreams = await this.twitchApi.getLiveStreamsIFollow();
    for (const follower of followers) {
      const followerName = follower.to_name;
      const streamStatus = liveStreams.find((stream) => {
        return stream.user_name === followerName;
      });
      const followerChannelId = `channels.${followerName}`;
      await this.createFolder(followerChannelId, "Followed Twitch Channel", followerName);
      await this.createOrUpdateState(followerChannelId, follower, streamStatus);
    }
  }
  async cleanUpOldFollowers(followers) {
    const channels = await this.getChannelsAsync("channels");
    const channelsToDelete = channels.filter((channel) => {
      return !followers.find((follower) => {
        return follower.to_name === channel.native.twitchName;
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
  async createOrUpdateState(followerId, follower, stream) {
    const onlineStateId = `${followerId}.online`;
    await this.setObjectNotExistsAsync(onlineStateId, {
      type: "state",
      common: {
        name: "Online status",
        type: "boolean",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
    await this.setStateAsync(onlineStateId, { val: (stream == null ? void 0 : stream.type) === "live" ? true : false, ack: true });
    const viewerStateId = `${followerId}.viewer`;
    await this.setObjectNotExistsAsync(viewerStateId, {
      type: "state",
      common: {
        name: "Count of Viewers",
        type: "number",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
    await this.setStateAsync(viewerStateId, { val: (stream == null ? void 0 : stream.viewer_count) ? stream.viewer_count : 0, ack: true });
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
