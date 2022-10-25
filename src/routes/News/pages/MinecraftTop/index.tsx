import { invoke } from '@tauri-apps/api';
import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import SearchBox from '../../../../components/SearchBox';
import { NewsContext } from '../../../../context/NewsContext';
import { T } from '../../../../context/TranslationContext';
import { useTranslation } from '../../../../hooks/useTranslation';
import { formatDateNews } from '../../../../utils';
import NewsItem from '../../components/NewsItem';

const MinecraftTop: React.FC = () => {
  const { t } = useTranslation();

  const { minecraftTop: news, setLastSeenMCTNews } = useContext(NewsContext);

  const [results, setResults] = useState(0);
  const [filterText, setFilterText] = useState('');
  const handleFilterTextChange = (value: string) => {
    setFilterText(value);
    if (value === '') setResults(0);
    if (value !== '') setResults(news.filter((v) => v.title.toLowerCase().includes(value.toLowerCase())).length);
  };

  useEffect(() => {
    if (news.length > 0) {
      localStorage.setItem('lastMCTNewId', news[0].id);
      setLastSeenMCTNews(false);
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
          {news.map((n) => (
            <NewsItem key={n.id} newsData={n} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinecraftTop;
