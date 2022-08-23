const altNames = ['', 'k', 'm', 'b'];

export function formatMoney(amount: number): string {
  amount = Math.ceil(amount);
  const zeroNum = Math.log10(amount);
  const oddNum = zeroNum % 3;
  const altName = altNames[Math.min(Math.floor(zeroNum / 3), 3)];

  return `${amount / Math.pow(10, zeroNum - oddNum)}${altName}`;
}
