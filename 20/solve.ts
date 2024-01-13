import { parseFile, Module } from './parse'
import { lcm } from '../utils/math'

const modules = parseFile('input.txt');

type Pulse = "low" | "high";

type Event = {
    source: string,
    target: string,
    pulse: Pulse,
}
const eventQueue: Event[] = [];

function pushButton() {
    eventQueue.push({
        source: "root",
        target: "broadcaster",
        pulse: "low",
    });
}

function processEvent(event: Event, buttonCount: number) {
    const module = modules[event.target];
    let newPulse: Pulse = event.pulse;
    if (!module) {
        return;
    }
    if (module.type === "%") {
        if (event.pulse === "high") {
            return;
        }
        module.state = module.state === "off" ? "on" : "off";
        newPulse = module.state === "off" ? "low" : "high"
        module.firstHigh = module.firstHigh === -1 ? buttonCount : module.firstHigh;
    }

    if (module.type === "&") {
        module.state[event.source] = event.pulse;
        newPulse = Object.values(module.state).every(pulse => pulse === "high") ? "low" : "high";
    }

    module.outputs.forEach((output: string) => {
        eventQueue.push({
            source: module.name,
            target: output,
            pulse: newPulse,
        });
    })
}

function isLow(firstHigh: number, currentCycle: number) {
    return currentCycle % (firstHigh * 2) === 0
}

function isHigh(firstHigh: number, currentCycle: number) {
    if (currentCycle % firstHigh === 0) {
        return !isLow(firstHigh, currentCycle);
    } 
    return Math.floor(currentCycle/firstHigh) % 2 === 1;
}

function solve() {
    let lowCount = 0;
    let highCount = 0;
    const cycles = 1000;

    for (let i = 1; i <= cycles * 3; i++) {
        pushButton();
        while (eventQueue.length > 0) {
            const event = eventQueue.shift()!;
            if (i <= cycles) {
                event.pulse === "low" ? lowCount++ : highCount++;
            }
            processEvent(event, i);
        }
    }
    console.log("part 1:", lowCount * highCount);

    const firstLevelConjunction = Object.keys(modules["hb"].state).map(key => modules[key]);
    const secondLevelConjunction: Module[] = [];
    firstLevelConjunction.forEach(module => {Object.keys(module.state).forEach(key => secondLevelConjunction.push(modules[key]))})

    const watchFlops = secondLevelConjunction.map(module => {
        const inputStats = Object.keys(module.state).map(key => {
            const inputModule = modules[key];
            return inputModule.firstHigh;
        })
        return inputStats;
    })
    const highestPeriod = watchFlops.reduce((acc, arr) => Math.max(acc,arr.reduce((acc, val) => Math.max(acc, val) , 1)), 1);
    const ConjunctionPeriods  = watchFlops.map(_ => 0);
    for (let i = 1; i <= 1000; i++) {
        const current = i * 4 + 1 + highestPeriod;
        
        for (let index = 0; index < watchFlops.length; index++) {
            if (watchFlops[index].every(val => isHigh(val, current))) {
                ConjunctionPeriods [index] = ConjunctionPeriods [index] === 0 ? current: ConjunctionPeriods [index];
            }
        }
        
        if (ConjunctionPeriods .every(val => val !== 0)) {
            break;
        }
    }
    console.log("part 2: ", lcm(...ConjunctionPeriods));
}

solve();