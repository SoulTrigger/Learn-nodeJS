/**
 * 3.1~3.8
 */
const express = require('express')
const app = express()
var fs = require('fs')
var morgan = require('morgan')
var path = require('path')
const cors = require('cors')
//跨域处理
app.use(cors())
//路由之前使用中间件
app.use(express.json())
//预设值的日志格式
//app.use(morgan('tiny'))
//日志写入access.log文件
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan((tokens, req, res)=>{
	return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
	JSON.stringify(req.body)
  ].join(' ')
}, { stream: accessLogStream }))


var persons = [{ "name": "ArtoHellas", "number": "040-123456", "id": 1 }, { "name": "AdaLovelace", "number": "39-44-5323523", "id": 2 }, { "name": "DanAbramov", "number": "12-43-234345", "id": 3 }, { "name": "MaryPoppendieck", "number": "39-23-6423122", "id": 4 }];
app.get('/api/persons', (request, response) => {
	response.json(persons)
})

app.get('/api/persons/:id', (req, resp) => {
	var id = req.params.id;
	resp.json(persons.find((person) => {
		return person.id == id
	}))
})

app.delete('/api/persons/:id',(req,resp)=>{
	var id = req.params.id;
	var index = persons.findIndex((person)=>{
		return person.id == id
	})
	persons.splice(index,1);
	resp.json('success')
})

app.post('/api/persons',(req,resp)=>{
	var obj= req.body;
	obj.id=Math.floor(Math.random()*1000)
	var findstr = persons.findIndex((person)=>{
		return person.name==obj.name
	})
	if(obj.name==''||obj.number==''){
		return resp.json({error:'姓名不能为空'})
	}else if(findstr>-1){
		return resp.json({error:'姓名重复'})
	}
	persons.push(obj);
	resp.json('success')
})

app.get('/api/info', (req, resp) => {
	var obj = new Date()
	resp.send(`<p>电话本共计${persons.length}人</p><p>接收请求时间${obj.getHours()}:${obj.getMinutes()}:${obj.getSeconds()}</p>`)
})

//路由之后使用的中间件
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})