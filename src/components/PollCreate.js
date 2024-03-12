import React, { useState } from 'react';
import { Web3Button } from "@thirdweb-dev/react";
import '../styles/PollCreate.css'

function PollCreate({ admin, address, CONTRACT_ADDRESS }) {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [minStake, setMinStake] = useState(1);
    const [options, setOptions] = useState([]);
    const [duration, setDuration] = useState(1);

    const [inputValue, setInputValue] = useState('');

    const handleChange = (e) => {
        setInputValue(e.target.value);
        // Парсим введенные данные как JSON
        try {
            const parsedArray = JSON.parse(e.target.value);
            if (Array.isArray(parsedArray)) {
                setOptions(parsedArray);
            }
        } catch (error) {
            console.error('Invalid JSON input');
        }
    };

    return (
        <div className="new-poll-card">
            <h1>Create new poll</h1>
            <div className="form-container">
                {address === admin ? (
                    <>
                        <div className="form-field">
                            <label>Title:</label>
                            <input value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="form-field">
                            <label>Description:</label>
                            <input value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                        <div className="form-field">
                            <label>ImageUrl:</label>
                            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                        </div>
                        <div className="form-field">
                            <label>MinStake:</label>
                            <input value={minStake} onChange={e => setMinStake(e.target.value)} type="number" />
                        </div>
                        <div className="form-field">
                            <label>Options:</label>
                            <textarea value={inputValue} onChange={handleChange} rows={2} />
                        </div>
                        <div className="form-field">
                            <label>Duration:</label>
                            <input value={duration} onChange={e => setDuration(e.target.value)} type="number" />
                        </div>
                        <div className='form-button'>
                        <Web3Button
                            contractAddress={CONTRACT_ADDRESS}
                            action={(contract) => {
                                contract.call("createPoll", [title, description, imageUrl, minStake, options, duration])
                            }}
                            onError={(error) => alert(error)}
                        >Create new poll</Web3Button>
                        </div>
                        
                    </>
                ) : address ? (
                    <p>You are not the owner of this contract</p>
                ) : (
                    <p>Connect your wallet to be able to create poll</p>
                )}
            </div>
        </div>
    );
}

export default PollCreate;
