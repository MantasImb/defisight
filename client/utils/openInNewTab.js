export function openInNewTab(url) {
  window.open(url, "_blank").focus()
}

export function openInExplorerNewTab(ca, chainId) {
  let url = "https://goerli.etherscan.io/address/"
  if (chainId == 56) {
    url = "https://bscscan.com/address/"
  } else if (chainId == 1) {
    url = "https://etherscan.com/address/"
  }
  window.open(url + ca, "_blank").focus()
}

export function openTxInExplorerNewTab(ca, chainId) {
  let url = "https://goerli.etherscan.io/tx/"
  if (chainId == 56) {
    url = "https://bscscan.com/tx/"
  } else if (chainId == 1) {
    url = "https://etherscan.com/tx/"
  }
  window.open(url + ca, "_blank").focus()
}
