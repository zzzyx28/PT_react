// This simulates data returned from an actual API
export const getFeaturedTorrents = () => {
    return Promise.resolve([
      {
        id: 1,
        title: 'Popular Movie Torrent 11',
        description: 'A short description of the torrent file and its contents.',
      },
      {
        id: 2,
        title: 'Popular TV Show Torrent 2',
        description: 'A brief description of the TV show episode torrent.',
      },
      {
        id: 3,
        title: 'Latest Music Album Torrent',
        description: 'A description of the latest music album being shared.',
      },
    ]);
  };
  