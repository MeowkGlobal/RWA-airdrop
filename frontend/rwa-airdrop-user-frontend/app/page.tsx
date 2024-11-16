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
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
import { ethers } from 'ethers';
import { AIRDROP_CONTRACT_ABI } from '@/constants/contractABI';

// const clientId = process.env.WEB3AUTH_CLIENT_ID;
const clientId =
  'BF98f4BCXkt9o9282xQgfnfxf77U_cJqSWNF5ZtOY-aqO4SAqPpy-aE-sn9s-tw-mTnz2HE9i5Dm5l_f0BL4TPQ';

// const chainConfig = {
//   chainNamespace: CHAIN_NAMESPACES.EIP155,
//   chainId: '0x89', // hex of 137, polygon mainnet
//   rpcTarget: 'https://rpc.ankr.com/polygon',
//   // Avoid using public rpcTarget in production.
//   // Use services like Infura, Quicknode etc
//   displayName: 'Polygon Mainnet',
//   blockExplorerUrl: 'https://polygonscan.com',
//   ticker: 'POL',
//   tickerName: 'Polygon Ecosystem Token',
//   logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
// };

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0xaa36a7',
  rpcTarget: 'https://rpc.ankr.com/eth_sepolia',
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: 'Ethereum Sepolia Testnet',
  blockExplorerUrl: 'https://sepolia.etherscan.io',
  ticker: 'ETH',
  tickerName: 'Ethereum',
  logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
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

interface ZKProofResponse {
  statusCode: number;
  data: {
    proof: string;
    publicInputs: string[];
  };
  message: string;
}

export default function Home() {
  const router = useRouter();
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isRobinhoodConnected, setIsRobinhoodConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [holdings, setHoldings] = useState<
    Array<{
      symbol: string;
      noOfShares: number;
      lastHoldingTime: string;
    }>
  >([]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      if (sessionStorage.getItem('loggedIn') === 'true') {
        setLoggedIn(true);
        sessionStorage.removeItem('loggedIn');
      }
      try {
        console.log('init started');
        const adapters = await getDefaultExternalAdapters({
          options: web3AuthOptions,
        });
        adapters.forEach((adapter: IAdapter<unknown>) => {
          web3auth.configureAdapter(adapter);
        });
        await web3auth.initModal();
        const web3authProvider = web3auth.provider;
        setProvider(web3authProvider);
        console.log('web3auth started');

        if (web3auth.connected && web3authProvider) {
          setLoggedIn(true);
          await checkRobinhoodConnection(web3authProvider);

          console.log('checkRobinhoodConnection done');

          const rhUserId = sessionStorage.getItem('rhUserId');
          if (rhUserId) {
            await createRobinhoodConnection(rhUserId, web3authProvider);
            sessionStorage.removeItem('rhUserId');
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
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

  // Redirect to the Robinhood page
  const redirectToRobinhood = () => {
    router.push('/rh/login');
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

  const fetchHoldings = async (walletAddress: string) => {
    try {
      const response = await fetch('/api/get-holdings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });
      const data = await response.json();
      setHoldings(data.holdings);
    } catch (error) {
      console.error('Error fetching holdings:', error);
    }
  };

  const checkRobinhoodConnection = async (currentProvider: IProvider) => {
    try {
      const address = await RPC.getAccounts(currentProvider);
      console.log('checkRobinhoodConnection address', address);
      const response = await fetch('/api/check-robinhood-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: address }),
      });

      const data = await response.json();
      setIsRobinhoodConnected(data.isActive);
      if (data.isActive) {
        await fetchHoldings(address);
      }
    } catch (error) {
      console.error('Error checking Robinhood connection:', error);
    }
  };

  const createRobinhoodConnection = async (
    userId: string,
    currentProvider: IProvider
  ) => {
    try {
      const address = await RPC.getAccounts(currentProvider);
      console.log('createRobinhoodConnection address', address);
      const response = await fetch('/api/create-robinhood-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          walletAddress: address,
        }),
      });

      if (response.ok) {
        setIsRobinhoodConnected(true);
      }
    } catch (error) {
      console.error('Error creating Robinhood connection:', error);
    }
  };

  const claimAirdrop = async (holding: {
    symbol: string;
    noOfShares: number;
    lastHoldingTime: string;
  }) => {
    if (!provider) {
      uiConsole('provider not initialized yet');
      return;
    }

    try {
      // Generate ZK Proof
      const response = await fetch(
        'http://localhost:3001/api/v1/generateZkProof',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: await RPC.getAccounts(provider),
            stockQuantity: holding.noOfShares.toString(),
            stockBuyTimestamp: holding.lastHoldingTime,
          }),
        }
      );

      const zkProofData: ZKProofResponse = await response.json();

      if (response.ok) {
        // TODO: Replace with your actual contract address and ABI
        const contractAddress = '0x1D2A2309CE0932c438ce38b9E5412b62a87136c3';
        const contractABI = AIRDROP_CONTRACT_ABI;

        // Make contract call
        const ethersProvider = new ethers.BrowserProvider(provider);
        const signer = await ethersProvider.getSigner();

        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        // Call the contract method with proof and public inputs
        const tx = await contract.claimAirdrop(
          zkProofData.data.proof,
          zkProofData.data.publicInputs
        );

        await tx.wait();
        uiConsole('Airdrop claimed successfully!');
      }
    } catch (error) {
      console.error('Error claiming airdrop:', error);
      uiConsole('Error claiming airdrop');
    }
  };

  const robinhoodButton = isRobinhoodConnected ? (
    <Button
      className="flex w-[50%] h-[50px] mx-auto mt-[5%] mb-[5%]"
      variant="secondary"
      disabled
    >
      Connected to the Robinhood Trading Account
    </Button>
  ) : (
    <Button
      className="flex w-[50%] h-[50px] mx-auto mt-[5%] mb-[5%]"
      onClick={redirectToRobinhood}
    >
      Connect to the Robinhood Trading Account
    </Button>
  );

  const holdingsTable = (
    <>
      <div className="flex flex-col gap-4">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Your Holdings
        </h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Symbol</TableHead>
            <TableHead>No. of Shares</TableHead>
            <TableHead>Last bought on</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings.length > 0 ? (
            holdings.map((holding, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{holding.symbol}</TableCell>
                <TableCell>{holding.noOfShares}</TableCell>
                <TableCell>
                  {new Date(holding.lastHoldingTime).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    className="bg-green-500"
                    onClick={() => claimAirdrop(holding)}
                  >
                    Avail Airdrop
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No holdings found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );

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
      {robinhoodButton}
      {holdingsTable}
      <div className="justify-center mt-20">
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
      </div>
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
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div>{loggedIn ? loggedInView : unloggedInView}</div>
      )}
    </div>
  );
}
