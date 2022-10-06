export function openInNewTab(url) {
  window.open(url, "_blank").focus()
}

export function openInExplorerNewTab(ca, chainId) {
  let url
  if (chainId == 56) {
    url = "https://bscscan.com/address/"
  } else if (chainId == 1) {
    url = "https://etherscan.com/address/"
  } else if (chainId == 5) {
    url = "https://goerli.etherscan.io/address/"
  }
  window.open(url + ca, "_blank").focus()
}
