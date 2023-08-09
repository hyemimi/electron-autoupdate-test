import Sample from 'components/Sample';
import { ipcRenderer } from 'electron';
import { useEffect } from 'react';

const App = () => {

  useEffect(() => {

    ipcRenderer.send('hi');

  },[]);

  return (
    <div className="container">
      <Sample />
    </div>
  );
};

export default App;