import { invoke } from '@tauri-apps/api';
import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import Checkbox from '../../../../components/Checkbox';
import SearchBox from '../../../../components/SearchBox';
import Select from '../../../../components/Select';
import { NewsContext } from '../../../../context/NewsContext';
import { T } from '../../../../context/TranslationContext';
import { useTranslation } from '../../../../hooks/useTranslation';
import { formatDateNews } from '../../../../utils';
import NewsItem from '../../components/NewsItem';
import './index.scss';

const Minecraft: React.FC = () => {
  const { t } = useTranslation();

  const { minecraft: news, setLastSeenMCNews } = useContext(NewsContext);

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
    if (news.length > 0) {
      localStorage.setItem('lastMCNewId', news[0].id);
      setLastSeenMCNews(false);
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
          {news.map((n) => (
            <NewsItem key={n.id} contentUrl="https://launchercontent.mojang.com/" newsData={n} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Minecraft;
