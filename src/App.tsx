import '@vechain/connex';
import { BigNumber } from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import './scss/App.scss';

export interface IsState {
  address: string;
  amount: number;
}

export interface IsLoading {
  description: string;
  state: boolean;
}

export interface IsApiError {
  description: string;
  error: boolean;
}
export interface IsMyBalance {
  vet: string;
  vtho: string;
}

function App() {
  const [state, setState] = useState<IsState>({
    address: '0x224474d7af5a80708A36DaE803CB4477177A95DE',
    amount: 1,
  });

  const [apiError, setApiError] = useState<IsApiError>({
    description: '',
    error: false,
  });

  const [loading, setLoading] = useState<IsLoading>({
    description: '',
    state: false,
  });

  const [myBalance, setMyBalance] = useState<IsMyBalance>({
    vet: '',
    vtho: '',
  });

  const [connexConnected, setConnexConnected] = useState(false);

  const formValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const hexToInt = (hex: string) => {
    return new BigNumber(hex)
      .dividedBy(new BigNumber(10 ** 18))
      .toFixed(2, BigNumber.ROUND_DOWN);
  };

  const getBalance = async (address: string) => {
    if (window.connex) {
      const acc = connex.thor.account(address);
      const accInfo = await acc.get();
      const vet = `${hexToInt(accInfo.balance)} VET`;
      const vtho = `${hexToInt(accInfo.energy)} VTHO`;
      setMyBalance({ vet, vtho });
      const ticker = connex.thor.ticker();
      await ticker.next();
      getBalance(address);
    }
  };

  const requestFunds = async () => {
    if (window.connex) {
      const { amount } = state;
      const signingService = connex.vendor.sign('cert');
      const result = await signingService.request({
        payload: {
          content: `Select a Testnet wallet where you would like ${amount} VET to be deposited`,
          type: 'text',
        },
        purpose: 'identification',
      });
      const address = result.annex.signer;
      setLoading({ ...loading, state: true });
      const url = `${process.env.REACT_APP_API_BASE_URL}/v1/request-funds`;
      const settings = {
        body: JSON.stringify({ address, amount }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=UTF-8',
        },
        method: 'POST',
      };
      if (address.length !== 42) {
        setApiError({
          description: 'Address wrong length',
          error: true,
        });
      } else if (amount < 0.000001) {
        setApiError({
          description: 'Amount must be greater than 0.000001',
          error: true,
        });
      } else {
        try {
          getBalance(address);
          const fetchResponse = await fetch(url, settings);
          const data = await fetchResponse.json();
          // tslint:disable-next-line: no-console
          console.log(data);
          setLoading({
            description: 'Funds Requested',
            state: false,
          });
        } catch (e) {
          setApiError({
            description: 'api error',
            error: true,
          });
        }
      }
    }
  };

  useEffect(() => {
    if (!window.connex) setConnexConnected(false);
    else {
      setConnexConnected(true);
    }
  }, []);

  return (
    <div className='App'>
      <header className='App--header'>
        {connexConnected ? (
          <div className='App--connected'>Connex is connected!</div>
        ) : (
          <div className='App--connected'>
            This Connex environment is not supported. Please download VeChain
            sync for a frictionless experience.
          </div>
        )}
        <p>Request Funds</p>

        {myBalance.vet && myBalance.vtho ? (
          <div className='App--balance'>
            <div>Success, your request for funds has been sent!</div>
            <div className='App--balance-small'>Your balance below will update when your request is granted:</div>
            <div>{myBalance.vet}</div>
            <div>{myBalance.vtho}</div>
          </div>
        ) : (
          <div className='form'>
            <label>
              How many VET token would you like?
              <input
                type='number'
                value={state.amount}
                name='amount'
                onChange={formValue}
              />
            </label>
            <button type='submit' value='Submit' onClick={requestFunds}>
              Request
            </button>
            {apiError && <div>{apiError.description}</div>}
          </div>
        )}
      </header>
    </div>
  );
}

export { App };
