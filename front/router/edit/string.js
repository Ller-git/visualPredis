const Estring = {
	template: `
		<div class="panel panel-default" style="margin: 30px; box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);">
		    <div class="panel-heading" style="background-color: #fff;">
		        <h3 class="panel-title">
		        	编辑&nbsp;&nbsp;string&nbsp;
		        	<span style="font-size: 15px;padding: 5px;" class="alert alert-info">{{ key }}</span>
		        	<button @click="deleteString" type="button" class="pull-right btn btn-danger glyphicon glyphicon-trash"></button>
		        </h3>
		    </div>
		    <div class="panel-body">
		    	<p>&nbsp;</p>
		    	<div class="form-group row">
				    <label for="firstname" class="col-sm-1 col-sm-offset-1 control-label"><span style="color: #ec7254;">*</span>Key</label>
				    <div class="col-sm-9">
						<input disabled class="form-control" type="text" :value="key" />
				    </div>
				</div>
				<p>&nbsp;</p>
				<Expire :time="key_info.ttl"></Expire>

		        <div class="form-group row">
				    <div class="col-sm-offset-2 col-sm-9">
				    	<button @click="updateTTL" type="submit" class="btn btn-primary">Update expire</button>
				    </div>
				</div>
				<p>&nbsp;</p>
		        <div class="form-group row">
				    <label for="firstname" class="col-sm-1 col-sm-offset-1 control-label"><span style="color: #ec7254;">*</span>Value</label>
		        	<div class="col-sm-9">
		        		<textarea name="" id="" cols="30" rows="10" class="form-control" v-model="key_info.val"></textarea>
				    </div>
		        </div>
		        <div class="form-group">
				    <div class="col-sm-offset-2 col-sm-9">
				    	<button @click="updateString" type="button" class="btn btn-primary">Save</button>
				    </div>
				</div>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
		    </div>
		</div>`,
	data () {
		return {
			key: this.$route.params.key,	//操作的键名
			key_info: {
				key: this.$route.params.key,
				ttl: -1,
				val: '',
				expire: -1,
			},	//保存键的信息
		}
	},
	methods: {
		// 请求字符串信息
		requestString: function() {
			this.$redis.keyinfo({key: this.key}).then((result)=>{
				this.key_info = result.data;
			})
		},
		// 提交字符串信息
		updateString: function() {
			// 获取用户设置的生存时间和键名
			let form = {
				key: this.key,
				expire: this.key_info.ttl,
				value: this.key_info.val,
			}
			this.$redis.cString(form).then((result)=>{
				this.requestString();
			})
		},
		deleteString: function() {
			this.$parent.delString({key: this.key});
		},
		// 单独修改键的生存时间
		updateTTL: function() {
			this.$redis.expire({key: this.key, expire: this.key_info.expire}).then((result)=>{
				this.requestString();
			})
		},
		bindExpire: function(ttl) {
			this.key_info.expire = ttl;
		}
	},
	created () {
		this.requestString();
	},
	watch: {
		'$route' (to, from) { //监听路由是否变化
		    if(this.$route.params.key){// 判断条件1  判断传递值的变化
		    	this.key =  this.$route.params.key;
		    	this.requestString();
		    }
		}
	}
}

export { Estring }