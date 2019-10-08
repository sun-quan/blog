
 class MyPromise {
    // 判断变量否为function
    static isFunction = variable => typeof variable === 'function'

    // 定义Promise的三种状态常量
    static PENDING = 'PENDING'
    static FULFILLED = 'FULFILLED'
    static REJECTED = 'REJECTED'

  // handle 是一个方法，接受两个参数，resolve, reject
   constructor (handle) {
     if (!MyPromise.isFunction(handle)) {
       throw new Error('MyPromise must accept a function as a parameter')
     }
     // 添加状态
     this._status = MyPromise.PENDING
     
     // value` 变量用于保存 `resolve` 或者 `reject` 中传入的值
     this._value = undefined

     // 添加成功回调函数队列, 可以依次调用
     this._fulfilledQueues = []
     // 添加失败回调函数队列
     this._rejectedQueues = []
     
     // 执行handle
     try {
       handle(this._resolve.bind(this), this._reject.bind(this)) 
     } catch (err) {
       this._reject(err)
     }
   }
   // 添加resovle时执行的函数
   _resolve (val) {
     const run = () => {
       if (this._status !== MyPromise.PENDING) return
       // 依次执行成功队列中的函数，并清空队列
       const runFulfilled = (value) => {
         let cb;
         while (cb = this._fulfilledQueues.shift()) {
           cb(value)
         }
       }
       // 依次执行失败队列中的函数，并清空队列
       const runRejected = (error) => {
         let cb;
         while (cb = this._rejectedQueues.shift()) {
           cb(error)
         }
       }
       /* 如果resolve的参数为Promise对象，则必须等待该Promise对象状态改变后,
         当前Promsie的状态才会改变，且状态取决于参数Promsie对象的状态
       */
       if (val instanceof MyPromise) {
         val.then(value => {
           this._value = value
           this._status = MyPromise.FULFILLED
           runFulfilled(value)
         }, err => {
           this._value = err
           this._status = MyPromise.REJECTED
           runRejected(err)
         })
       } else {
         this._value = val
         this._status = MyPromise.FULFILLED
         runFulfilled(val)
       }
     }
     // 为了支持同步的Promise，这里采用异步调用
     setTimeout(run, 0)
   }
   // 添加reject时执行的函数, 直接调用失败队列，执行
   _reject (err) { 
     if (this._status !== MyPromise.PENDING) return
     // 依次执行失败队列中的函数，并清空队列
     const run = () => {
       this._status = REJECTED
       this._value = err
       let cb;
       while (cb = this._rejectedQueues.shift()) {
         cb(err)
       }
     }
     // 为了支持同步的Promise，这里采用异步调用
     setTimeout(run, 0)
   }
   /**
    * 添加then方法
    * 
    **/ 
   then (onFulfilled, onRejected) {
     const { _value, _status } = this

     // 返回一个新的Promise对象 不能直接return this, 否则会把status传过去
     return new MyPromise((onFulfilledNext, onRejectedNext) => {
       // 封装一个成功时执行的函数
       let fulfilled = value => {
         try {

          //如果不是个函数，直接返回
           if (!MyPromise.isFunction(onFulfilled)) {
             onFulfilledNext(value)
           } else {
             let res =  onFulfilled(value);
             if (res instanceof MyPromise) {
               // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
               res.then(onFulfilledNext, onRejectedNext)
             } else {
               //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
               onFulfilledNext(res)
             }
           }
         } catch (err) {
           // 如果函数执行出错，新的Promise对象的状态为失败
           onRejectedNext(err)
         }
       }
       // 封装一个失败时执行的函数
       let rejected = error => {
         try {
           if (!MyPromise.isFunction(onRejected)) {
             onRejectedNext(error)
           } else {
               let res = onRejected(error);
               if (res instanceof MyPromise) {
                 // 如果当前回调函数返回MyPromise对象，必须等待其状态改变后在执行下一个回调
                 res.then(onFulfilledNext, onRejectedNext)
               } else {
                 //否则会将返回结果直接作为参数，传入下一个then的回调函数，并立即执行下一个then的回调函数
                 onFulfilledNext(res)
               }
           }
         } catch (err) {
           // 如果函数执行出错，新的Promise对象的状态为失败
           onRejectedNext(err)
         }
       }
       switch (_status) {
         // 当状态为pending时，将then方法回调函数加入执行队列等待执行
         case MyPromise.PENDING:
           this._fulfilledQueues.push(fulfilled)
           this._rejectedQueues.push(rejected)
           break
         // 当状态已经改变时，立即执行对应的回调函数
         case MyPromise.FULFILLED:
           fulfilled(_value)
           break
         case MyPromise.REJECTED:
           rejected(_value)
           break
       }
     })
   }
 }


let promise1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
      console.log(1)
      resolve({a:2})
    }, 1000)
  })
  promise2 = promise1.then(res => {
    // 返回一个普通值
    console.log(res,2)
    return '这里返回一个普通值'
  })
  promise2.then(res => {
    console.log(res,3) //1秒后打印出：这里返回一个普通值
  })
  