
// // let head = /^\D+/g
// // let foot = /[0-9\.]+$/g

// // function symbolKey(orign, key) {
// //     let list = []
// //     if(!orign[key]) {
// //         orign[key] = 1
// //         console.log(orign)
// //         return orign
// //     }
// //     Object.keys(orign).forEach(item => {
// //         if(item.match(head) && item.match(head)[0] === key) {
// //             let num = item.match(foot) ? Number(item.match(foot)[0]) : 0
// //             list.push(num)
// //         }
// //     })
// //     let max = Math.max.apply(null, list) + 1
// //     orign[key+max] = 1
// //     console.log(orign)
// //     return  orign
// // }
// // symbolKey({a: 1, b100: 6}, 'b')

// // function parseObject(obj){
// // 	var result = {}
// // 	Object.keys(obj).forEach(function(key){
// //         var match = key.match(/(.?)(\d*)$/)
// //         console.log(match)
// // 		if(match){
// // 			result[match[1]] = Math.max(result[match[1]] ||0,match[2] || 0)
			
// // 		}
// // 	})
// // 	return result
// // }

// // function assign(source,target){
// // 	var set = parseObject(source)
// // 	Object.keys(target).forEach(function(key){
// // 		console.log(key+set[key]+1)
// // 		source[key+(set[key]+1)] = target[key]
// // 	})
// //     console.log(source)
// // 	return source
// // }
// // assign({a: 1, bwewe100: 6}, {bwewe:2,a:1})



// /**
//  * @params object, key
//  *  
//  * 
//  * @example object = {a:{b:{c: 3}}}, key = a.b.c
//  * @return object
//  * 
//  * 解题思路在于对key对解析 支持 a.b.c、a[0].b.c[1] 的嵌套写法， a[0]
// a[b]
// a['b']
// a.c

// 规律有.[],解析成a,b,c..., return obj[a].[b].[c]
// 可采用函数柯里化 两两换回一个对象，作为下一次调用对object，每次key, 删除前面的一个key,剩下的作为结果，直到没有key,结束


// 2、 对key解析，成为一个数组，遍历，返回需要的对象
//  */

//  function getObject(object, keys) {
// 	console.log(11111, object, keys)
// 	let a = keys.replace(/\[?/g,'.').replace(/?\]/g,'').split('.')
// 	let o = object

// 	let i = 0;

// 	while(o && i < a.length && (a[i] || i++)){
// 		o = o[a[i++]]
// 	}
// 	console.log(o)
// 	return o
//  }

// //  getObject({a:{b:{c: 3}}}, 'a.b.c')
// //  getObject({a:{b:{c: 3}}}, 'a.b.c')
// //  getObject({a:{b:{c: 3}}}, '["a"]')
// //  getObject({a:{b:{c: 3}}}, '[a][b]')
// //  getObject({a:{b:{c: 3}}}, 'a["b"]["c"]') // a.b.c


// /**
//  * 可以传入变量， 支持访问外部变量, 支持表达式
//  * @example new Function('a', 'b', 'return a + b'); // 基础语法
//  */
 

// function curyObj(object, keys) {
	
//  console.log(11111, object, keys)
//  let a = keys.replace(/\[?/g,'.').replace(/?['"]\]/g,'').split('.')
//  let o = object

//  let i = 0;
// console.log(a)
//  while(o && i < a.length && (a[i] || i++)){
// 	 o = o[a[i++]]
//  }
//  console.log(o)
//  return o
 
// }
// let s = curyObj.toString()
// console.log(s)
//  let funGetObject = new Function ('object', 'keys', s)

// //funGetObject({a:{b:{c:3}}}, 'a.b.c')
// //  funGetObject({a:{b:{c: 3}}}, '["a"]')
// //  funGetObject({a:{b:{c: 3}}}, '[a][b]')
// //  funGetObject({a:{b:{c: 3}}}, 'a["b"]["c"]') // a.b.c

var target  ={a:{b:{c: 3},c:[{name:'abc'}]},b:2,c:3}

/**
 * @params
 *   target {object} 
 *   key  {string} 
 * 
 * @description
 * key示例： a.b.c a[1].v
 * 不支持 [a][a] 中括号开头
 * 
 * @example
 * var target  ={a:{b:{c: 3},c:[{name:'abc'}]}}
 * 
 * console.log(a(target,'a.b.c'))
 *  ==> 3
 * console.log(a(target,'a.c[1].name'))
 * ==> null
 * 
 * @return value {any} 返回target中指定key的值
 */
getProp = function (target,key){
	return new Function('target','try{return target.'+key+'}catch(e){return null}')(target)
}

//console.log(a(target,'["a"]["b"]["c"]'))
// console.log(getProp(target,'a.b.c'))
// console.log(getProp(target,'a.c[1].name'))

/**
 * 
 * @param {*} context 
 * @param {*} code 将code表达式通过new function 执行， a,b 通过with改变上下文获取
 */
var compile = function(context, code){
	return	new Function('context',`
	  with(context){
		  return ${code}
	  }
	`)(context)
	
}

// compile(target)('a.b.c')

console.log(compile(target,'c+b'))

/* <div >
{a+1}
{a*v}
</div>
*/

// APP = new Vue({
// 	data:function(){
// 		return {
// 			a:1,
// 			v:2
// 		}
// 	},
// 	methods:{
// 		get:function(){}
// 	}
// })

// app.a
// app.get

// app.$complie = function(code){
// 	return compile(this)
// }

// $compolie = compile(this)


// app.$complie(context,'a+b')

// function add(x){
// 	var a // .... some code
// 	return function(y){
// 		return a+y
// 	}
// }

// var a = add(1)
// a(2)
//  3

// function add1(x){
// 	return  a
// }

// var aVal = add1(1)

// function add(x,y){

// }

// add(aVal,2)

// 3

// form = Form.create({options})

// form()