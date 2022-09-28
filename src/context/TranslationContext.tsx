import DOMPurify from 'dompurify';
import React, { createContext, useContext } from 'react';

export interface ITranslation {
  [key: string]: string;
}

export const TranslationContext = createContext<ITranslation>({});

export const TranslationProvider: React.FC<{ translation: ITranslation } & React.PropsWithChildren> = ({ children, translation }) => {
  return <TranslationContext.Provider value={translation}>{children}</TranslationContext.Provider>;
};

export const T: React.FC<{ children: string; isHTML?: boolean; domPurifyConfig?: DOMPurify.Config }> = ({ children, domPurifyConfig, isHTML }) => {
  const translations = useContext(TranslationContext);

  let text = children.replace(/\n/g, '').replace(/\s{2,}/g, ' ');

  if (translations[text] !== undefined) {
    text = translations[text];
  }

  if (isHTML) {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(text, {
            RETURN_DOM_FRAGMENT: false,
            RETURN_DOM: false,
            ...domPurifyConfig
          }).toString()
        }}
      ></span>
    );
  } else {
    return <>{text}</>;
  }
};
