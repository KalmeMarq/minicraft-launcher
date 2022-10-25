import PlayButton from '../../../components/PlayButton';
import banner from '/images/banner.png';
import { T } from '../../../context/TranslationContext';
import { ReactComponent as MinicraftLogo } from '../../../assets/images/minicraft_logo.svg';

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
        <MinicraftLogo className="minicraft-logo" />
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
