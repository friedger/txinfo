export const addrEncoding = (chain: Chain): AddressEncoding => {
  switch (chain) {
    case "stacks":
      return "c32check";
    case "ethereum":
    default:
      return "evm";
  }
};
