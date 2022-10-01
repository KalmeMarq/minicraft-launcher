import { invoke } from '@tauri-apps/api';
import React, { createContext, useEffect, useState } from 'react';

interface QA {
  id: string;
  question: string;
  answer: string;
}

export const FAQContext = createContext<{ getContext(context: string): { description: string; qas: QA[] }; hasContext(context: string): boolean }>({
  hasContext: (context: string) => false,
  getContext: () => {
    return { description: '', qas: [] };
  }
});

export const FAQProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [qas, setQAs] = useState<{ context: string; description: string; qas: QA[] }[]>([]);

  useEffect(() => {
    if (qas.length === 0)
      invoke('get_faq').then((data) => {
        setQAs((data as { data: { context: string; description: string; qas: QA[] }[] }).data);
      });
  }, []);

  function hasContext(context: string): boolean {
    return qas.findIndex((q) => q.context === context) >= 0;
  }

  function getContext(context: string): { description: string; qas: QA[] } {
    const q = qas.find((q) => q.context === context);

    if (q) {
      return { description: q.description, qas: q.qas };
    }

    return { description: '', qas: [] };
  }

  return <FAQContext.Provider value={{ hasContext, getContext }}>{children}</FAQContext.Provider>;
};
