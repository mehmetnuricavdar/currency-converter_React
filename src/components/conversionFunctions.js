export const convertUpToDown = (amount, exchangeRate) => {
  return (amount * exchangeRate).toFixed(2);
};

export const convertDownToUp = (amount, exchangeRate) => {
  return (amount / exchangeRate).toFixed(2);
};
