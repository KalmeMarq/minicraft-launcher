import DOMPurify from 'dompurify';
import { useContext } from 'react';
import { TranslationContext } from '../context/TranslationContext';

export const useTranslation = () => {
  const translations = useContext(TranslationContext);

  function translate(text: string, domPurifyConfig?: DOMPurify.Config) {
    if (translations[text] === undefined) {
      return text;
    }

    const result = DOMPurify.sanitize(translations[text], {
      RETURN_DOM_FRAGMENT: false,
      RETURN_DOM: false,
      ...domPurifyConfig
    }).toString();

    return result;
  }

  return {
    t: translate
  };
};
