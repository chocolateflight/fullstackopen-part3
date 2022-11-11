import { useEffect, useState } from 'react';
import './Notification.css';

const Notification = (props) => {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMessage(props.notification.message);
    setError(props.notification.error);

    setTimeout(() => {
      setMessage(null);
      setError(null);
    }, 5000);
  }, [props.notification]);

  return (
    <>{message !== null && <div className={`notification ${error}`}>{message}</div>}</>
  );
};

export default Notification;
