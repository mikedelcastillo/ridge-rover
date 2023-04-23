
#include "steering.h"
#include "timing.h"

Steering steering;

Timing debug(MILLIS, 10);

void setup()
{
  Serial.begin(115200);
  Serial.println("START");
}

void loop(){
  steering.update();
  if(debug.poll()){
    steering.debug();
  }
}