const cart=["richdad","huse next door","alic wonderland"]
console.log(cart.includes("discovery of india"))
console.log(cart.includes("huse next door"))
console.log([1,2,3,4,5].includes(50))

//  for object
const a= {id:1,name:"abc"}
const b={id:1,name:"def"}
console.log([a].includes(b)) // false because different referece
console.log([b].includes(b)) // true same reference