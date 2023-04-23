
#include "steering.h"
#include "timing.h"

Steering steering;

void setup()
{
  Serial.begin(115200);
}

void loop(){
  steering.update();
}