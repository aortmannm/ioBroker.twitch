/*
 * Created with @iobroker/create-adapter v2.1.1
 */

import * as utils from '@iobroker/adapter-core';
import { TwitchApi } from './lib/twitch-api';

class Twitch extends utils.Adapter {
    private twitchApi: TwitchApi | undefined;
    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'twitch',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        // this.on('objectChange', this.onObjectChange.bind(this));
        // this.on('message', this.onMessage.bind(this));
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

        this.log.info('Auth token: ' + this.config.authToken);
        this.log.info('Twitch Username: ' + this.config.username);

        this.twitchApi = new TwitchApi(this.config.authToken, this.config.username, this.log);

        try {
            await this.twitchApi.initialize();
            await this.setStateAsync('info.connection', { val: true, ack: true });
        } catch (err: any) {
            await this.setStateAsync('info.connection', { val: false, ack: true });
        }

        this.updateFollowersInStore();
    }

    private async updateFollowersInStore(): Promise<void> {
        const followers = await this.twitchApi?.getFollowers();
        if (!followers) {
            return;
        }

        if (followers.length > 0) {
            await this.createFolder('channels', 'Followed Twitch Channels');
        }

        for (const follower of followers) {
            const followerId = `channels.${follower.to_name}`;
            await this.createFolder(followerId, 'Followed Twitch Channel');
            await this.createOrUpdateState(followerId);
        }
    }

    private async createFolder(id: string, name: string): Promise<any> {
        await this.setObjectNotExistsAsync(id, {
            type: 'channel',
            common: {
                name: name,
            },
            native: {},
        });
    }

    private async createOrUpdateState(followerId: string): Promise<any> {
        await this.createStateAsync(followerId, followerId, 'online');
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
