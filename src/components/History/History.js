import React, { useEffect, useState } from 'react';
import axios from '../../axios-submit';

const History = () => {
  const [message, setMessage] = useState([]);

  useEffect(() => {
    axios
      .get('/text.json')
      .then((res) => {
        const fetchedMessage = [];
        for (let key in res.data) {
          fetchedMessage.push({
            ...res.data[key],
            id: key,
          });
        }
        setMessage(fetchedMessage);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1>History</h1>
      <div>
        {message.map((item) => (
          <p key={item.id}>{item.message}</p>
        ))}
      </div>
    </div>
  );
};

export default History;
