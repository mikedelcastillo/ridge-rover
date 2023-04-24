
#include "steering.h"
#include "comms.h"
#include "timing.h"

Steering steering;
Comms comms;

void setup()
{
  steering.setup();
  comms.setup();
}

void loop()
{
  comms.update();
  communicate();

  steering.update();
}

void communicate()
{
  CommType type = comms.getType();
  if (comms.is(BYTE_MOVE, 3))
  {
    float steer = comms.parseRangeFloat(comms.buffer[1]);
    float throttle = comms.parseRangeFloat(comms.buffer[2]);
    steering.targetSteer = steer;
    comms.flush();
  }
  if (comms.is(BYTE_CALIBRATE))
  {
    steering.setState(STEER_CALIBRATE);
    comms.flush();
  }
  if (comms.is(BYTE_IGNORE))
    comms.flush();
}