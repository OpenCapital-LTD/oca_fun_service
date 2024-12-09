import { useState } from 'react';

const usePushMessage = () => {
  const [messageType, setMessageType] = useState('');
  const [response, setResponse] = useState(null);

  const pushMessage = (message, type) => {
    setMessageType(type);
    setResponse(message);
    setTimeout(() => {
      setResponse(null);
    }, 3000);
  };

  return {
    messageType,
    response,
    pushMessage,
  };
};

export default usePushMessage;
