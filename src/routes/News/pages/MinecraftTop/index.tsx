import { invoke } from '@tauri-apps/api';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import SearchBox from '../../../../components/SearchBox';
import { T } from '../../../../context/TranslationContext';
import { useTranslation } from '../../../../hooks/useTranslation';
import { formatDateNews, generateRandomStr } from '../../../../utils';
import { INewsForum } from '../Forum';

export function parseNews(rawDoc: string) {
  const doc = new DOMParser().parseFromString(rawDoc, 'text/xml');
  const channel = doc.getElementsByTagName('channel')[0];

  const news: INewsForum[] = [];

  for (const item of channel.getElementsByTagName('item')) {
    const title = item.getElementsByTagName('title')[0].textContent;
    const date = item.getElementsByTagName('pubDate')[0].textContent;
    const readMoreLink = item.getElementsByTagName('link')[0].textContent;

    const imageUrl = item.getElementsByTagName('media:content')[0].getAttribute('url');
    if (title && date && readMoreLink && imageUrl) {
      news.push({
        id: generateRandomStr(22),
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

const MinecraftTop: React.FC = () => {
  const { t } = useTranslation();

  const [news, setNews] = useState<INewsForum[]>([]);

  const [results, setResults] = useState(0);
  const [filterText, setFilterText] = useState('');
  const handleFilterTextChange = (value: string) => {
    setFilterText(value);
    if (value === '') setResults(0);
    if (value !== '') setResults(news.filter((v) => v.title.toLowerCase().includes(value.toLowerCase())).length);
  };

  useEffect(() => {
    if (news.length === 0) {
      invoke('get_news_minecraft_top').then((rawDoc) => {
        setNews(parseNews(rawDoc as string));
      });
    }
  }, []);

  return (
    <div className="mc-news forum">
      <div className="news-filters">
        <div className="news-filters-inside">
          <div className="search-filter">
            <p className="filter-name">
              <T>Search</T>
            </p>
            <SearchBox results={results} value={filterText} placeholder={t('News title')} handleFilter={handleFilterTextChange} />
          </div>
        </div>
      </div>
      <div style={{ width: '100%', background: 'var(--divider)', height: '1px' }}></div>
      <div className="news-list">
        <div className="news-list-inside">
          {news.map((n) => {
            return (
              <a className={classNames('news-item')} href={n.readMoreLink} target="_blank" key={n.id} style={{ display: 'block' }}>
                <div className="news-item-img">
                  <img src={n.newsPageImage.url} alt={n.newsPageImage.title} />
                </div>
                <div className="news-item-cont">
                  <h3>{n.title}</h3>
                  <div className="wrapper">
                    <span className="cat">Minecraft</span>
                    <span className="date">{formatDateNews(n.date)}</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MinecraftTop;
