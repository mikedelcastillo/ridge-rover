import os from "os"

export const getCpuUsage = () => {
    const cpus = os.cpus()
    for(const cpu of cpus){
        let total = 0
        for(const num of Object.values(cpu.times))
            total += num

        for(const type in cpu.times){

        }
    }
}