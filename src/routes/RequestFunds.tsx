import '@vechain/connex';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

function RequestFunds() {
  const history = useHistory<History>();
  const [amount, setAmount] = useState<number>(1);
  const [apiError, setApiError] = useState<string>('');

  // useEffect(() => {
  //   if (!window.connex) history.push('/environment');
  // }, [history]);

  const requestFunds = async () => {
    try {
      if (amount < 0.00000000000000001) {
        setApiError('Amount must be greater than 0.00000000000000001 VET');
      } else {
        const signingService = connex.vendor.sign('cert');
        const result = await signingService.request({
          payload: {
            content: `Select a Testnet wallet where you would like ${amount} VET to be deposited`,
            type: 'text',
          },
          purpose: 'identification',
        });
        const address = result.annex.signer;
        const settings = {
          body: JSON.stringify({ address, amount }),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8',
          },
          method: 'POST',
        };
        const url = `${process.env.REACT_APP_API_BASE_URL}/v1/request-funds`;
        await fetch(url, settings);
        history.push(`/sent/${address}`);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <div className='App'>
      <h1>Request Funds</h1>
      <div className='App--form'>
        <label>
          How many test net VET tokens would you like?
          <input
            autoFocus
            name='amount'
            onChange={(e) => setAmount(Number(e.target.value))}
            type='number'
            value={amount}
          />
        </label>
        <button type='submit' value='Submit' onClick={requestFunds}>
          Request
        </button>
        {apiError && <div className='App--error'>{apiError}</div>}
      </div>
    </div>
  );
}

export { RequestFunds };
