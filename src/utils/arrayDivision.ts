export default (target: any[], divisionCount: number): any[] => {
  const len = target.length;
  const loop = Math.ceil(len / divisionCount) - 1;
  const temp = [];
  for (let i = 0; i <= loop; i++) {
    temp.push(target.splice(0, divisionCount));
  }

  return temp;
};
