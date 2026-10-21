import tls from 'tls';

const host = 'ac-tbvnuw2-shard-00-00.rwrcxni.mongodb.net';
const port = 27017;

console.log(`Testing TLS Handshake to ${host}:${port}...`);

const socket = tls.connect(
  {
    host,
    port,
    servername: host,
    timeout: 8000,
  },
  () => {
    console.log('✓ TLS Handshake SUCCESS!');
    console.log('Authorized:', socket.authorized);
    console.log('Protocol:', socket.getProtocol());
    console.log('Cipher:', socket.getCipher());
    socket.destroy();
  }
);

socket.on('timeout', () => {
  console.log('✗ TLS Handshake TIMED OUT');
  socket.destroy();
});

socket.on('error', (err) => {
  console.log('✗ TLS Handshake ERROR:', err.message);
});
