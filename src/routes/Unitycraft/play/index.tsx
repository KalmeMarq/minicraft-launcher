import PlayButton from '../../../components/PlayButton';
import banner from '../../../assets/images/banner.png';
import { T } from '../../../context/TranslationContext';

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
      ></div>
      <div className="bar">
        <PlayButton disabled>
          <T>Play</T>
        </PlayButton>
      </div>
    </div>
  );
};

export default Play;
