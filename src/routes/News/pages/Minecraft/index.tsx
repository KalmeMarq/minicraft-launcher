import { invoke } from '@tauri-apps/api';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import Checkbox from '../../../../components/Checkbox';
import SearchBox from '../../../../components/SearchBox';
import Select from '../../../../components/Select';
import { T } from '../../../../context/TranslationContext';
import { useTranslation } from '../../../../hooks/useTranslation';
import { formatDateNews } from '../../../../utils';
import './index.scss';

export interface INews {
  id: string;
  title: string;
  tag: string;
  category: 'Minecraft: Java Edition' | 'Minecraft Dungeons' | 'Minecraft for Windows' | 'Minecraft Legends';
  date: string;
  readMoreLink: string;
  newsType: ('News page' | 'Java' | 'Dungeons' | 'Bedrock' | 'Legends')[];
  cardBorder?: boolean;
  newsPageImage: {
    url: string;
    title: string;
  };
}

const Minecraft: React.FC = () => {
  const { t } = useTranslation();

  const [news, setNews] = useState<INews[]>([]);

  const [showJava, setShowJava] = useState(true);
  const [showBugrock, setShowBugrock] = useState(true);
  const [showDungeons, setShowDungeons] = useState(true);
  const [showLegends, setShowLegends] = useState(true);

  const [results, setResults] = useState(0);
  const [filterText, setFilterText] = useState('');
  const handleFilterTextChange = (value: string) => {
    setFilterText(value);
    if (value === '') setResults(0);
    if (value !== '') setResults(news.filter((v) => v.title.toLowerCase().includes(value.toLowerCase())).length);
  };

  useEffect(() => {
    if (news.length === 0) {
      invoke('get_news_minecraft').then((data) => {
        setNews((data as { entries: INews[] }).entries);
      });
    }
  }, []);

  return (
    <div className="mc-news">
      <div className="news-filters">
        <div className="news-filters-inside">
          <div className="search-filter">
            <p className="filter-name">
              <T>Search</T>
            </p>
            <SearchBox results={results} value={filterText} placeholder={t('News title')} handleFilter={handleFilterTextChange} />
          </div>
          <div className="filter-divider"></div>
          <div className="versions-filter">
            <p>
              <T>Categories</T>
            </p>
            <div className="versions-filter-wrapper">
              <Checkbox
                label={t('Minecraft: Java Edition')}
                id="versions/releases"
                checked={showJava}
                onChange={(ev, checked, prop) => {
                  setShowJava(checked);
                }}
              />
              <Checkbox
                label={t('Minecraft for Windows')}
                id="versions/betas"
                checked={showBugrock}
                onChange={(ev, checked, prop) => {
                  setShowBugrock(checked);
                }}
              />
              <Checkbox
                label={t('Minecraft Dungeons')}
                id="versions/betas"
                checked={showDungeons}
                onChange={(ev, checked, prop) => {
                  setShowDungeons(checked);
                }}
              />
              <Checkbox
                label={t('Minecraft Legends')}
                id="versions/betas"
                checked={showLegends}
                onChange={(ev, checked, prop) => {
                  setShowLegends(checked);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: '100%', background: 'var(--divider)', minHeight: '1px' }}></div>
      <div className="news-list">
        <div className="news-list-inside">
          {news.map((n) => {
            return (
              <a
                className={classNames('news-item', { 'card-border': n.cardBorder })}
                href={n.readMoreLink}
                target="_blank"
                key={n.id}
                style={{
                  display:
                    ((n.category === 'Minecraft: Java Edition' && showJava) || (n.category === 'Minecraft Dungeons' && showDungeons)) && (filterText === '' || n.title.toLowerCase().includes(filterText.toLowerCase())) ? 'block' : 'none'
                }}
              >
                <div className="news-item-img">
                  <img src={'https://launchercontent.mojang.com/' + n.newsPageImage.url} alt={n.newsPageImage.title} />
                </div>
                <div className="news-item-cont">
                  <h3>{n.title}</h3>
                  <div className="wrapper">
                    <span className="cat">{n.newsType.includes('Java') && n.newsType.includes('Bedrock') ? 'Minecraft: Java & Bedrock' : n.category}</span>
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

export default Minecraft;
