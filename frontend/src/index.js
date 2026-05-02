import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN;
const auth0ClientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const auth0Audience = process.env.REACT_APP_AUTH0_AUDIENCE;
// Default to local/frontend-only mode unless explicitly set to false.
const authDisabled = process.env.REACT_APP_DISABLE_AUTH !== 'false';

if (!authDisabled && (!auth0Domain || !auth0ClientId || !auth0Audience)) {
  root.render(
    <React.StrictMode>
      <div style={{ maxWidth: '700px', margin: '48px auto', fontFamily: 'Arial, sans-serif', lineHeight: '1.5' }}>
        <h1>Missing frontend Auth0 configuration</h1>
        <p>Create <code>frontend/.env</code> and set:</p>
        <ul>
          <li><code>REACT_APP_AUTH0_DOMAIN</code></li>
          <li><code>REACT_APP_AUTH0_CLIENT_ID</code></li>
          <li><code>REACT_APP_AUTH0_AUDIENCE</code></li>
        </ul>
        <p>You can copy <code>frontend/.env.example</code> then restart the frontend.</p>
      </div>
    </React.StrictMode>,
  );
} else {
  root.render(
    <React.StrictMode>
      {authDisabled ? (
        <App authDisabled />
      ) : (
        <Auth0Provider
          domain={auth0Domain}
          clientId={auth0ClientId}
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience: auth0Audience,
          }}
        >
          <App authDisabled={false} />
        </Auth0Provider>
      )}
    </React.StrictMode>,
  );
}
