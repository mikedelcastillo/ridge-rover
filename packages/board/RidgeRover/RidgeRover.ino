void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(115200);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  Serial.println("LIGHT_ON");
  delay(100);
  digitalWrite(LED_BUILTIN, LOW);
  Serial.println("LIGHT_OFF");
  delay(100);
}