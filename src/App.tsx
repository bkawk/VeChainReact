import React, { useState } from 'react';
import './scss/App.scss';

export interface IsState {
  address: string;
  amount: string;
}

export interface IsLoading {
  description: string;
  state: boolean;
}

export interface IsApiError {
  description: string;
  error: boolean;
}

function App() {
  const [state, setState] = useState<IsState>({
    address: '',
    amount: '',
  });

  const [apiError, setApiError] = useState<IsApiError>({
    description: '',
    error: false,
  });

  const [loading, setLoading] = useState<IsLoading>({
    description: '',
    state: false,
  });

  const formValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const requestFunds = async () => {
    setLoading({ ...loading, state: true });
    const { address, amount } = state;
    const url = `${process.env.REACT_APP_API_BASE_URL}/v1/request-funds`;

    const settings = {
      body: JSON.stringify({ address, amount }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };
    try {
      const fetchResponse = await fetch(url, settings);
      const data = await fetchResponse.json();
      setLoading({
        description: 'Funds Requested',
        state: false,
      });
    } catch (e) {
      setApiError({
        description: e,
        error: true,
      });
    }
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <p>Request Funds</p>
        <form onSubmit={requestFunds}>
          <label>
            Address:
            <input
              type='text'
              value={state.address}
              name='address'
              onChange={formValue}
            />
          </label>
          <label>
            Amount:
            <input
              type='number'
              value={state.amount}
              name='amount'
              onChange={formValue}
            />
          </label>
          <input type='submit' value='Submit' />
        </form>
        {apiError && <div>{apiError.description}</div>}
      </header>
    </div>
  );
}

export { App };
