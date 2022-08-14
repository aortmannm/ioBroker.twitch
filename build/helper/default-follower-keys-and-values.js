"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var default_follower_keys_and_values_exports = {};
__export(default_follower_keys_and_values_exports, {
  defaultFollowerKeysAndValues: () => defaultFollowerKeysAndValues
});
module.exports = __toCommonJS(default_follower_keys_and_values_exports);
const defaultFollowerKeysAndValues = {
  online: {
    defaultValue: false,
    findIn: "type",
    description: "Online status",
    type: "boolean"
  },
  viewer: {
    defaultValue: 0,
    findIn: "viewer_count",
    description: "Count of Viewers",
    type: "number"
  },
  thumbnailUrl: {
    defaultValue: "",
    findIn: "thumbnail_url",
    description: "Thumbnail Url",
    type: "string"
  },
  game: {
    defaultValue: "",
    findIn: "game_name",
    description: "Game name",
    type: "string"
  },
  title: {
    defaultValue: "",
    findIn: "title",
    description: "Title",
    type: "string"
  },
  startedAt: {
    defaultValue: "",
    findIn: "started_at",
    description: "UTC Timestamp when Stream started",
    type: "string"
  },
  language: {
    defaultValue: "",
    findIn: "language",
    description: "Language",
    type: "string"
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defaultFollowerKeysAndValues
});
//# sourceMappingURL=default-follower-keys-and-values.js.map
