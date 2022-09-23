import { useRef } from 'react';

let _id = 0;

export function useId(prefix?: string, providedId?: string): string {
  const ref = useRef<string | undefined>(providedId);
  if (!ref.current) {
    ref.current = (prefix == undefined ? 'id__' : prefix) + _id;
    ++_id;
  }
  return ref.current;
}
