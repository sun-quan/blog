/**
 * Promise 有then,catch方法，status，3种， PENDING,FULFILLED,REJECT, 状态一旦改变不可再变
 * Promise(handle) ,接受一个方法，里面接受2个参数，resolve, reject
 * construct 存放状态，失败队列，成功队列， resolve执行的函数，reject执行的函数
 * 队列依次执行，如果resolve的参数是个promise，必须把函数再放进then方法，等待状态改变
 */

const isFunction = a => typeof  a  === 'function'
inx = 0
function Promise2(fn){
    this.status = Promise2.PENDING
    this.resolveList = []
    this.rejectList = []
    this.catchList = []
    this.id = inx++
    
    try{
        fn.call(this,this.resolve.bind(this),this.reject.bind(this))
    }catch(e){
        console.log(e)
        this.reject(e);
        this.throw(e);
    }
}

Promise2.PENDING = 'PENDING'
Promise2.FULFILLED = 'FULFILLED'
Promise2.REJECT = 'REJECT'

Promise2.execute = function(fns,value){
    fns && fns.forEach(function(fn){
        fn && fn(value)
    })
}

Promise2.all = function(promises){
    var p1
    promises.forEach(function(item){
        console.log(item instanceof Promise2)
        if(!(item instanceof Promise2)) {
            item = new Promise2(resolve => {
                resolve(item)
            })
            console.log()
        }
        if(p1){
            p1 = p1.then(function(res){
                return item.then(function(val){
                    res.push(val)
                    return res
                })
            })
        }else{
            p1 = item.then(function(res){
                return [res]
            })
        }
    })
    return p1
}

Promise2.prototype = {
    resolve:function(result){
        if(this.status === Promise2.PENDING){
            this.status = Promise2.FULFILLED;
            this.result = result
            Promise2.execute(this.resolveList,result)
        }
    },
    reject:function(result){
        if(this.status === Promise2.PENDING){
            this.status = Promise2.REJECT;
            this.result = result;
            Promise2.execute(this.rejectList,result);
        }
    },
    then:function(resolve,reject){
        var self = this;

        return new Promise2(function(_resolve,_reject){
            
            // console.log(self)

            const proxyResolve = val =>{
                var result
                if(isFunction(resolve)){
                    result = resolve(val)
                    if(result instanceof Promise2){
                        result.then(function(res){
                            _resolve(res)
                        })
                    }else{
                        _resolve(result)
                    }
                }else{
                    _resolve(resolve)
                }
            }

            const proxyReject = val => {}
           
            self.resolveList.push(proxyResolve)
            self.rejectList.push(proxyReject)

            if(self.status === Promise2.FULFILLED){
                proxyResolve(self.result)
            }else if(self.status === Promise2.REJECT){
                proxyReject(self.result)
            }
        })
    },
    throw:function(result){
        Promise2.execute(this.catchList,result)
    },
    catch:function(fn){
        //console.log(e,2)
        this.catchList.push(fn)
    }
}


// Promise2.all = function(promises){
//     let a =[]
//     promises.map(promise => {
//         promise.then(res => {
//             a.push(res)
//             //console.log(a)
//         })
//     })
//     return p
// }

/**
 * all
 * @param array
 * @returns array: 每个promise返回的结果
 */

Promise2.all([new Promise2(function(resolve){
    setTimeout(function(){
        resolve(1)
    })
}),new Promise2(function(resolve){
    setTimeout(function(){
        resolve(2)
    })
}),new Promise2(function(resolve){
    setTimeout(function(){
        resolve(3)
    })
}),12]).then(function(res){
    //[1,2,3,12]
    console.log('res',res)
})

// ====> 

// [1,2,3]


var p1 = new Promise2(function(resolve,reject){
    setTimeout(function(){
        resolve('1')
    },1000)
})

p1.then(function(res){
    console.log(res,1)
    return 2
}).then(function(res){
    console.log(res,2)
    return 3
}).then(function(res){
    console.log(res,3)
    return 4
}).then(5)
.then(function(res){
    console.log(res)
}).then(function(res){
    return new Promise2(function(resolve,reject){
        resolve('6')
    })
}).then(function(res){
    console.log(6)
})

/*

p1 = function (){
    p2 = function(){
        p3 = function(){
            p4 = function(){

            }
        }
    }
}
*/

// class myPromise {
//     constructor(handle) {
//         this._status = 'PENDING'
//         this._value = null
//         this.successList = []
//         this.failList = []

//         try {
//             handle(this._resolve.bind(this), this._reject.bind(this))
//         } catch(e) {
//             this._reject(e)
//         }
//     }

//     _resolve(val) {
//         if(this._status === 'PENDING') {
//             this._status = 'FULFILLED'
//             this._value = val
//             this.successList.map(cb => cb(this._value))
//         }
//     }

//     _resolve(val) {
//         if(this._status === 'PENDING') {
//             this._status = 'REJECT'
//             this._value = val
//             this.failList.map(cb => cb(this._value))
//         }
//     }

//     // then
//     then(onFulfilled, onRejected) {
//         let {_status, _value} = this
//         // return new Promise, 判断执行onFulfilled，还是onRejected，

//         switch (_status) {
//             // 当状态为pending时，将then方法回调函数加入执行队列等待执行
//             case 'PENDING' :
//               this._fulfilledQueues.push(fulfilled)
//               this._rejectedQueues.push(rejected)
//               break
//             // 当状态已经改变时，立即执行对应的回调函数
//             case 'FULFILLED':
//                 onFulfilled(_value)
//               break
//             case 'REJECTED':
//                 onRejected(_value)
//               break
//           }
//     }
// }