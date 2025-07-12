import { Button } from '@oreliya/ui';

function App() {
  const handleClick = () => {
    // eslint-disable-next-line no-alert
    alert('Hello from Oreliya!');
  };

  return (
    <div className='app'>
      <header className='app-header'>
        <h1>Welcome to Oreliya</h1>
        <p>Your full-stack monorepo is ready!</p>
        <Button variant='primary' onClick={handleClick}>
          Get Started
        </Button>
      </header>
    </div>
  );
}

export default App;
