var data = require('../data/fcq.5000.json')
var A = require('../lib')()
var _ = require('lodash')

A.load(data.slice(0,100))
A.select(['Subject', 'CrsPBAColl','CrsLvlNum','Hours'])
A.groupBy('Subject')
A.groupBy('CrsLvlNum')
// A.groupBy('Hours')
//console.log(A.current)
console.log(JSON.stringify(A.get(),null, ' '))
// console.log(JSON.stringify(_.pluck(A.get(),'count'),null, ' '))
