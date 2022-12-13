function fetchme() {
  let response = fetch(
    "https://api.bscscan.com/api?module=account&action=txlist&address=0x1bc1BD972a41E923562E2C06d5AD9f82BbbbAC3B&startblock=0&endblock=99999999&apikey=IUPTAAWI49U3NRWBXQDMJ8ZVM3GRZ987QU"
  )
    .then((response) => response.json())
    .then((response) => response.result)
  return response
}

async function bscScanFetch(walletCA) {
  let response = await fetch(
    `https://api.bscscan.com/api?module=account&action=txlist&address=${walletCA}&startblock=0&endblock=99999999&apikey=IUPTAAWI49U3NRWBXQDMJ8ZVM3GRZ987QU`
  )
  let result = await response.json()
  return result.result
}

async function main() {
  let result = await bscScanFetch("0x1bc1BD972a41E923562E2C06d5AD9f82BbbbAC3B")
  console.log(result)
}

main()
