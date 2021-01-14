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
    address: '0x4eC15f15Fa0b9C7B702Db240Cf32B289A1153820',
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
    const { address, amount } = state;
    setLoading({ ...loading, state: true });
    const url = `${process.env.REACT_APP_API_BASE_URL}/v1/request-funds`;
    const settings = {
      body: JSON.stringify({ address, amount }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
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
              Address *
              <input
                type='text'
                value={state.address}
                name='address'
                onChange={formValue}
              />
            </label>
            <label>
              Amount *
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
