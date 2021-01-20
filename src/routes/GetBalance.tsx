import { BigNumber } from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export interface IsMyBalance {
  vet: number;
  vtho: number;
}

export interface IsParams {
  address: string;
}

function GetBalance() {
  const address = useParams<IsParams>().address;
  const [balance, setMyBalance] = useState<IsMyBalance>({
    vet: 0,
    vtho: 0,
  });

  useEffect(() => {
    const hexToInt = (hex: string) => {
      return new BigNumber(hex)
        .dividedBy(new BigNumber(10 ** 18))
        .toFixed(2, BigNumber.ROUND_DOWN);
    };
    const getBalance = async () => {
      try {
        if (window.connex) {
          const accInfo = await connex.thor.account(address).get();
          const vet = Number(hexToInt(accInfo.balance));
          const vtho = Number(hexToInt(accInfo.energy));
          setMyBalance({ vet, vtho });
          const ticker = connex.thor.ticker();
          await ticker.next();
          getBalance();
        }
      } catch (error) {
        throw new Error(error);
      }
    };
    getBalance();
  });

  return (
    <div className='GetBalance'>
      <div>Success, your request for funds has been sent!</div>
      <small>Your balance below will update automatically:</small>
      <div>{balance.vet} VET</div>
      <div>{balance.vtho} VTHO</div>
    </div>
  );
}

export { GetBalance };
