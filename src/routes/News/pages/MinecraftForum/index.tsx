import { useState, useContext, useEffect } from 'react';
import SearchBox from '../../../../components/SearchBox';
import { NewsContext } from '../../../../context/NewsContext';
import { T } from '../../../../context/TranslationContext';
import { useTranslation } from '../../../../hooks/useTranslation';
import NewsItem from '../../components/NewsItem';

const MinecraftForum: React.FC = () => {
  const { t } = useTranslation();

  const { minecraftForum: news, setLastSeenMCFNews } = useContext(NewsContext);

  const [results, setResults] = useState(0);
  const [filterText, setFilterText] = useState('');
  const handleFilterTextChange = (value: string) => {
    setFilterText(value);
    if (value === '') setResults(0);
    if (value !== '') setResults(news.filter((v) => v.title.toLowerCase().includes(value.toLowerCase())).length);
  };

  useEffect(() => {
    if (news.length > 0) {
      localStorage.setItem('lastMCFNewId', news[0].id);
      setLastSeenMCFNews(false);
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
      <div style={{ width: '100%', background: 'var(--divider)', height: '1px', minHeight: '1px' }}></div>
      <div className="news-list">
        <div className="news-list-inside">
          {news.map((n) => (
            <NewsItem key={n.id} newsData={n} className="forum" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinecraftForum;
