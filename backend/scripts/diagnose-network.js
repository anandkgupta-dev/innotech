import dns from 'dns/promises';
import net from 'net';

async function diagnose() {
  const host = 'cluster0.rwrcxni.mongodb.net';
  const srvHost = `_mongodb._tcp.${host}`;

  console.log('=== MongoDB Atlas Diagnostic Tool ===');
  console.log(`Checking host: ${host}`);

  // 1. DNS SRV Lookup
  let srvRecords = [];
  try {
    srvRecords = await dns.resolveSrv(srvHost);
    console.log('✓ DNS SRV resolution SUCCESS:');
    srvRecords.forEach((r) => console.log(`  - ${r.name}:${r.port} (priority: ${r.priority}, weight: ${r.weight})`));
  } catch (err) {
    console.error('✗ DNS SRV resolution FAILED:', err.message);
    return;
  }

  // 2. DNS TXT Lookup
  try {
    const txtRecords = await dns.resolveTxt(host);
    console.log('✓ DNS TXT options resolution SUCCESS:', txtRecords.map((t) => t.join('')).join(', '));
  } catch (err) {
    console.log('ℹ DNS TXT resolution note:', err.message);
  }

  // 3. TCP Reachability on port 27017 for each node
  console.log('\nTesting direct TCP/TLS port reachability (port 27017):');
  for (const record of srvRecords) {
    process.stdout.write(`  Connecting to ${record.name}:${record.port}... `);
    const start = Date.now();
    await new Promise((resolve) => {
      const socket = net.createConnection({ host: record.name, port: record.port, timeout: 6000 }, () => {
        const ms = Date.now() - start;
        console.log(`CONNECTED in ${ms}ms! (Network path is open)`);
        socket.destroy();
        resolve(true);
      });

      socket.on('timeout', () => {
        const ms = Date.now() - start;
        console.log(`TIMEOUT after ${ms}ms (Firewall / Atlas IP access rule blocking connection)`);
        socket.destroy();
        resolve(false);
      });

      socket.on('error', (err) => {
        const ms = Date.now() - start;
        console.log(`ERROR (${err.code || err.message}) after ${ms}ms`);
        resolve(false);
      });
    });
  }
}

diagnose();
