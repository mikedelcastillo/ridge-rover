
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

  CommType type = comms.getType();
  if(type == MOVE && comms.bufferLength == 3){
    float steer = comms.parseRangeFloat(comms.buffer[1]);
    float throttle = comms.parseRangeFloat(comms.buffer[2]);
    steering.targetSteer = steer;
    comms.flush();
  }

  steering.update();

  if(debug.poll()){
    steering.debug();
  }
}