import DOMPurify from 'dompurify';
import { useContext } from 'react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { FAQContext } from '../../../context/FAQContext';
import { T } from '../../../context/TranslationContext';
import './index.scss';

const FAQLoading = () => {};

const FAQ: React.FC = () => {
  const { hasContext, getContext } = useContext(FAQContext);

  return (
    <>
      {!hasContext('Minicraft Plus') ? (
        <LoadingSpinner />
      ) : (
        <div className="faq-content">
          <div className="faq-header">
            <h2>
              <T>Frequently asked questions</T>
            </h2>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(getContext('Minicraft Plus').description) }}></div>
          </div>
          <div style={{ height: '4px' }}></div>
          <div className="faq-list">
            {getContext('Minicraft Plus').qas.map((faq) => (
              <div className="faq-item" key={faq.id}>
                <div className="faq-item__question">
                  <div className="faq-item__question-right">
                    <span>Q</span>
                  </div>
                  <div className="faq-question">{faq.question}</div>
                </div>
                <div className="faq-item__answer">
                  <div className="faq-item__question-right">
                    <span>A</span>
                  </div>
                  <div className="faq-answer" dangerouslySetInnerHTML={{ __html: faq.answer }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FAQ;
