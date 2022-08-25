

import React, { useEffect, useState } from 'react';
import { useChain, useMoralis, useWeb3Transfer } from 'react-moralis';
import toast, { Toaster } from 'react-hot-toast';

import Authenticate from './components/Authenticate';
import { getUser, addAttempts, saveScore } from './utils/helper';
const LAMPORTS_PER_ATTEMPT = 1000000;
const BANK ="0x398B723d2d5a8e6976763E0B00a5DD96F053940a"
const Moralis = require('moralis')
export default function App() {
  
  const { isAuthenticated, logout, user, enableWeb3, web3 } = useMoralis();
  const [key, setKey] = useState("no key ser...");
  const [ first, setFirst ] = useState(true)
  if (!Moralis.web3 && first){
    setFirst(false);
    enableWeb3();
    
 }
 const { switchNetwork, chainId, chain, account } = useChain();
 switchNetwork("0x38")
  const buy = async () => {
    if (!web3) {
      toast.error('Connect your wallet');
      return;
    }
try {
  // sending 0.5 ETH
const options = {
  gas:"0x12A05F200",
  type: "native",
  amount: "0x5AF3107A4000",//0x16345785D8A0000
  receiver: BANK
};
let result = await Moralis.transfer(options);

      toast.success(`Purchasing api key...`);
    } catch (e) {
      console.log(e);
      toast.error(`Issue purchasing...`);
    }
  };

  useEffect(() => {
    if (
      user &&
      user.get('ethAddress') &&
      account !== user.get('ethAddress')
    ) {
      console.log(123)
      logout();
      return;
    }
    const fetchUser = async () => {
      if (account){

      const currentUser = await getUser(account);
      if (currentUser) setKey(currentUser.get('apiKey') || "no key ser...");
      }
    };

    fetchUser();
  }, [ account, user, logout]);


  if (!isAuthenticated) {
    return <Authenticate />;
  } 

  return (
    <>
      <div className="p-8 flex flex-col justify-center text-center items-center">
        <Toaster position="bottom-center" />
        {isAuthenticated && (
          <div>
            <h1 className="text-4xl text-center mb-2 tracking-tight font-extrabold text-gray-800 sm:text-5xl md:text-6xl">
              <span className="block xl:inline">You have </span>{' '}
              <span className="block text-blue-500 xl:inline">
                {key}
              </span>
            </h1>
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none mb-6 mt-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={() => {
                buy();
              }}
            >
              Buy a key: 0.1 BNB
            </button>
          </div>
        )}
      </div>
    </>
  );
}
