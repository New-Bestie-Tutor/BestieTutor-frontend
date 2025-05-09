import Start from './Start';
import Login from './Login';

export default function CombinedPage() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, borderRight: '1px solid #ccc' }}>
        <Start />
      </div>
      <div style={{ flex: 1 }}>
        <Login />
      </div>
    </div>
  );
}