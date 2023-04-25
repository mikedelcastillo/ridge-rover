
#include "steering.h"
#include "throttle.h"
#include "comms.h"
#include "timing.h"

Steering steering;
Throttle throttle;
Comms comms;

void setup()
{
  steering.setup();
  throttle.setup();
  comms.setup();
}

void loop()
{
  comms.update();
  receive();
  transmit();

  steering.update();
  throttle.update();
}

void receive()
{
  CommType type = comms.getType();
  if (comms.is(BYTE_MOVE, 3))
  {
    float steerValue = comms.parseRangeFloat(comms.buffer[1]);
    float throttleValue = comms.parseRangeFloat(comms.buffer[2]);
    steering.targetSteer = steerValue;
    throttle.targetThrottle = throttleValue;
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

Timing tTransmit{TIMING_MILLIS, 20};

void transmit()
{
  if (!tTransmit.poll())
    return;

  Serial.print((char) steering.state);
  Serial.print((char) comms.encodeFloatRange(steering.currentSteer));
  Serial.print((char) comms.encodeFloatRange(steering.targetSteer));
  Serial.print((char) comms.encodeFloatRange(throttle.targetThrottle));
  Serial.print("\n");
}