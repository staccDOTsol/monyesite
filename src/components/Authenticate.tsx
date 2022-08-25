import { useState } from 'react';
import { useMoralis } from 'react-moralis';
const Web3 = require('web3')
export default function Authenticate() {
  const { authenticate, enableWeb3, logout, web3 } = useMoralis();
  const [ first, setFirst ] = useState(true)
  if (first){
    setTimeout(async function(){
  setFirst( false )
    enableWeb3()
  },200)
  }
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl">Please Login to Continue</h1>
      
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none mt-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700"
        onClick={() => {
          try { 
            if (web3){
          authenticate({ type: 'evm', signingMessage: 'Login to PancakeSwapMadMan' });

        }
          } catch (err){
            logout()
          }
        }}
      >
        Authenticate
      </button>
    </div>
  );
}
