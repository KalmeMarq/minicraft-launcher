import { invoke } from '@tauri-apps/api';
import React, { createContext, useEffect, useState } from 'react';
import { generateRandomStr } from '../utils';

export interface INews {
  id: string;
  title: string;
  tag?: string;
  category?: 'Minecraft: Java Edition' | 'Minecraft Dungeons' | 'Minecraft for Windows' | 'Minecraft Legends';
  date: string;
  readMoreLink: string;
  newsType?: ('News page' | 'Java' | 'Dungeons' | 'Bedrock' | 'Legends')[];
  cardBorder?: boolean;
  newsPageImage: {
    url: string;
    title: string;
  };
  text?: string;
  linkButton?: {
    kind: string;
    label: string;
    url: string;
  };
  playPageImage?: {
    url: string;
    title: string;
  };
}

export interface INewsForum {
  id: string;
  title: string;
  date: string;
  readMoreLink: string;
  newsPageImage: {
    url: string;
    title: string;
  };
}

export function parseForumNews(rawDoc: string) {
  const doc = new DOMParser().parseFromString(rawDoc, 'text/xml');
  const channel = doc.getElementsByTagName('channel')[0];

  const news: INewsForum[] = [];

  for (const item of channel.getElementsByTagName('item')) {
    const title = item.getElementsByTagName('title')[0].textContent;
    const date = item.getElementsByTagName('pubDate')[0].textContent;
    const readMoreLink = item.getElementsByTagName('link')[0].textContent;

    const imageUrl = item.getAttribute('image');
    if (title && date && readMoreLink && imageUrl) {
      news.push({
        id: generateRandomStr(22, (date.substring(0, 9) + title.substring(0, title.length > 5 ? 5 : title.length) + readMoreLink.substring(readMoreLink.length - 8, readMoreLink.length)).replaceAll(' ', '')),
        title,
        date,
        readMoreLink,
        newsPageImage: {
          url: imageUrl,
          title
        }
      });
    }
  }

  return news;
}

export function parseTopNews(rawDoc: string): INews[] {
  const doc = new DOMParser().parseFromString(rawDoc, 'text/xml');
  const channel = doc.getElementsByTagName('channel')[0];

  const news: INews[] = [];

  for (const item of channel.getElementsByTagName('item')) {
    const title = item.getElementsByTagName('title')[0].textContent;
    const date = item.getElementsByTagName('pubDate')[0].textContent;
    const readMoreLink = item.getElementsByTagName('link')[0].textContent;

    const imageUrl = item.getElementsByTagName('media:content')[0].getAttribute('url');
    if (title && date && readMoreLink && imageUrl) {
      news.push({
        id: generateRandomStr(22, (date.substring(0, 9) + title.substring(0, title.length > 5 ? 5 : title.length) + readMoreLink.substring(readMoreLink.length - 8, readMoreLink.length)).replaceAll(' ', '')),
        title,
        date,
        readMoreLink,
        newsPageImage: {
          url: imageUrl,
          title
        }
      });
    }
  }

  return news;
}

export const NewsContext = createContext<{
  minecraft: INews[];
  minecraftForum: INews[];
  minecraftTop: INews[];
  lastSeenMCNews: boolean;
  lastSeenMCFNews: boolean;
  lastSeenMCTNews: boolean;
  setLastSeenMCNews: (val: boolean) => void;
  setLastSeenMCFNews: (val: boolean) => void;
  setLastSeenMCTNews: (val: boolean) => void;
}>({
  minecraft: [],
  minecraftForum: [],
  minecraftTop: [],
  lastSeenMCNews: true,
  lastSeenMCTNews: true,
  lastSeenMCFNews: true,
  setLastSeenMCFNews(val) {},
  setLastSeenMCNews(val) {},
  setLastSeenMCTNews(val) {}
});

export const NewsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [minecraftNews, setMinecraftNews] = useState<INews[]>([]);
  const [minecraftForumNews, setMinecraftForumNews] = useState<INews[]>([]);
  const [minecraftTopNews, setMinecraftTopNews] = useState<INews[]>([]);

  const [lastSeenMCNews, setLastSeenMCNews] = useState(minecraftNews.length > 0 && (localStorage.getItem('lastMCNewId') == null || localStorage.getItem('lastMCNewId') !== minecraftNews[0].id));
  const [lastSeenMCFNews, setLastSeenMCFNews] = useState(minecraftForumNews.length > 0 && (localStorage.getItem('lastMCFNewId') == null || localStorage.getItem('lastMCFNewId') !== minecraftForumNews[0].id));
  const [lastSeenMCTNews, setLastSeenMCTNews] = useState(minecraftTopNews.length > 0 && (localStorage.getItem('lastMCTNewId') == null || localStorage.getItem('lastMCTNewId') !== minecraftTopNews[0].id));

  useEffect(() => {
    if (minecraftNews.length === 0) {
      invoke('get_news_minecraft').then((data) => {
        let d = (data as { entries: INews[] }).entries;
        setMinecraftNews(d);
        setLastSeenMCNews(d.length > 0 && (localStorage.getItem('lastMCNewId') == null || localStorage.getItem('lastMCNewId') !== d[0].id));
      });
    }

    if (minecraftForumNews.length === 0) {
      invoke('get_news_minecraft_forum').then((rawDoc) => {
        let d = parseForumNews(rawDoc as string) as INews[];
        setMinecraftForumNews(d);
        setLastSeenMCTNews(d.length > 0 && (localStorage.getItem('lastMCFNewId') == null || localStorage.getItem('lastMCFNewId') !== d[0].id));
      });
    }

    if (minecraftTopNews.length === 0) {
      invoke('get_news_minecraft_top').then((rawDoc) => {
        let d = parseTopNews(rawDoc as string) as INews[];
        setMinecraftTopNews(d);
        setLastSeenMCTNews(d.length > 0 && (localStorage.getItem('lastMCTNewId') == null || localStorage.getItem('lastMCTNewId') !== d[0].id));
      });
    }
  }, []);

  return (
    <NewsContext.Provider
      value={{
        lastSeenMCFNews,
        lastSeenMCTNews,
        lastSeenMCNews,
        minecraft: minecraftNews,
        minecraftForum: minecraftForumNews,
        minecraftTop: minecraftTopNews,
        setLastSeenMCFNews: (val) => {
          setLastSeenMCFNews(val);
        },
        setLastSeenMCTNews: (val) => {
          setLastSeenMCTNews(val);
        },
        setLastSeenMCNews: (val) => {
          setLastSeenMCNews(val);
        }
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};
