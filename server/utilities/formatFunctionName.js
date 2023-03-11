function formatFunctionName(item) {
  let method = item.methodId
  if (method == "0x") method = "Transfer"
  if (item.functionName && item.functionName.length) {
    camelCase = item.functionName
    let capitalized = camelCase[0].toUpperCase() + camelCase.substring(1)
    method = capitalized
      .split("(")[0]
      .replace(/([A-Z])/g, " $1")
      .trim()
  }
  return method
}

module.exports = formatFunctionName
