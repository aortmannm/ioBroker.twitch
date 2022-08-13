import { default as axios } from 'axios';
import { IFollower } from './interfaces/follower.interface';

const CLIENT_ID = 'obgkb95iqahks1jtlzu4unrjvaq205';

export class TwitchApi {
    private authToken: string;
    private username: string;
    private userId = '';
    private logger: ioBroker.Logger;
    private defaultHeaderOptions: { Authorization: string; 'Client-Id': string };

    public constructor(authToken: string, username: string, logger: ioBroker.Logger) {
        this.authToken = authToken;
        this.username = username;
        this.logger = logger;

        this.defaultHeaderOptions = {
            Authorization: `Bearer ${this.authToken}`,
            'Client-Id': CLIENT_ID,
        };
    }

    public async initialize(): Promise<void> {
        this.userId = await this.getUserId();
    }

    private getUserId(): Promise<string> {
        const userInformationUrl = 'https://api.twitch.tv/helix/users';
        return axios
            .get(userInformationUrl, {
                headers: {
                    ...this.defaultHeaderOptions,
                    login: this.username,
                },
            })
            .then((res) => {
                return res.data.data[0].id;
            })
            .catch((err) => {
                this.logger.error(`Error while getting user id: ${err}`);
            });
    }

    public async getFollowers(followers: Array<IFollower> = [], paginationCursor?: string): Promise<Array<IFollower>> {
        let followerUrl = `https://api.twitch.tv/helix/users/follows?from_id=${this.userId}&first=100`;
        if (paginationCursor) {
            followerUrl = `https://api.twitch.tv/helix/users/follows?from_id=${this.userId}&first=100&after=${paginationCursor}`;
        }

        return axios
            .get(followerUrl, {
                headers: {
                    ...this.defaultHeaderOptions,
                },
            })
            .then((res) => {
                followers = [...followers, ...res.data.data];

                if (res.data.pagination.cursor) {
                    this.logger.debug('Loading next page');
                    return this.getFollowers(followers, res.data.pagination.cursor);
                } else {
                    return followers;
                }
            })
            .catch((err) => {
                this.logger.error(`Couldn't retreive list of the channels you follow ${err}`);
                return followers;
            });
    }

    public getLiveStatus(): void {}
}
