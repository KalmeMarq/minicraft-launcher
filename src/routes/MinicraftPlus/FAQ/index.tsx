import DOMPurify from 'dompurify';
import { useContext } from 'react';
import { FAQContext } from '../../../context/FAQContext';
import './index.scss';

const FAQ: React.FC = () => {
  const { hasContext, getContext } = useContext(FAQContext);

  return (
    <div className="faq-content">
      <div className="faq-header">
        <h2>Frequently asked questions</h2>
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(getContext('Minicraft Plus').description) }}></div>
      </div>
      <br />
      <div className="faq-list">
        {getContext('Minicraft Plus').qas.map((faq) => (
          <div className="faq-item" key={faq.id}>
            <div className="faq-item__question">
              <span>Q</span>
              <div>{faq.question}</div>
            </div>
            <div className="faq-item__answer">
              <span>A</span>
              <div className="faq-answer" dangerouslySetInnerHTML={{ __html: faq.answer }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
