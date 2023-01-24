export function openInNewTab(url) {
  window.open(url, "_blank").focus()
}

export function openInExplorerNewTab(ca, chainId) {
  let url = `https://goerli.etherscan.io/address/${ca}`
  if (chainId == 56) {
    url = `https://bscscan.com/address/${ca}`
  } else if (chainId == 1) {
    url = `https://etherscan.com/address/${ca}`
  }
  window.open(url, "_blank").focus()
}

export function openTxInExplorerNewTab(ca, chainId) {
  let url
  if (chainId == 56) {
    url = `https://bscscan.com/tx/${ca}`
  } else if (chainId == 1) {
    url = `https://etherscan.com/tx/${ca}`
  } else if (chainId == 5) {
    url = `https://goerli.etherscan.io/tx/${ca}`
  }
  window.open(url, "_blank").focus()
}
