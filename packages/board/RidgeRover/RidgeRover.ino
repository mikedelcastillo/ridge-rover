
#include "steering.h"
#include "comms.h"
#include "timing.h"

Steering steering;
Comms comms;
Timing debug(MILLIS, 10);

void setup()
{
  steering.setup();
  comms.setup();
}

void loop()
{
  comms.update();

  steering.update();
  if (Serial.available() > 0)
  {
    float input = comms.parseRangeFloat(Serial.read());
    steering.targetSteer = input;
    Serial.println(input);
  }

  if(debug.poll()){
    steering.debug();
  }
}