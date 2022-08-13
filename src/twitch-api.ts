import { default as axios } from 'axios';

const CLIENT_ID = 'obgkb95iqahks1jtlzu4unrjvaq205';

export class TwitchApi {
    private authToken: string;
    private username: string;
    private userId = '';
    logger: ioBroker.Logger;
    public constructor(authToken: string, username: string, logger: ioBroker.Logger) {
        this.authToken = authToken;
        this.username = username;
        this.logger = logger;
    }

    public async initialize(): Promise<void> {
        this.userId = await this.getUserId();
    }

    public async getFollowers(): Promise<any> {}

    private getUserId(): Promise<string> {
        const userInformationUrl = 'https://api.twitch.tv/helix/users';
        return axios
            .get(userInformationUrl, {
                headers: {
                    login: this.username,
                    Authorization: `Bearer ${this.authToken}`,
                    'Client-Id': CLIENT_ID,
                },
            })
            .then((res) => {
                return res.data.data[0].id;
            })
            .catch((err) => {
                this.logger.error(`Error while getting user id: ${err}`);
            });
    }
}
