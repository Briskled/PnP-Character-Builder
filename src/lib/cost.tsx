const costSteps = [0, 1, 1, 1, 1, 2, 2, 3]

let curr = 0
const fullCostMap = costSteps.map((a) => {
    curr += a
    return curr
})

export const getFullCost = (targetValue: number) => {
    return fullCostMap[targetValue+2]
}

export const getCostStep = (value: number) => {
    return costSteps[value+2]
}