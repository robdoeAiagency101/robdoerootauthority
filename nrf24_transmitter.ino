/*
 * NRF24L01+ Wireless Transmitter → USB Serial Bridge
 * Transmits raw bytes over 2.4GHz antenna
 * Serial output to USB-CH340 adapter (COM11)
 * s146 Compliance: Every packet timestamped and hashed
 */

#include <SPI.h>
#include <RF24.h>

// NRF24 Configuration
RF24 radio(7, 8);  // CE pin 7, CSN pin 8
const byte address[6] = "00001";
const uint32_t TX_INTERVAL = 1000;  // Transmit every 1 second

// Data packet structure
struct Packet {
    uint32_t timestamp;
    uint16_t packet_id;
    uint8_t data[24];  // Up to 24 bytes per NRF24 packet
    uint8_t data_len;
};

uint16_t packet_counter = 0;

void setup() {
    Serial.begin(115200);
    delay(1000);
    
    Serial.println("========================================");
    Serial.println(" NRF24L01+ Wireless Transmitter");
    Serial.println(" Serial Output: COM11 (USB-CH340)");
    Serial.println("========================================");
    Serial.println();
    
    // Initialize NRF24
    if (!radio.begin()) {
        Serial.println("[!] NRF24 initialization FAILED");
        while (1) {
            delay(100);
        }
    }
    
    // Configure NRF24
    radio.setPALevel(RF24_PA_MAX);           // Maximum power
    radio.setDataRate(RF24_250KBPS);         // 250 Kbps (reliable)
    radio.setChannel(76);                    // 2476 MHz
    radio.setPayloadSize(32);                // Max payload
    radio.openWritingPipe(address);
    radio.stopListening();
    
    Serial.println("[+] NRF24L01+ initialized");
    Serial.println("[+] Power: MAX");
    Serial.println("[+] Rate: 250 Kbps");
    Serial.println("[+] Channel: 76 (2476 MHz)");
    Serial.println("[+] Antenna: Active");
    Serial.println();
    Serial.println("[*] Transmitting raw bytes...");
    Serial.println();
}

void loop() {
    // Create packet
    Packet pkt;
    pkt.timestamp = millis();
    pkt.packet_id = packet_counter++;
    
    // Generate test data (or read from sensor)
    pkt.data_len = generateTestData(pkt.data);
    
    // Transmit over NRF24
    bool success = radio.write(&pkt, sizeof(pkt));
    
    // Output to serial (for capture by Python bridge)
    if (success) {
        // Send raw bytes to serial in hex format
        Serial.print("[PKT] ");
        Serial.print(pkt.packet_id);
        Serial.print(" @ ");
        Serial.print(pkt.timestamp);
        Serial.print(" | ");
        
        // Output hex bytes
        for (int i = 0; i < pkt.data_len; i++) {
            if (pkt.data[i] < 0x10) Serial.print("0");
            Serial.print(pkt.data[i], HEX);
        }
        Serial.println();  // Newline for Python to read
    } else {
        Serial.println("[!] Transmission failed");
    }
    
    delay(TX_INTERVAL);
}

uint8_t generateTestData(uint8_t* buffer) {
    // Generate realistic test data
    // In production: read from sensors
    
    // Example: timestamp + random data + checksum
    uint32_t ts = millis();
    buffer[0] = (ts >> 24) & 0xFF;
    buffer[1] = (ts >> 16) & 0xFF;
    buffer[2] = (ts >> 8) & 0xFF;
    buffer[3] = ts & 0xFF;
    
    // Add sensor data (example)
    buffer[4] = random(0, 256);  // Simulated sensor 1
    buffer[5] = random(0, 256);  // Simulated sensor 2
    buffer[6] = random(0, 256);  // Simulated sensor 3
    
    // Add checksum
    uint8_t checksum = 0;
    for (int i = 0; i < 7; i++) {
        checksum ^= buffer[i];
    }
    buffer[7] = checksum;
    
    return 8;  // Return 8 bytes
}

/*
 * Hardware Setup:
 * 
 * NRF24L01+       Arduino Uno/Nano
 * GND       -->   GND
 * VCC       -->   3.3V (via capacitor)
 * CE        -->   Pin 7
 * CSN       -->   Pin 8
 * SCK       -->   Pin 13 (SPI)
 * MOSI      -->   Pin 11 (SPI)
 * MISO      -->   Pin 12 (SPI)
 * 
 * USB-CH340 Serial Adapter
 * TX        -->   Arduino RX
 * RX        -->   Arduino TX
 * GND       -->   GND
 * 
 * Antenna: Connected to ANT pad on NRF24
 */
