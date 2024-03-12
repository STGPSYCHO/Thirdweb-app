import { ConnectWallet, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import "./styles/Home.css";
import { CONTRACT_ADDRESS } from "./constantas.js"
import CardGridAvailable from './components/CardGridAvailable.js';
import CardGridPast from './components/CardGridPast.js';
import React from 'react';
import PollCreate from "./components/PollCreate.js";



export default function Home() {

  const address = useAddress();

  const { contract } = useContract(CONTRACT_ADDRESS);

  const {
    data: data_array,
    isLoading: isLoading
  } = useContractRead(contract, "getPolls")

  const {
    data: admin,
  } = useContractRead(contract, "admin")

  return (
    <main className="main">
      <div className="container">
        <div className="header">
          <div className="connect">
            <ConnectWallet />
          </div>
          <div className="header-main">
            <h1>Платформа для голосований</h1>
          </div>
        </div>
        <div>
          <h2>Активные голосования</h2>
          <CardGridAvailable data={data_array} isLoading={isLoading} />
        </div>
        <div>
          <h2>Прошедшие голосования</h2>
          <CardGridPast data={data_array} isLoading={isLoading} />
        </div>

        <PollCreate admin={admin} address={address} CONTRACT_ADDRESS={CONTRACT_ADDRESS} />

      </div>
    </main>
  );
}
