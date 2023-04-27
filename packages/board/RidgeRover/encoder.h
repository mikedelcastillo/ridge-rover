#include <Arduino.h>
#include "timing.h"

#define PIN_IR_OUT A1
#define WHEEL_ENCODER_SAMPLING_DURATION_MS 50

class WheelEncoder {
    private:
        int count = 0;
        bool prevState = false;
        bool currState = false;
        Timing tState{TIMING_MILLIS, WHEEL_ENCODER_SAMPLING_DURATION_MS};
    public:
        int tps = 0;

        void setup(){
            pinMode(PIN_IR_OUT, INPUT);
        };

        void update(){
            if(tState.poll()){
                tps = count * (1000 / WHEEL_ENCODER_SAMPLING_DURATION_MS);
                count = 0;
            }

            prevState = currState;
            currState = digitalRead(PIN_IR_OUT) == 1 ? true : false;
            if(prevState == false && currState == true){
                count++;
            }
        };


};