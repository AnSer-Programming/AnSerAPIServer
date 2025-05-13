import { createContext } from 'react';

export interface IStaticContext {
  signedIn: boolean
}

export const StaticContext = createContext<IStaticContext>({
  signedIn: false
});