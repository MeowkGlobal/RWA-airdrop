/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */

'use client';

import {
  CHAIN_NAMESPACES,
  IAdapter,
  IProvider,
  WEB3AUTH_NETWORK,
} from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { getDefaultExternalAdapters } from '@web3auth/default-evm-adapter';
import { Web3Auth, Web3AuthOptions } from '@web3auth/modal';
import { useEffect, useState } from 'react';

import RPC from './ethersRPC';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MountainIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// const clientId = process.env.WEB3AUTH_CLIENT_ID;
const clientId =
  'BF98f4BCXkt9o9282xQgfnfxf77U_cJqSWNF5ZtOY-aqO4SAqPpy-aE-sn9s-tw-mTnz2HE9i5Dm5l_f0BL4TPQ';

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0x89', // hex of 137, polygon mainnet
  rpcTarget: 'https://rpc.ankr.com/polygon',
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: 'Polygon Mainnet',
  blockExplorerUrl: 'https://polygonscan.com',
  ticker: 'POL',
  tickerName: 'Polygon Ecosystem Token',
  logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3AuthOptions: Web3AuthOptions = {
  clientId: clientId || '', // Provide default empty string if undefined
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
};
const web3auth = new Web3Auth(web3AuthOptions);

export default function Home() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const adapters = await getDefaultExternalAdapters({
          options: web3AuthOptions,
        });
        adapters.forEach((adapter: IAdapter<unknown>) => {
          web3auth.configureAdapter(adapter);
        });
        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    uiConsole('logged out');
  };

  // Check the RPC file for the implementation
  const getAccounts = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const address = await RPC.getAccounts(provider);
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const balance = await RPC.getBalance(provider);
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    const signedMessage = await RPC.signMessage(provider);
    uiConsole(signedMessage);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }
    uiConsole('Sending Transaction...');
    const transactionReceipt = await RPC.sendTransaction(provider);
    uiConsole(transactionReceipt);
  };

  function uiConsole(...args: unknown[]): void {
    const el = document.querySelector('#console>p');
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const loggedInView = (
    <>
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
        <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
          <MountainIcon className="h-6 w-6" />
          <h1 className="ml-2">MeokGlobal</h1>
        </Link>
        <div className="ml-auto flex gap-2">
          <Button onClick={logout}>Log Out</Button>
        </div>
      </header>
      <Button
        className="flex w-[50%] h-[50px] mx-auto mt-[10%] mb-[10%]"
        onClick={() => console.log('Connect to Robinhood clicked')}
      >
        Connect to the Robinhood Trading Account
      </Button>
      <Card className="w-full">
        <CardHeader className="flex justify-center text-center">
          <CardTitle>Logged in user details</CardTitle>
          <CardDescription>User information</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between mt-10">
          <Button onClick={getUserInfo}>Get User Info</Button>
          <Button onClick={getAccounts}>Get Accounts</Button>
          <Button onClick={getBalance}>Get Balance</Button>
          <Button onClick={signMessage}>Sign Message</Button>
          <Button onClick={sendTransaction}>Send Transaction</Button>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      <Card className="w-1/3 mt-10 mx-auto">
        <CardHeader className="flex justify-center text-center">
          <CardTitle>Debug Console</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div id="console" style={{ whiteSpace: 'pre-line' }}>
            <p style={{ whiteSpace: 'pre-line' }}></p>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );

  const unloggedInView = (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
      <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
        <MountainIcon className="h-6 w-6" />
        <h1 className="ml-2">MeokGlobal</h1>
      </Link>
      <div className="ml-auto flex gap-2">
        <Button onClick={login}>Login</Button>
      </div>
    </header>
  );

  return (
    <div className="container flex flex-col h-screen mx-auto">
      <div>{loggedIn ? loggedInView : unloggedInView}</div>

      {/* <footer className="footer">
        <a
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/quick-starts/nextjs-modal-quick-start"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
      </footer> */}
    </div>
  );
}
