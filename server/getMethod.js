const dictionary = {
  "0x7ff36ab5": "Swap",
  "0x095ea7b3": "Approve",
  "0x38ed1739": "Swap",
  "0x2e1a7d4d": "Withdraw",
  "0x": "Transfer",
  "0xa1db9782": "Withdraw",
}

function getMethod(methodId) {
  let name = dictionary[methodId]
  if (name != undefined) return name
  return methodId
}

module.exports = getMethod
