import { T } from '../../../context/TranslationContext';
import banner from '/images/banner.png';
import './index.scss';
import PlayButton from '../../../components/PlayButton';
import { ReactComponent as MinicraftPlusLogo } from '../../../assets/images/minicraftplus_logo.svg';

const Play: React.FC = () => {
  return (
    <div className="play-content">
      <div
        className="banner"
        style={{
          background: 'url(' + banner + ')',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '50% 50%',
          backgroundSize: 'cover'
        }}
      >
        <MinicraftPlusLogo className="minicraft-logo minicraftplus" />
      </div>
      <div className="bar">
        <PlayButton disabled>
          <T>Play</T>
        </PlayButton>
      </div>
    </div>
  );
};

export default Play;
