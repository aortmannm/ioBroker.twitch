"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var twitch_api_exports = {};
__export(twitch_api_exports, {
  TwitchApi: () => TwitchApi
});
module.exports = __toCommonJS(twitch_api_exports);
var import_axios = __toESM(require("axios"));
const CLIENT_ID = "obgkb95iqahks1jtlzu4unrjvaq205";
class TwitchApi {
  constructor(authToken, username, logger) {
    this.userId = "";
    this.authToken = authToken;
    this.username = username;
    this.logger = logger;
    this.defaultHeaderOptions = {
      Authorization: `Bearer ${this.authToken}`,
      "Client-Id": CLIENT_ID
    };
  }
  async initialize() {
    this.userId = await this.getUserId();
  }
  getUserId() {
    const userInformationUrl = "https://api.twitch.tv/helix/users";
    return import_axios.default.get(userInformationUrl, {
      headers: {
        ...this.defaultHeaderOptions,
        login: this.username
      }
    }).then((res) => {
      return res.data.data[0].id;
    }).catch((err) => {
      this.logger.error(`Error while getting user id: ${err}`);
    });
  }
  async getFollowers(followers = [], paginationCursor) {
    let followerUrl = `https://api.twitch.tv/helix/users/follows?from_id=${this.userId}&first=100`;
    if (paginationCursor) {
      followerUrl = `https://api.twitch.tv/helix/users/follows?from_id=${this.userId}&first=100&after=${paginationCursor}`;
    }
    return import_axios.default.get(followerUrl, {
      headers: {
        ...this.defaultHeaderOptions
      }
    }).then((res) => {
      followers = [...followers, ...res.data.data];
      if (res.data.pagination.cursor) {
        this.logger.debug("Loading next page");
        return this.getFollowers(followers, res.data.pagination.cursor);
      } else {
        return followers;
      }
    }).catch((err) => {
      this.logger.error(`Couldn't retreive list of the channels you follow ${err}`);
      return followers;
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TwitchApi
});
//# sourceMappingURL=twitch-api.js.map
