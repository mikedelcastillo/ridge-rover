#define PIN_STEER_ENA 11
#define PIN_STEER_DIR 12
#define PIN_STEER_PUL 13
#define PIN_STEER_POT A0

#define STEER
#define STEER_ENABLE LOW
#define STEER_DISABLE HIGH
#define STEER_PULSE_LENGTH 50
#define STEER_LEFT HIGH
#define STEER_RIGHT LOW

float steerPotMinValue = 1025;
float steerPotMaxValue = -1;
float steer = 0; // -1 Left, 0 Center 1, Right,

void setup() {
  pinMode(PIN_STEER_POT, INPUT);
  pinMode(PIN_STEER_ENA, OUTPUT);
  pinMode(PIN_STEER_DIR, OUTPUT);
  pinMode(PIN_STEER_PUL, OUTPUT);
  Serial.begin(115200);
  int steps = 100;
  int stepDelay = 20;
  digitalWrite(PIN_STEER_DIR, STEER_LEFT);
  for(int i = 0; i < steps; i++){
    steerPulse();
    delay(stepDelay);
    logPot();
  }
  digitalWrite(PIN_STEER_DIR, STEER_RIGHT);
  for(int i = 0; i < steps; i++){
    steerPulse();
    delay(stepDelay);
    logPot();
  }
}


void logPot(){
  float potRawValue = analogRead(PIN_STEER_POT);
  float potValue = log(potRawValue)/log(10) * 10;
  steerPotMinValue = min(steerPotMinValue, potValue);
  steerPotMaxValue = max(steerPotMaxValue, potValue);
  float range = steerPotMaxValue - steerPotMinValue;
  float center = steerPotMinValue + range / 2;
  float diff = potValue - center;
  steer = diff / range * 2;
  // Serial.print(potRawValue);
  // Serial.print("\t");
  // Serial.print(potValue);
  // Serial.print("\t");
  // Serial.print(steerPotMinValue);
  // Serial.print("\t");
  // Serial.print(steerPotMaxValue);
  // Serial.print("\t");
  // Serial.print(range);
  // Serial.print("\t");
  // Serial.print(center);
  // Serial.print("\t");
  // Serial.print(diff);
  // Serial.print("\t");
  // Serial.println(steer);
}

float tol = 0.12;
float steerTarget = 0;

void loop() {
  logPot();
  bool changed = false;
  if(steer < steerTarget - tol){
    digitalWrite(PIN_STEER_ENA, STEER_ENABLE);
    digitalWrite(PIN_STEER_DIR, STEER_LEFT);
    steerPulse();
    changed = true;
  }
  if(steer > steerTarget + tol){
    digitalWrite(PIN_STEER_ENA, STEER_ENABLE);
    digitalWrite(PIN_STEER_DIR, STEER_RIGHT);
    steerPulse();
    changed = true;
  }
  if(!changed){
    digitalWrite(PIN_STEER_ENA, STEER_DISABLE);
  }
  delay(1);
  if(Serial.available() > 0){
    steerTarget = Serial.parseFloat();
  }
  steerTarget = sin((float)millis()/1000.0 / 1);
}

void steerPulse(){
  digitalWrite(PIN_STEER_PUL, HIGH);
  delayMicroseconds(STEER_PULSE_LENGTH);
  digitalWrite(PIN_STEER_PUL, LOW);
}