import React, { useState, useEffect } from 'react';
import '../styles/PollModal.css';
import { Web3Button } from '@thirdweb-dev/react';
import { CONTRACT_ADDRESS } from "../constantas.js"
import { useContract, useContractRead, useAddress } from "@thirdweb-dev/react";
/* global BigInt */

function PollModal({ poll, onClose }) {

  const address = useAddress();

  const { contract } = useContract(CONTRACT_ADDRESS);
  const {
    data: admin,
  } = useContractRead(contract, "admin")

  const [_amount, setAmount] = useState(1);
  const [votesData, setVotesData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      const votesPromises = poll.options.map(async option => {
        const data = await contract.call("getVotes", [poll.pollNumber, option]);
        return { option, votes: BigInt(data) };
      });
      const votes = await Promise.all(votesPromises);
      setVotesData(votes);
    };
    fetchData();
  }, [poll.options, poll.pollNumber, votesData]);

  const date = new Date(poll.endTime.toNumber() * 1000);
  const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="scrollable-content">
          <img src={poll.imageUrl} alt={`Preview of ${poll.title}`} />

          <div className="poll-info">
            <div className="text-info">
              <h2 className="poll-title">{poll.title}</h2>
              <p className="poll-description">{poll.description}</p>
            </div>
            <div className="date-time-info">
              <div className="datetime-label">Дата окончания:</div>
              <div className="datetime-value">{formattedDate}</div>
            </div>
          </div>
          <hr className="separator" />

          <div className="vote-info">
            {votesData.map((vote, index) => (
              <div key={index} className="vote-option">
                {vote.isLoading ? (
                  <p>Загружаю варианты</p>
                ) : (
                  <>
                    <Web3Button
                      contractAddress={CONTRACT_ADDRESS}
                      action={(contract) => {
                        contract.call("vote", [poll.pollNumber.toNumber(), vote.option], { value: _amount})
                      }}
                      onError={(error) => alert(error)}
                      className="vote-button"
                    >
                      {vote.option}
                    </Web3Button>
                    <p className="vote-count">Голосов: {vote.votes.toString()}</p>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="amount-input">
            <label className="amount-label">Amount:</label>
            <input className="amount-input-field" value={_amount} onChange={e => setAmount(e.target.value)} type="number" />
          </div>

          {date > new Date() && address === admin ? (
            <p>Дождитесь завершения голосования</p>
          ) : address === admin && !poll.finalized ? (
            
            <div className="finalize-options">
              <hr className="separator" />
              <h3>Завершить голосовани, выбрав необходимый вариант</h3>
              {votesData.map((vote, index) => (
                <div key={index} className="finalize-poll-option">
                  {vote.isLoading ? (
                    <p>Загружаю варианты</p>
                  ) : (
                    <>
                      <Web3Button
                        contractAddress={CONTRACT_ADDRESS}
                        action={(contract) => {
                          contract.call("finalizePoll", [poll.pollNumber.toNumber(), vote.option])
                        }}
                        onError={(error) => alert(error)}
                        className="finalize-poll-button"
                      >
                        {vote.option}
                      </Web3Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : poll.finalized ? (
            <>
            <hr className="separator" />
              <h3>Вы можете забрать свою награду</h3>
              <div className="claim-reward-block">
              <Web3Button
                contractAddress={CONTRACT_ADDRESS}
                action={(contract) => {
                  contract.call("claimReward", [poll.pollNumber.toNumber()])
                }}
                onError={(error) => alert(error)}
                className="claim-reward-button"
              >
                Claim Reward
              </Web3Button>
              </div>
              
            </>
          ) : (
            <p></p>
          )}

          <button onClick={onClose} className="close-button">Закрыть</button>
        </div>
      </div>
    </div>


  
  );
}

export default PollModal;
