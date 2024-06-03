import React, { useState, useEffect } from 'react';
import { Description, Field, Input, Label } from '@headlessui/react'
import axios from 'axios';

const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const ipv6Regex = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}$/;

const isValidIP = (ip: string) => ipv4Regex.test(ip) || ipv6Regex.test(ip);

const IpLookup: React.FC = () => {
  const [ip, setIp] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Start--- Handling der Fehlermeldung fürs UI 
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [error]);
  // Ende--- Handling der Fehlermeldung fürs UI

  // Start--- Output Reset
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIp(event.target.value);
    setData(null);
    setError(null); 
  };
  // Ende--- Output Reset
  
  // Start--- API Call
  const handleLookup = async () => {
    if (!isValidIP(ip)) {
      setError('Invalid IP address');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/api/lookup', { ip });
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  // Ende--- API Call

  // Start--- senden des API Call auf Keyboard-Event
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLookup();
    }
  };
  // Ende--- senden des API Call auf Keyboard-Event

  return (
    <div>
      <Field className="rounded bg-flixGrey py-10 px-12 text-left">
      <Label className="text-3xl font-bold underline">IP Geo Lookup</Label>
      <Description>send a request to <a className="underline text-flixGreen" rel="noreferrer" href='http://ip-api.com/' target='_blank'>ip-api.com</a></Description>
      <Input name="ip_adress"
        className="rounded-lg border-none py-2 px-4 text-xl"
        type="text"
        value={ip}
        id="ip-input-field"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter IP address"
      />
      <button 
      className='rounded mx-2 bg-flixGreen font-bold py-2 px-4 text-xl text-flixBlack hover:bg-flixBlack hover:text-flixGreen active:bg-flixBlack  active:text-flixGreen'
      onClick={handleLookup} 
      disabled={loading}>
        {/*Start--- Ladeanimation */}
        {loading ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          'Lookup'
        )}
        {/*Ende--- Ladeanimation */}
      </button>

      {/* Start---- Fehlermeldung darstellen */}
      {error && <p className='text-red'>{error}</p>}
      {/* Ende---- Fehlermeldung darstellen */}

      {/* Start---- unbekanten Response darstellen */}
      {data && (
        <div>
        {Object.entries(data).map(([key, value]) => (
          <p key={key}>
            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {String(value)}
          </p>
        ))}
      </div>
      )}
      {/* Ende---- unbekanten Response darstellen */}
      </Field>
    </div>
  );
};

export default IpLookup;
