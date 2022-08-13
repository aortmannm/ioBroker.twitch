/*
 * Created with @iobroker/create-adapter v2.1.1
 */

import * as utils from '@iobroker/adapter-core';
import { IFollower } from './interfaces/follower.interface';
import { IStream } from './interfaces/stream.interface';
import { TwitchApi } from './lib/twitch-api';

const UPDATE_INTERVAL_IN_MILLISECONDS = 60000;

class Twitch extends utils.Adapter {
    private twitchApi: TwitchApi;
    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'twitch',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        if (!this.config.authToken) {
            this.log.error('Auth token is empty - please check instance configuration');
            return;
        }

        if (!this.config.username) {
            this.log.error('Username is empty - please check instance configuration');
            return;
        }

        this.twitchApi = new TwitchApi(this.config.authToken, this.config.username, this.log);

        try {
            await this.twitchApi.initialize();
            await this.setStateAsync('info.connection', { val: true, ack: true });
        } catch (err: any) {
            await this.setStateAsync('info.connection', { val: false, ack: true });
        }

        await this.createFolder('channels', 'Followed Twitch Channels');

        this.updateFollowersInStore();

        this.setInterval(() => {
            this.updateFollowersInStore();
        }, UPDATE_INTERVAL_IN_MILLISECONDS);
    }

    private async updateFollowersInStore(): Promise<void> {
        this.log.debug('Updating Twich followers');
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
            await this.createFolder(followerChannelId, 'Followed Twitch Channel', followerName);
            await this.createOrUpdateState(followerChannelId, follower, streamStatus);
        }
    }

    private async cleanUpOldFollowers(followers: Array<IFollower>): Promise<void> {
        const channels = await this.getChannelsAsync('channels');

        const channelsToDelete = channels.filter((channel) => {
            return !followers.find((follower: IFollower) => {
                return follower.to_name === channel.native.twitchName;
            });
        });

        for (const channelToDelete of channelsToDelete) {
            this.log.debug(`Cleaning up unfollowed channel: ${channelToDelete._id}`);
            await this.deleteChannelAsync('channels', channelToDelete._id);
        }
    }

    private async createFolder(id: string, name: string, followerName?: string): Promise<any> {
        await this.setObjectNotExistsAsync(id, {
            type: 'channel',
            common: {
                name: name,
            },
            native: {
                twitchName: followerName,
            },
        });
    }

    private async createOrUpdateState(
        followerId: string,
        follower: IFollower,
        stream: IStream | undefined,
    ): Promise<any> {
        const onlineStateId = `${followerId}.online`;
        await this.setObjectNotExistsAsync(onlineStateId, {
            type: 'state',
            common: {
                name: 'Online status',
                type: 'boolean',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });

        await this.setStateAsync(onlineStateId, { val: stream?.type === 'live' ? true : false, ack: true });

        const viewerStateId = `${followerId}.viewer`;
        await this.setObjectNotExistsAsync(viewerStateId, {
            type: 'state',
            common: {
                name: 'Count of Viewers',
                type: 'number',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });

        await this.setStateAsync(viewerStateId, { val: stream?.viewer_count ? stream.viewer_count : 0, ack: true });
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    private onUnload(callback: () => void): void {
        try {
            this.setState('info.connection', { val: false, ack: true });
            callback();
        } catch (e) {
            callback();
        }
    }

    /**
     * Is called if a subscribed state changes
     */
    private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
        if (state) {
            // The state was changed
            this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        } else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }
}

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new Twitch(options);
} else {
    // otherwise start the instance directly
    (() => new Twitch())();
}
