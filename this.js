/**
 * 链式调用 一个对象调用多个方法，都返回自己，可以直接通过.再调用方法
 * @param ...args
 * @returns this
 */
// a 有个construct , 每次执行

//简单的链式调用，一个 函数 this下的函数，返回this，可以不断调用
function man() {
    this.setName = function(name) {
        this.name = name
        console.log(this)
        return this
    }
    this.setAge = function(age) {
        this.age = age
        console.log(this)
        return this
    }
}
var m = new man()
m.setName('sun').setAge(18)


// 复杂点的，类似jquery, 所有调用的方法都会返回this
// function method(name, fn, context) {
//     return new Function('context', `
//         console.log(${name}, ${fn}, context)
//         with(context) {
//             this.${name} = ${fn}
//             return context
//         }
//     `)(context)
// }
// function _$() {}

// // _$.onready = function(fn) {
// //     window.$ = function() {
// //         console.log(arguments)
// //         return new _$(arguments)
// //     }
// //     fn()
// // }
// method('click', function(fn) {
//     fn()
// },_$)
// method('change', function(fn) {
//     fn()
// },_$)
// // _$.method('load', function(fn) {
// //     fn()
// // })
// let $1 = new _$()
// console.log( $1)
// //使用
// $1.change(function() {
//     console.log(this, 111111)
// }).click(function() {
//     console.log(this, 2222)
// })