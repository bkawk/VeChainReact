import { BigNumber } from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export interface IsMyBalance {
  vet: string;
  vtho: string;
}

export interface IsParams {
  address: string;
}

function GetBalance() {
  const address = useParams<IsParams>().address;
  const [myBalance, setMyBalance] = useState<IsMyBalance>({
    vet: '',
    vtho: '',
  });

  const hexToInt = (hex: string) => {
    return new BigNumber(hex)
      .dividedBy(new BigNumber(10 ** 18))
      .toFixed(2, BigNumber.ROUND_DOWN);
  };

  const getBalance = async () => {
    if (window.connex) {
      const acc = connex.thor.account(address);
      const accInfo = await acc.get();
      const vet = `${hexToInt(accInfo.balance)} VET`;
      const vtho = `${hexToInt(accInfo.energy)} VTHO`;
      setMyBalance({ vet, vtho });
      const ticker = connex.thor.ticker();
      await ticker.next();
      getBalance();
    }
  };

  useEffect(() => {
    getBalance();
  });

  return (
    <div className='GetBalance'>
        <div>Success, your request for funds has been sent!</div>
        <div className='GetBalance--small'>
          Your balance below will update when your request is granted:
        </div>
        <div>{myBalance.vet}</div>
        <div>{myBalance.vtho}</div>
    </div>
  );
}

export { GetBalance };
