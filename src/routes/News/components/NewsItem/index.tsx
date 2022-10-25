import classNames from 'classnames';
import { INews } from '../../../../context/NewsContext';
import { formatDateNews } from '../../../../utils';
import empty from '../../../../assets/images/empty.png';
import './index.scss';

function getCategory(newsData: INews) {
  if (!newsData.newsType) throw new Error('News item does not have newsType');

  if (newsData.newsType.includes('Java') && newsData.newsType.includes('Bedrock')) {
    if (newsData.newsType.includes('Dungeons')) {
      return 'Java & Bedrock & Dungeons';
    }

    return 'Minecraft: Java & Bedrock';
  }

  return newsData.category;
}

interface INewsItem {
  newsData: INews;
  contentUrl?: string;
  className?: string;
  styles?: React.CSSProperties;
}

const NewsItem: React.FC<INewsItem> = ({ newsData, contentUrl = '', className, styles }) => {
  return (
    <a className={classNames('news-item', { 'card-border': newsData.cardBorder }, className)} style={styles} href={newsData.readMoreLink} target="_blank" key={newsData.id}>
      <div className="news-item-inside">
        <div className="news-item-img">
          <img
            src={contentUrl + newsData.newsPageImage.url}
            alt={newsData.newsPageImage.title}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = empty;
            }}
          />
        </div>
        <div className="news-item-cont">
          <h3>{newsData.title}</h3>
          <div className="wrapper">
            <span className="cat">{newsData.newsType ? getCategory(newsData) : 'Minecraft'}</span>
            <span className="date">{formatDateNews(newsData.date)}</span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default NewsItem;
