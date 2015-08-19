/**
 * ARCADE-COMMANDER
 *
 * This sketch sends HID messages that arcade-commander scripts understand.
 * Make sure to select "Raw HID" from the "Tools > USB Type" menu.
 */

#include <Bounce.h>

const int PIN_BTN_RED = 8;
const int PIN_BTN_BLUE = 10;
const int PIN_LED_1 = 13;

Bounce redButton = Bounce(PIN_BTN_RED, 50);

bool redPressed = false;
bool bluePressed = false;

void setup() {
  Serial.begin(9600);
  Serial.println(F("RawHID Example"));
  for (int i=0; i<7; i++) {
    pinMode(i, OUTPUT);
  }
  
  pinMode(PIN_BTN_RED, INPUT_PULLUP);
  pinMode(PIN_BTN_BLUE, INPUT_PULLUP);
  pinMode(PIN_LED_1, OUTPUT);
}

// RawHID packets are always 64 bytes
byte buffer[64];
elapsedMillis msUntilNextSend;
unsigned int packetCount = 0;

void loop() {
  int n;
  n = RawHID.recv(buffer, 0); // 0 timeout = do not wait
  if (n > 0) {
    // the computer sent a message.  Display the bits
    // of the first byte on pin 0 to 7.  Ignore the
    // other 63 bytes!
    Serial.print(F("Received packet, first byte: "));
    Serial.println((int)buffer[0]);
    for (int i=0; i<8; i++) {
      int b = buffer[0] & (1 << i);
      digitalWrite(i, b);
    }
  }
  
  redButton.update();
  
  
  int redValue = redButton.read();
  
  if (redButton.fallingEdge()) {
    Serial.print(F("on\n"));
    ledOn();
    sendRedOn();
  } else if (redButton.risingEdge()) {
    Serial.print(F("off\n"));
    ledOff();
    sendRedOff();
  }
  
}

void ledOn() {
  digitalWrite(PIN_LED_1, HIGH);
}

void ledOff() {
  digitalWrite(PIN_LED_1, LOW);
}

void sendRedOn() {
  sendHIDMessage(0x00, 0x01);
}


void sendRedOff() {
  sendHIDMessage(0x00, 0x00);
}

void sendHIDMessage(byte byte2, byte byte3) {
  
  //Signature
  buffer[0] = 0xAB;
  buffer[1] = 0xCD;
  
  //Parameters
  buffer[2] = byte2;
  buffer[3] = byte3;
  
  //fill the rest with zeros
  for (int i = 4; i < 62; i++) {
    buffer[i] = 0x00;
  }

  // and put a count of packets sent at the end
  buffer[62] = highByte(packetCount);
  buffer[63] = lowByte(packetCount);

  // actually send the packet
  int n = RawHID.send(buffer, 100);
  if (n > 0) {
    Serial.print(F("Transmit packet "));
    Serial.println(packetCount);
    packetCount = packetCount + 1;
  } else {
    Serial.println(F("Unable to transmit packet"));
  }
  
  /*
  // every 2 seconds, send a packet to the computer
  if (msUntilNextSend > 2000) {
    msUntilNextSend = msUntilNextSend - 2000;
    // first 2 bytes are a signature
    buffer[0] = 0xAB;
    buffer[1] = 0xCD;
    // next 24 bytes are analog measurements
    for (int i=0; i<12; i++) {
      int val = analogRead(i);
      buffer[i * 2 + 2] = highByte(val);
      buffer[i * 2 + 3] = lowByte(val);
    }
    // fill the rest with zeros
    for (int i=26; i<62; i++) {
      buffer[i] = 0;
    }
    // and put a count of packets sent at the end
    buffer[62] = highByte(packetCount);
    buffer[63] = lowByte(packetCount);
    // actually send the packet
    n = RawHID.send(buffer, 100);
    if (n > 0) {
      Serial.print(F("Transmit packet "));
      Serial.println(packetCount);
      packetCount = packetCount + 1;
    } else {
      Serial.println(F("Unable to transmit packet"));
    }
  }
  */
}

