/*
   RobDoe // CIRCADIAN CYCLE BIO-LAYER CONTROLLER
   Target: ESP32 Dev Module (Arduino Framework)
   Integrates biological time blocks with native hardware telemetry.
*/

#include <Arduino.h>

// Define hardware pins mapping to the localized spectral arrays
const int RED_PIN    = 25; // Muladhara / Grounding (Night / Sleep)
const int YELLOW_PIN = 26; // Manipura / Execution Power (Noon / Peak Focus)
const int CYAN_PIN   = 27; // Vishuddha / Expression (Evening / Integration)

// Sovereign 4-Quadrant Circadian State Engine
enum CircadianPhase {
    PHASE_REST = 0,      // 00:00 - 06:00 -> Grounding / Recovery (Red)
    PHASE_ASCENT = 1,    // 06:00 - 12:00 -> Creative Ignition
    PHASE_PEAK = 2,      // 12:00 - 18:00 -> Absolute Power (Yellow)
    PHASE_DESCENT = 3    // 18:00 - 00:00 -> Clear Expression (Cyan)
};

CircadianPhase currentPhase = PHASE_REST;
unsigned long lastStateUpdate = 0;

void updateHardwareProfile(CircadianPhase phase) {
    switch(phase) {
        case PHASE_REST:
            analogWrite(RED_PIN, 255); analogWrite(YELLOW_PIN, 0); analogWrite(CYAN_PIN, 0);
            Serial.println("[BIO-LATTICE] Phase: Rest/Recovery. Muladhara active.");
            break;
        case PHASE_PEAK:
            analogWrite(RED_PIN, 0); analogWrite(YELLOW_PIN, 255); analogWrite(CYAN_PIN, 0);
            Serial.println("[BIO-LATTICE] Phase: Peak Execution. Manipura active.");
            break;
        case PHASE_DESCENT:
            analogWrite(RED_PIN, 0); analogWrite(YELLOW_PIN, 0); analogWrite(CYAN_PIN, 255);
            Serial.println("[BIO-LATTICE] Phase: Expression/Clear. Vishuddha active.");
            break;
        default:
            analogWrite(RED_PIN, 50); analogWrite(YELLOW_PIN, 50); analogWrite(CYAN_PIN, 50);
            break;
    }
}

void setup() {
    Serial.begin(115200);
    pinMode(RED_PIN, OUTPUT);
    pinMode(YELLOW_PIN, OUTPUT);
    pinMode(CYAN_PIN, OUTPUT);
    Serial.println("[NODE INITIALIZED] ESP32 Circadian Biosphere Node Layer Connected.");
    updateHardwareProfile(currentPhase);
}

void loop() {
    // Check for real-time state overrides sent from Copilot / Terminal Engine
    if (Serial.available() > 0) {
        String command = Serial.readStringUntil('\n');
        command.trim();
        
        if (command == "SET_PHASE_REST")    { currentPhase = PHASE_REST;    updateHardwareProfile(currentPhase); }
        if (command == "SET_PHASE_PEAK")    { currentPhase = PHASE_PEAK;    updateHardwareProfile(currentPhase); }
        if (command == "SET_PHASE_DESCENT") { currentPhase = PHASE_DESCENT; updateHardwareProfile(currentPhase); }
        
        Serial.print("[TOKEN_RESOLVED] State hard-switched to: ");
        Serial.println(command);
    }
    delay(1000);
}
