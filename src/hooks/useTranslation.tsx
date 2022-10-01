import DOMPurify from 'dompurify';
import { useContext } from 'react';
import { TranslationContext } from '../context/TranslationContext';

export const useTranslation = () => {
  const translations = useContext(TranslationContext);

  function translate(text: string, placeholders?: (string | number)[], domPurifyConfig?: DOMPurify.Config) {
    if (translations[text] === undefined) {
      return text;
    }

    let translation = translations[text].replace(/%([0-9]{1,2})\$s/g, (a, b) => {
      return placeholders ? (placeholders[Number(b) - 1] ? placeholders[Number(b) - 1].toString() : a) : a;
    });

    const result = DOMPurify.sanitize(translation, {
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
