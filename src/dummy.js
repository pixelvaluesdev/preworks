const greet = (name, callback) => {
  console.log('Hello ' + name);
  callback();
};
greet('Purva', () => {
  console.log('Welcome!');
});

const x = 1;
const test = () => {
  const y = 2;

  console.log(x);
  console.log(y);
};

test();

console.log(x);
console.log(y);
