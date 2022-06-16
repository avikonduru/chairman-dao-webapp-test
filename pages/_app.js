/* Main App Driver File for Chairman DAO */

//Third Party React Libraries
import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider } from '@chakra-ui/react'

//Blockchain Libraries
import { MoralisProvider } from 'react-moralis';
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";

//local utilities & components
import MoralisConfig from '../utils/moralis';

// Establish Color Theme
import { extendTheme } from '@chakra-ui/react'

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

//local stylesheets
import '../styles/globals.css'

const theme = extendTheme({ colors })

function MyApp({ Component, pageProps }) {

  const connectors = ['metamask', 'walletConnect', 'walletLink'];

  return (
    <MoralisProvider
      serverUrl={MoralisConfig.getServerURL()}
      appId={MoralisConfig.getAppID()}
    >

      <ThirdwebProvider
        walletConnectors={connectors}
        desiredChainId={ChainId.Rinkeby}
      >

        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>

      </ThirdwebProvider>

    </MoralisProvider>
  );
}

export default MyApp
