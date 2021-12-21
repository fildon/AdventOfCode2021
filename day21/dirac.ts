export const buildDie = () => {
  let currentValue = 0;
  let rollCounter = 0;

  const roll = () => {
    rollCounter++;
    currentValue = (currentValue % 100) + 1;
    return currentValue;
  };

  return {
    roll,
    getCurrentRollCount: () => rollCounter,
  };
};
