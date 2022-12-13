import fetch from "node-fetch"

function getMethodName(id) {
  const res = fetch(
    `https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=${id}`
  )
    .then((res) => res.json())
    .then((res) => {
      if (res.count > 0) return res.results[0].text_signature
      return "unregistered"
    })
  return res
}

const list = [
  "0xd0e30db0",
  "0xf242432a",
  "0xa22cb465",
  "0xfb0f3ee1",
  "0xab834bab",
  "0xf14fcbc8",
  "0x12345678",
]

let promises = []

for (const id of list) {
  promises.push(getMethodName(id))
}

Promise.all(promises).then((res) => console.log(res))
