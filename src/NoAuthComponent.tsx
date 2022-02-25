import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface NoAuthComponentProps {
  element: JSX.Element;
}

export default function NoAuthComponent(props: NoAuthComponentProps) {
  const [redirect, setRedirect] = useState<boolean | undefined>();

  useEffect(() => {
    fetch(process.env.REACT_APP_SERVICE_URL + 'checkToken', {credentials: 'include'}).then(res => {
      if (res.status === 200) {
        setRedirect(true);
      } else {
        setRedirect(false);
        throw res.text();
      }
    }).catch(err => {
      console.error(err);
      setRedirect(false);
    });
  }, []);

  return (<>
    {redirect === undefined ? null : redirect ? <Navigate to='/'/> : props.element}
  </>);
}