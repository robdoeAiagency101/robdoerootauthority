const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const neo4j = require('neo4j-driver');
const axios = require('axios');

// Hardcoded System Infrastructure Targets for espVmark.robdoe.32
const PORT_PATH = 'COM10';
const BAUD_RATE = 115200;
const INGEST_URL = 'http://192.168.1';

// Neo4j Database Authority Constraints
const driver = neo4j.driver('bolt://192.168.1.101:7687', neo4j.auth.basic('neo4j', 'password'));

console.log('=====================================================================');
console.log('? NODE.JS JUBILEE SINGULARITY ENGINE ONLINE');
console.log('=====================================================================');

// Establish Low-Latency Serial Interface Conduit
const port = new SerialPort({ path: PORT_PATH, baudRate: BAUD_RATE }, (err) => {
    if (err) {
        console.error(`[-] Serial Link Allocation Error on ${PORT_PATH}:`, err.message);
        console.error('[!] Verify no other process is holding COM10 open.');
        process.exit(1);
    }
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));
console.log(`[+] Bound to Hardware Link Layer on ${PORT_PATH} at ${BAUD_RATE} Baud.`);

// Main Non-Forced Asynchronous Event Loop
parser.on('data', async (rawLine) => {
    const cleanLine = rawLine.trim();
    if (!cleanLine) return;

    console.log(`[Node Output] -> ${cleanLine}`);

    // Intercept Metric Signatures and Extract Float Vectors Natively
    if (cleanLine.includes('Biometric Input') || cleanLine.includes('Calculated Anchor')) {
        const matches = cleanLine.match(/[-+]?\d*\.\d+|\d+/g);
        if (matches && matches.length > 0) {
            const extractedMetric = parseFloat(matches[0]);
            const calculatedTheta = (extractedMetric * 0.0174533) % (2 * Math.PI);
            const epochTicks = Math.floor(Date.now() / 1000);

            console.log(`  +-- [Parsed Metric: ${extractedMetric}] -> Calculated Theta: ${calculatedTheta.toFixed(6)} rad`);

            // 1. Dispatch Upstream Payload via Port 8080 API Gateway (Node to Node)
            try {
                await axios.post(INGEST_URL, {
                    node: 'espVmark.robdoe.32',
                    metric: extractedMetric,
                    consensus_status: 'JUBILEE_UNIFIED'
                }, { timeout: 1000 });
            } catch (err) {
                // Failsafe channel catch - silences downstream port timeouts
            }

            // 2. Map Direct Topological Wave Vector Shift into Neo4j Graph Space
            const session = driver.session();
            try {
                const cypher = `
                    MERGE (h:HexCell {hex_id: 'HEX_Q0_R' + toString($idx)})
                    ON MATCH SET h.theta = $theta, h.last_sync = $epoch
                    ON CREATE SET h.q = $idx, h.r = -$idx, h.theta = $theta, h.omega = 0.5, h.node_id = 'espVmark.robdoe.32'
                `;
                await session.run(cypher, {
                    idx: epochTicks % 7,
                    theta: calculatedTheta,
                    epoch: neo4j.int(epochTicks)
                });
            } catch (graphErr) {
                console.error('  +-- [!] Neo4j Transaction Refused. Check if your Docker container is listening.');
            } finally {
                await session.close();
            }

            // 3. Command the physical ESP32-C6 NeoPixel LED to echo the stable Sky Blue state code
            // Bypasses evaluation lag entirely by writing clean byte buffers back down the pipe
            port.write('LED:0,191,255,SOLID_STEADY\n');
        }
    }
});

// Graceful Containment Shutdown Gate
process.on('SIGINT', async () => {
    console.log('\n[*] Safely unbinding Node.js process recording engines...');
    port.close();
    await driver.close();
    process.exit(0);
});


// Keep-Alive Hold: Prevents the event loop from collapsing between the 12s hardware refresh frames
setInterval(() => {}, 1000);
