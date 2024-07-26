export function openInNewTab(url) {
  window.open(url, "_blank").focus();
}

export function openInExplorerNewTab(ca, chainId) {
  let url = `https://sepolia.etherscan.io/address/${ca}`;
  if (chainId == 56) {
    url = `https://bscscan.com/address/${ca}`;
  } else if (chainId == 1) {
    url = `https://etherscan.com/address/${ca}`;
  } else if (chainId == 42161) {
    url = `https://explorer.arbitrum.io/#/address/${ca}`;
  } else if (chainId == 10) {
    url = `https://optimistic.etherscan.io/address/${ca}`;
  }
  window.open(url, "_blank").focus();
}

export function openTxInExplorerNewTab(ca, chainId) {
  let url;
  if (chainId == 56) {
    url = `https://bscscan.com/tx/${ca}`;
  } else if (chainId == 1) {
    url = `https://etherscan.com/tx/${ca}`;
  } else if (chainId == 11155111) {
    url = `https://sepolia.etherscan.io/tx/${ca}`;
  } else if (chainId == 42161) {
    url = `https://explorer.arbitrum.io/#/tx/${ca}`;
  } else if (chainId == 10) {
    url = `https://optimistic.etherscan.io/tx/${ca}`;
  }
  window.open(url, "_blank").focus();
}
