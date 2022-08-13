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
    this.log.info("Auth token: " + this.config.authToken);
    this.log.info("Twitch Username: " + this.config.username);
    this.twitchApi = new import_twitch_api.TwitchApi(this.config.authToken, this.config.username, this.log);
    try {
      await this.twitchApi.initialize();
      await this.setStateAsync("info.connection", { val: true, ack: true });
    } catch (err) {
      await this.setStateAsync("info.connection", { val: false, ack: true });
    }
    this.updateFollowersInStore();
  }
  async updateFollowersInStore() {
    var _a;
    const followers = await ((_a = this.twitchApi) == null ? void 0 : _a.getFollowers());
    if (!followers) {
      return;
    }
    if (followers.length > 0) {
      await this.createFolder("channels", "Followed Twitch Channels");
    }
    for (const follower of followers) {
      const followerId = `channels.${follower.to_name}`;
      await this.createFolder(followerId, "Followed Twitch Channel");
      await this.createOrUpdateState(followerId);
    }
  }
  async createFolder(id, name) {
    await this.setObjectNotExistsAsync(id, {
      type: "channel",
      common: {
        name
      },
      native: {}
    });
  }
  async createOrUpdateState(followerId) {
    await this.createStateAsync(followerId, followerId, "online");
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
