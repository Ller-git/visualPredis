export default class {
	// 构造函数
	constructor() {
		// 获取基本路径
		this.baseURL = window.location.origin+window.location.pathname+'back/index.php/';

		this.$http = axios.create({baseURL: this.baseURL});

		this.$http.interceptors.request.use(function (config) {
		    // 在发送请求之前做些什么
		    return config;
		}, function (error) {
			// 对请求错误做些什么
			return Promise.reject(error);
		});

		// 拦截响应
		this.$http.interceptors.response.use(function (response) {
			let el = document.getElementById('alert');
			close=(time)=>{
				el.innerHTML = '';
			}
		    if (response.data.code == 666) {
				el.innerHTML = `<div class="alert alert-success"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>success !</strong>&emsp;`+response.data.message+`</div>`;
				setTimeout("close()", 2000);
			} else if(response.data.code == 10061) {
				el.innerHTML = `<div class="alert alert-warning"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>error !</strong>&emsp;`+response.data.message+`</div>`;
				console.log(response.data.code)
				response.data = {message: {info: response.data.message }}
				// this.$router.push({ path: "/service" });
			} else if(response.data.code > 1000) {
				// 大于1000全部都是错误码
				el.innerHTML = `<div class="alert alert-warning"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>error !</strong>&emsp;`+response.data.message+`</div>`;
				setTimeout("close()", 10000);
			}
		    return response;
		}, function (error) {
		    // 对响应错误做点什么
		    // return Promise.reject(error);
		});
	}

	// 返回一个自身的实例
	static create() {
		return new this;
	}

	// 请求键
	all() {
		return this.$http.get('/select/all');
	}

	matched(rule) {
		return this.$http.get('/select/matched', {params: rule})
	}


	// 导入导出
	export(params) {
		window.open(this.baseURL+'/command/export/matched/'+params);	
	}

	import(file) {
		return this.$http.post('/command/import', file);
	}



	// 数据库管理
	database() {
		return this.$http.get('/select/database');
	}

	switchDB(index) {
		return this.$http.get('/update/switchDB/redis_config', {params: index});
	}

	// 服务器信息
	info() {
		return this.$http.get('/select/info');
	}

	service() {
		// 加绿色通道
		return this.$http.get('/service/get/redis_config/green');
	}

	switchService(params) {
		return this.$http.get('/service/switch/redis_config/green', {params: params});
	}

	appendService(params) {
		// 追加服务配置, 同样使用绿色通道,绿色通道只能get方式
		return this.$http.get('/service/add/redis_config/green', {params: params});
	}

	// 设置生存时间
	expire(params) {
		return this.$http.post('/update/expire', params);
	}

	// 查看键的值
	keyinfo(params) {
		return this.$http.get('/select/keyinfo', {params: params});
	}

	command(command) {
		return this.$http.post('/command/execute', command);
	}

	// 创建string-------------- ---->post
	cString(params) {
		return this.$http.post('/insert/string', params);
	}

	cHash(params) {
		return this.$http.post('/insert/hash', params);
	}

	cList(params) {
		return this.$http.post('/insert/list', params);
	}

	cSet(params) {
		return this.$http.post('/insert/set', params);
	}

	cZset(params) {
		return this.$http.post('/insert/zset', params);
	}
	


	// 编辑 string-------------------->post
	eString() {
	}

	eHash(params) {
		return this.$http.post('/update/hash', params);
	}

	eList(params) {
		return this.$http.post('/update/list', params);
	}

	eSet() {
		
	}

	eZset(params) {
		return this.$http.post('/update/zset', params);
	}


	// 删除 string, 由于hash有哈希字段，list有索引，zset有member，所以不能向查看那样直接一个方法解决
	dString(params) {
		return this.$http.get('/delete/string', {params: params});
	}

	dHash(params) {
		return this.$http.get('/delete/hash', {params: params});
	}

	dList(params) {
		return this.$http.get('/delete/list', {params: params});
	}

	dSet(params) {
		return this.$http.get('/delete/set', {params: params});
	}

	dZset(params) {
		return this.$http.get('/delete/zset', {params: params});
	}
}