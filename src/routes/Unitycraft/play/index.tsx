import PlayButton from '../../../components/PlayButton';
import banner from '/images/banner.png';
import { T } from '../../../context/TranslationContext';
import { ReactComponent as UnitycraftLogo } from '../../../assets/images/unitycraft_logo.svg';

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
        <UnitycraftLogo className="minicraft-logo unitycraft-logo" />
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
