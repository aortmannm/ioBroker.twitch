<img src="admin/twitch.png" width="250">

# ioBroker.twitch

[![NPM version](https://img.shields.io/npm/v/iobroker.twitch.svg)](https://www.npmjs.com/package/iobroker.twitch)
[![Downloads](https://img.shields.io/npm/dm/iobroker.twitch.svg)](https://www.npmjs.com/package/iobroker.twitch)
![Number of Installations](https://iobroker.live/badges/twitch-installed.svg)

[![NPM](https://nodei.co/npm/iobroker.twitch.png?downloads=true)](https://nodei.co/npm/iobroker.twitch/)

**Tests:** ![Test and Release](https://github.com/aortmannm/ioBroker.twitch/workflows/Test%20and%20Release/badge.svg)

## Twitch adapter for ioBroker

Description and Configuration how to get the auth token is in the installed adapter instance.

Adapter to show Twitch information about the persons you follow.

Right now it can list all the Followers with the online status and viewer count. The online status and viewer count will update every 60 Seconds.

If you unfollow a person on twitch it will cleanup the channel and states in ioBroker with the update period.

## Coding examples

### Live notification for a Streamer

```
const VINI_ONLINE_STATE = 'twitch.0.channels.V1nKub.online';

on({ id: VINI_ONLINE_STATE, val: true, ack: true, change: 'ne' }, () => {
    sendTo('telegram.0', 'send', {
        text: 'V1nKub is live!',
    });
});
```

## Changelog

### 0.0.10 (2022-08-17)

-   (aortmannm) - Fixed translation bug and image link in description

### 0.0.9 (2022-08-14)

-   (aortmannm) - Added description to get the auth token in Instance Settings

### 0.0.8 (2022-08-14)

-   (aortmannm) - Added more stream information and updated the twitch logo

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
