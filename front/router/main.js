import Redis from "./redis.js";
import routerObj from "./router.js";


Vue.prototype.$redis = Redis.create();
Vue.prototype.$http = axios;


// 弹出框，不是模态框
$(function () { 
	$("[data-toggle='popover']").popover();
});


var vm = new Vue({
	el: "#app",
	data: {
		keys: {},				//保存数据库的键
		show_child_key: [],		//记录那些键可以开启分组
		database: [],			//数据库信息
		rule: '*',				//匹配规则
		current_db: 0,			//默认操作的数据库
		filename: '暂无上传文件',	//上传文件的名称
		import_file: {},		// 上传文件
		export_keys: '',		//导出的匹配规则，逗号分割
		service_config: [],			//服务配置项信息
	},
	router: routerObj,
	created() {
		this.init();
		this.switchDB(0);	// 保持数据库索引的一致性, 由于后台是用的session，有效期的问题，可能它没有过期，但是前台刷新页面了
	},
	watch: {
	},
	methods: {
		// 重中之重，由于好多此都需要刷新键和数据库，所以单独列出来一个方法
		init: function () {
			this.service();		// 请求服务配置信息
			this.requestKeys();	// 请求键信息
			this.requestDB();	// 请求数据库信息
		},
		// 关闭所有的折叠框，并显示某一个
		foldFrame: function (el) {
			let id = '#'+el;
			$('#collapseThree').collapse('hide');
			$('#collapseTwo').collapse('hide');
			$('#collapseOne').collapse('hide');
			$(id).collapse('show');
		},
		// 子键的显示与隐藏, 如果直接使用js控制元素的display属性，它需要获取太多的元素节点了
		showChildKey: function(index) {
			// 关联索引其实可以使用 'a' in arr 这种方式，不过in如果是下标数组的话就不行了。
			if (this.show_child_key.includes(index)) {
				// 关闭
				let sck_index = this.show_child_key.indexOf(index)
				this.show_child_key.splice(sck_index, 1)
			} else {
				// 开启
				this.show_child_key.push(index)
			}
		},
		// 请求键数据
		requestKeys: function () {
			this.$redis.all().then((result)=>{
				this.keys = result.data;
			})
		},
		// 这里使用v-model，因为v-model可以保存当前搜索条件的值，方便删除key之后的刷新
		matchedKeys: function () {
			this.$redis.matched({matched: this.rule}).then((result)=>{
				this.keys = {};
				this.keys = result.data;
			})
		},
		// 请求数据库数据
		requestDB: function () {
			this.$redis.database().then((result)=>{
				this.database = result.data.Keyspace;
			})
		},
		// 切换数据库
		switchDB: function (index) {
			this.$redis.switchDB({index: index}).then((result)=>{
				// 1. 设置当前数据库的索引
				this.current_db = result.data.data;
				// 2. 获取当前数据库的键
				this.requestKeys();
			})
		},
		// 清除一个完整的key
		delString: function(params) {
			this.$redis.dString(params).then((result)=>{
				// 删除整个key就显示信息页面。并根据原来的匹配规则匹配key
				this.matchedKeys();
				this.$router.push({ path: "/" });
			})
		},
		// 响应式的添加数据
		refreshData: function($target, $data) {
			if (Array.isArray($data)) {
				// 处理数组
				$data.forEach(function(val, index, arr){
					Vue.set($target, index, val);
				})
			} else {
				// 处理json
				for(let key in $data) {
					Vue.set($target, key, $data[key]);
				}
			}
		},
		// 导入导出
		importingFile: function($target) {
			let form = new FormData();
			form.append('import', $target.files[0]);
			this.import_file = form;
			this.filename = $target.value;
		},
		importFile: function() {
			this.$redis.import(this.import_file).then((result)=>{
				this.requestKeys();
			})
		},
		exportFile: function() {
			this.$redis.export(this.export_keys);
		},
		// 服务配置
		service: function() {
			this.$redis.service().then((result)=>{
				this.service_config = result.data;
			})
		},
		switchService: function(index) {
			this.$redis.switchService({index: index}).then((result)=>{
				this.init();
				this.switchDB(0);	// 保持数据库索引的一致性, 由于后台是用的session，有效期的问题，可能它没有过期，但是前台刷新页面了
			})
		}
	}
})