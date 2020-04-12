const Eset = {
	template: `
		<div class="panel panel-default" style="margin: 30px;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);">
		    <div class="panel-heading" style="background-color: #fff;">
		        <h3 class="panel-title">
		        	编辑&nbsp;&nbsp;set&nbsp;
		        	<span style="font-size: 13px;padding: 5px;" class="alert alert-success">key: {{ key }}</span>
		        	<span style="font-size: 13px;padding: 5px;" class="alert alert-success">page: {{ key_info.page }}/{{ key_info.pages }}</span>
		        	<span style="font-size: 13px;padding: 5px;" class="alert alert-success">length: {{ key_info.length }}</span>
		        	<button @click="deleteSet()" type="button" class="pull-right btn btn-sm btn-danger glyphicon glyphicon-trash"></button>
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
				    	<button @click="updateTTL" type="button" class="btn btn-primary">Update expire</button>
				    </div>
				</div>
		        <template v-for="(item, index) in insert_form.set">
		        <div class="form-group row">
				    <label for="firstname" class="col-sm-1 col-sm-offset-1 control-label"><span style="color: #f56c6c;"></span>Member</label>
		        	<div class="col-sm-9">
						<input v-model="item.value" style="width: 250px; display: inline-block;" type="text" class="form-control">
				    	<button @click="deleteSet(item)" class="btn btn-default">Remove</button>
				    </div>
		        </div>
		        </template>
		        <div class="form-group row">
				    <div class="col-sm-offset-2 col-sm-9">
				    	<button @click="insertSet" type="button" class="btn btn-primary">Add</button>
				    </div>
				</div>
				<hr />
				<div class="form-group row">
				    <label for="firstname" class="col-sm-1 col-sm-offset-1 control-label">Members</label>
				    <div class="col-sm-9">
				    	<!-- 分页 -->
				    	<div v-if="key_info.pages != 1" class="input-group" style="width: 360px;">
				            <span class="input-group-addon" @click="requestSet('prev')">prev</span>
				            <span class="input-group-addon" @click="requestSet('next')">next</span>
				            <input type="text" v-model="key_info.page" class="form-control text-center">
				            <span @click="requestSet('jump')" class="input-group-addon">jump</span>
				        </div>
				        <!-- /分页 -->
				        <template v-for="(item, index) in key_info.val">
				        	<div class="alert-info" style="display: inline-block;margin-bottom: 5px;padding: 5px 10px;font-size: 15px;rgba(64,158,255,.1);color:#409eff;border-radius: 4px;">
				        		{{ item }} 
								<i @click="deleteSet(item)" style="font-size: 10px;" class="glyphicon glyphicon-remove"></i>
							</div>&emsp;
				        </template>
				    	
				    </div> <!-- /.col-sm-9 -->
				</div>
		    </div>
		</div>`,
	data () {
		return {
			key: this.$route.params.key,	//操作的键名
			key_info: {
				key: this.$route.params.key,
				ttl: -1,
				expire: -1,
				val: '',
				page: 0
			},	//保存键的信息
			insert_form: {
				key: this.$route.params.key,
				expire: -1,
				set: [
					{value: ''}
				]
			},
		}
	},
	methods: {
		// 请求字符串信息
		requestSet: function(params = '') {
			var page = 0;
			if (params == 'next') {
				page = parseInt(this.key_info.page)+1;
			} else if (params == 'prev') {
				page = parseInt(this.key_info.page)-1;
			} else {
				page = parseInt(this.key_info.page);
			}
			this.$redis.keyinfo({key: this.key, page: page}).then((result)=>{
				this.key_info = result.data;
			})
		},
		// 提交字符串信息
		insertSet: function() {
			this.$redis.cSet(this.insert_form).then((result)=>{
				this.requestSet();
			})
		},
		// 删除set
		deleteSet: function(value = '') {
			if (value === '') {
				this.$parent.delString({key: this.key});
			} else {
				this.$redis.dSet({key: this.key, value: value}).then((result)=>{
					this.requestSet();
				})
			}
		},
		// 提交键的生存时间
		updateTTL: function() {
			this.$redis.expire(this.insert_form).then((result)=>{
				this.requestSet();
			})
		},
		bindExpire: function(ttl) {
			// 如果这么写就不用监听key_info的ttl属性了
			this.insert_form.expire = ttl;
		}
	},
	created () {
		this.requestSet();
	},
	watch: {
		'$route' (to, from) { //监听路由是否变化
		    if(this.$route.params.key){// 判断条件1  判断传递值的变化
		    	this.key = this.$route.params.key;
		      	this.requestSet()
		    }
		},
		// 'key_info.ttl': {
		// 	handler: function() {
		// 		this.insert_form.expire = this.key_info.ttl;
		// 	},
		// }
	}
}

export { Eset }