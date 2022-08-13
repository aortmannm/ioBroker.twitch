![Logo](admin/twitch.png)

# ioBroker.twitch

[![NPM version](https://img.shields.io/npm/v/iobroker.twitch.svg)](https://www.npmjs.com/package/iobroker.twitch)
[![Downloads](https://img.shields.io/npm/dm/iobroker.twitch.svg)](https://www.npmjs.com/package/iobroker.twitch)
![Number of Installations](https://iobroker.live/badges/twitch-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/twitch-stable.svg)
[![Dependency Status](https://img.shields.io/david/Adrian Ortmann/iobroker.twitch.svg)](https://david-dm.org/Adrian Ortmann/iobroker.twitch)

[![NPM](https://nodei.co/npm/iobroker.twitch.png?downloads=true)](https://nodei.co/npm/iobroker.twitch/)

**Tests:** ![Test and Release](https://github.com/aortmannm/ioBroker.twitch/workflows/Test%20and%20Release/badge.svg)

## twitch adapter for ioBroker

Adapter to show Twitch information

Right now it can list all the Followers with the online status and viewer count. The online status and viewer count will update every 60 Seconds.

If you unfollow a person on twitch it will cleanup the channel and states in ioBroker but just every hour.

### **WORK IN PROGRESS**

## Changelog

### 0.0.7 (2022-08-13)

-   (aortmannm) - First release to test in own production system

### 0.0.6 (2022-08-13)

-   (aortmannm) - Folders for all channels are created

### 0.0.5 (2022-08-13)

-   (aortmannm) - Added recursive calls for twitch follower api and pagination

### 0.0.4 (2022-08-13)

-   (aortmannm) - First usage of twitch API - Got the twitch ID for future calls

### 0.0.3 (2022-08-13)

-   (aortmannm) - Some Cleanup

### 0.0.2 (2022-08-13)

-   (aortmannm) - Added Admin 5 configuration

### 0.0.1 (2022-08-09)

-   (aortmannm) - Initial commit

## License

MIT License

Copyright (c) 2022 Adrian Ortmann <aortmann.dev@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
