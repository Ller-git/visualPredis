const Ehash = {
	template: `
		<div class="panel panel-default" style="margin: 30px;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);">
			<!-- 模态框（Modal） -->
			<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			    <div class="modal-dialog">
			        <div class="modal-content">
			            <div class="modal-header">
			                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
			                <h4 class="modal-title" id="myModalLabel">Update&nbsp;{{ update_form.field }}</h4>
			            </div>
			            <div class="modal-body">
							<input type="text" v-model="update_form.value" class="form-control" />
			            </div>
			            <div class="modal-footer" style="border: none;">
			                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
			                <button @click="updateHash" type="button" class="btn btn-primary">Submit</button>
			            </div>
			        </div><!-- /.modal-content -->
			    </div><!-- /.modal -->
			</div>
		    <div class="panel-heading" style="background-color: #fff;">
		        <h3 class="panel-title">
		        	编辑&nbsp;&nbsp;hash&nbsp;
		        	<span style="font-size: 13px;padding: 5px;" class="alert alert-info">key: {{ key }}</span>
		        	<span style="font-size: 13px;padding: 5px;" class="alert alert-info">page: {{ key_info.page }}/{{ key_info.pages }}</span>
		        	<span style="font-size: 13px;padding: 5px;" class="alert alert-info">length: {{ key_info.length }}</span>
		        	<button type="button" @click="deleteHash()" class="pull-right btn btn-sm btn-danger glyphicon glyphicon-trash"></button>
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
				    	<button @click="updateExpire" type="button" class="btn btn-primary">Update expire</button>
				    </div>
				</div>
				<template v-for="item in insert_form.hash">
		        <div class="form-group row">
				    <label for="firstname" class="col-sm-1 col-sm-offset-1 control-label">Field</label>
		        	<div class="col-sm-9">
						<input v-model="item.field" style="width: 150px; display: inline-block;" type="text" class="form-control">
						<input v-model="item.value" style="width: 250px; display: inline-block;" type="text" class="form-control">
				    </div>
		        </div>
		        </template>
		        <div class="form-group row">
				    <div class="col-sm-offset-2 col-sm-9">
				    	<button @click="insertHash" type="button" class="btn btn-info">Add</button>
				    </div>
				</div>
				<hr />
				<div class="form-group row">
				    <label for="firstname" class="col-sm-1 col-sm-offset-1 control-label">Fields</label>
				    <div class="col-sm-9">
				    	<!-- 分页 -->
				    	<div v-if="key_info.pages != 1" class="input-group" style="width: 360px;">
				            <span class="input-group-addon" @click="requestHash('prev')">prev</span>
				            <span class="input-group-addon" @click="requestHash('next')">next</span>
				            <input type="text" v-model="key_info.page" class="form-control text-center">
				            <span @click="requestHash('jump')" class="input-group-addon">jump</span>
				        </div>
				        <!-- /分页 -->
				    	<table class="table">
							<thead><tr><td>Field</td><td>Value</td><td>Delete</td></tr></thead>	
							<tbody>
							<template v-for="(item, index) in key_info.val">
								<tr>
									<td>{{ index }}</td>
									<td>{{ item }}</td>
									<td><button @click="updatingHash(index)" class="btn btn-sm btn-primary glyphicon glyphicon-pencil"></button>
									<button @click="deleteHash(index)" class="btn btn-sm btn-danger glyphicon glyphicon-trash"></button></td>
								</tr>			
							</template>
							</tbody>
						</table>
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
				val: '',
				page: 0
			},	// 这几个键必须刚开始就需要存在
			insert_form: {
				key: this.$route.params.key,
				expire: -1,
				hash: [
					{field: '', value: ''},
				]
			},	//新增
			update_form: {
				key: this.$route.params.key,
				expire: 10000,
				field: '',
				value: ''
			},	//修改一般是单项修改的，所以我们也不用怕
		}
	},
	methods: {
		// 更新数据, 包括分页
		requestHash: function(params = '') {
			var page = 0;
			if (params == 'next') {
				page = parseInt(this.key_info.page)+1;
			} else if (params == 'prev') {
				page = parseInt(this.key_info.page)-1;
			} else {
				page = parseInt(this.key_info.page);
			}
			this.$redis.keyinfo({key: this.key, page: page}).then((result)=>{
				/**
				 * 这里做一下笔记，this.key_info = {} 或者 this.key_info = [],无论是数组还是对象，
				 * 只要后来添加的他都不再是响应式的了，但是如果在你的this.key_info为空的时候，且这个
				 * 时候页面用到了this.key_info.expire字段，你并没有赋初值，那么页面就会等你赋初值之后才显示。
				 * 简单点来说，就是当你的这个数据初始化已经完成之后直接赋值就不再是响应式的了，如果数据没有初
				 * 始化，也就是还没有赋值的属性。这个时候页面需要这个属性，你没有赋值，等实例化完成之后，也是可以的
				 */
				// this.$parent.refreshData(this.key_info, result.data);
				// console.log(this.key_info);
				this.key_info = result.data;
			})
		},
		// 新增哈希
		insertHash: function() {
			this.$redis.cHash(this.insert_form).then((result)=>{
				this.requestHash();
			})
		},
		// 更新正在收集信息
		updatingHash: function(field) {
			// 1. 获取将要修改的哈希字段
			this.update_form.field = field;
			// 2. 打开模态框
			$('#myModal').modal('toggle');
		},
		// 更新
		updateHash: function() {
			this.$redis.eHash(this.update_form).then((result)=>{
				// 返回结果之后，它关闭模态框，并且清空值, 且需要更新数据信息
				$('#myModal').modal('toggle');
				this.update_form.value = '';
				this.requestHash();
			})
		},
		// 删除哈希
		deleteHash: function(field = '') {
			// field为空代表删整个键，不为空，删除里面的字段
			if (field == '') {
				this.$parent.delString({key: this.key});
			} else {
				this.$redis.dHash({key: this.key, field: field}).then((result)=>{
					this.requestHash();
				})
			}
		},
		// 更新键的生存时间
		updateExpire: function() {
			this.$redis.expire(this.update_form).then((result)=>{
				// 重新获取键的详细信息
				this.requestHash();
			})
		},
		// 配合子组件修改生存时间。
		bindExpire: function(ttl) {
			// 如果这么写就不用监听key_info的ttl属性了
			this.insert_form.expire = ttl;
			this.update_form.expire = ttl;
		}
	},
	created () {
		this.requestHash('prev');
	},
	watch: {
		'$route' (to, from) { //监听路由是否变化
		    if(this.$route.params.key){// 判断条件1  判断传递值的变化
		    	this.key = this.$route.params.key;
		      	this.requestHash()
		    }
		}
	}
}

export { Ehash }