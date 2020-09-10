// let count = 0
// setInterval(() => {
//   console.log('green', count ++)
// }, 1000)
// setInterval(() => {
//   console.log('yellow')
// }, 2000)
// setInterval(() => {
//   console.log('red')
// }, 3000)

// function green () {
//   console.log('green')
// }
// function yellow () {
//   console.log('yellow')
// }
// function red () {
//   console.log('red')
// }
// function lightUp() {
//   const g = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       green()
//       resolve()
//     }, 1000)
//   })
//   const y = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       yellow()
//       resolve()
//     }, 2000)
//   })
//   const r = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       red()
//       resolve()
//     }, 3000)
//   })
//   Promise.all([g, y, r]).then(() => {lightUp()})
// }

function lightUp() {
  const g = new Promise((resolve, reject) => {
    setTimeout(() => {
      green()
      resolve()
    }, 1000)
  })
  const y = new Promise((resolve, reject) => {
    setTimeout(() => {
      yellow()
      resolve()
    }, 2000)
  })
  const r = new Promise((resolve, reject) => {
    setTimeout(() => {
      red()
      resolve()
    }, 3000)
  })
  Promise.all([g, y, r]).then(() => {lightUp()})
}
// lightUp()

