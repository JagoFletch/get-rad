import React from 'react';
import VersionBadge from './components/VersionBadge';
import packageJson from '../package.json';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Get Rad</h1>
      </header>
      <VersionBadge version={packageJson.version} />
    </div>
  );
}

export default App;
