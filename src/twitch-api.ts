export class TwitchApi {
    private authToken: string;
    private username: string;
    private userId = 0;
    public constructor(authToken: string, username: string) {
        this.authToken = authToken;
        this.username = username;

        this.initialize();
    }

    private initialize() {
        this.userId = this.getUserId();
    }

    public getFollowers() {}

    private getUserId(): number {
        return 1;
    }
}
