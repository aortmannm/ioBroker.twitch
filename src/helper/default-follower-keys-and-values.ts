export const defaultFollowerKeysAndValues = {
    viewer: {
        defaultValue: 0,
        findIn: 'viewer_count',
        description: 'Count of Viewers',
        type: 'number',
    },
    thumbnailUrl: {
        defaultValue: '',
        findIn: 'thumbnail_url',
        description: 'Thumbnail Url',
        type: 'string',
    },
    game: {
        defaultValue: '',
        findIn: 'game_name',
        description: 'Game name',
        type: 'string',
    },
    title: {
        defaultValue: '',
        findIn: 'title',
        description: 'Title',
        type: 'string',
    },
    startedAt: {
        defaultValue: '',
        findIn: 'started_at',
        description: 'UTC Timestamp when Stream started',
        type: 'string',
    },
    language: {
        defaultValue: '',
        findIn: 'language',
        description: 'Language',
        type: 'string',
    },
    online: {
        defaultValue: false,
        findIn: 'type',
        description: 'Online status',
        type: 'boolean',
    },
};
