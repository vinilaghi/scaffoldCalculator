import './App.css';
import ScaffoldList from './ScaffoldList'
import { EuiProvider } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.css';

function App() {
  return (
    <EuiProvider colorMode="dark">

    <div className="App">
      <header className="App-header">
        <p>
         Scaffold calculator
        </p>
      </header>
      <div className='main'>
      <ScaffoldList />
      </div>

    </div>
    </EuiProvider>
  );
}

export default App;
