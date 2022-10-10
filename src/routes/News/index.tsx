import Select from '../../components/Select';
import { T } from '../../context/TranslationContext';

const News: React.FC = () => {
  return (
    <div className="coming-soon-container">
      {/* <h2>
        <T>Coming soon</T>
      </h2> */}
      <div style={{ position: 'relative', top: '-30px' }}>
        <Select
          width={330}
          defaultValue="carhm"
          options={[
            {
              label: 'Dark',
              value: 'dark'
            },
            {
              label: 'bruh',
              value: 'bruh'
            },
            {
              label: 'game',
              value: 'gam'
            },
            {
              label: 'muda',
              value: 'muda'
            },
            {
              label: 'oera',
              value: 'oera'
            },
            {
              label: 'pepe',
              value: 'pepe'
            },
            {
              label: 'xqc',
              value: 'xqc'
            },
            {
              label: 'kalm',
              value: 'kalm'
            },
            {
              label: 'cris',
              value: 'cris'
            },
            {
              label: 'hawf',
              value: 'hawf'
            },
            {
              label: 'carhm',
              value: 'carhm'
            },
            {
              label: 'cat',
              value: 'cat'
            },
            {
              label: 'Light',
              value: 'light'
            },
            {
              label: 'Night',
              value: 'night'
            }
          ]}
          onChange={(idx, vl) => {
            console.log(vl + ' selected');
          }}
        />
      </div>
    </div>
  );
};

export default News;
