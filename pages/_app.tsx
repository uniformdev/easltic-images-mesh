import type { AppProps } from 'next/app';
import { MeshApp } from '@uniformdev/mesh-sdk-react';
import { IconsProvider } from '@uniformdev/design-system';
import '../styles/globals.css';

const App = ({ Component, pageProps }: AppProps) => (
  <MeshApp>
    <IconsProvider>
      <Component {...pageProps} />
    </IconsProvider>
  </MeshApp>
);

export default App;
