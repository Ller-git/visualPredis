const Ezset = {
	template: `
		<div class="panel panel-default" style="margin: 30px;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);">
			<!-- 模态框（Modal） -->
			<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			    <div class="modal-dialog">
			        <div class="modal-content">
			            <div class="modal-header">
			                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
			                <h4 class="modal-title" id="myModalLabel">Update&nbsp;{{ update_form.member }}</h4>
			            </div>
			            <div class="modal-body">
							<input type="text" v-model="update_form.score" class="form-control" />
			            </div>
			            <div class="modal-footer" style="border: none;">
			                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
			                <button @click="updateZset" type="button" class="btn btn-primary">Submit</button>
			            </div>
			        </div><!-- /.modal-content -->
			    </div><!-- /.modal -->
			</div>
		    <div class="panel-heading" style="background-color: #fff;">
		        <h3 class="panel-title">
		        	编辑&emsp;zset&nbsp;
		        	<span style="font-size: 13px;padding: 5px;" class="alert alert-info">key: {{ key }}</span>
		        	<span style="font-size: 13px;padding: 5px;" class="alert alert-info">page: {{ key_info.page }}/{{ key_info.pages }}</span>
		        	<span style="font-size: 13px;padding: 5px;" class="alert alert-info">length: {{ key_info.length }}</span>
		        	<button @click="deleteZset()" type="button" class="pull-right btn btn-sm btn-danger glyphicon glyphicon-trash"></button>
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
				<template v-for="item in insert_form.zset">
		        <div class="form-group row">
				    <label for="firstname" class="col-sm-1 col-sm-offset-1 control-label">Member</label>
		        	<div class="col-sm-9">
						<input v-model="item.member" style="width: 150px; display: inline-block;" type="text" class="form-control">
						<input v-model="item.score" style="width: 250px; display: inline-block;" type="text" class="form-control">
				    </div>
		        </div>
		        </template>
		        <div class="form-group row">
				    <div class="col-sm-offset-2 col-sm-9">
				    	<button @click="insertZset" type="button" class="btn btn-info">Add</button>
				    </div>
				</div>
				<hr />
				<div class="form-group row">
				    <label for="firstname" class="col-sm-1 col-sm-offset-1 control-label">Members</label>
				    <div class="col-sm-9">
				    	<!-- 分页 -->
				    	<div v-if="key_info.pages != 1" class="input-group" style="width: 360px;">
				            <span class="input-group-addon" @click="requestZset('prev')">prev</span>
				            <span class="input-group-addon" @click="requestZset('next')">next</span>
				            <input type="text" v-model="key_info.page" class="form-control text-center">
				            <span @click="requestZset('jump')" class="input-group-addon">jump</span>
				        </div>
				        <!-- /分页 -->
				    	<table class="table">
							<thead><tr><td>member</td><td>score</td><td>Action</td></tr></thead>	
							<tbody>
							<template v-for="item in key_info.val">
								<tr>
									<td>{{ item[0] }}</td>
									<td>{{ item[1] }}</td>
									<td><button @click="updatingZset(item[0])" class="btn btn-sm btn-primary glyphicon glyphicon-pencil"></button>
									<button @click="deleteZset(item[0])" class="btn btn-sm btn-danger glyphicon glyphicon-trash"></button></td>
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
				zset: [
					{member: '', score: ''},
				]
			},	//新增
			update_form: {
				key: this.$route.params.key,
				expire: -1,
				member: '',
				score: ''
			}	//修改一般是单项修改的
		}
	},
	methods: {
		// 更新数据, 包括分页
		requestZset: function(params = '') {
			var page = 0;
			if (params == 'next') {
				page = parseInt(this.key_info.page)+1;
			} else if (params == 'prev') {
				page = parseInt(this.key_info.page)-1;
			} else {
				page = parseInt(this.key_info.page);
			}
			this.$redis.keyinfo({key: this.key, page: page}).then((result)=>{
				this.key_info = {};
				this.key_info = result.data;
			})
		},
		// 新增哈希
		insertZset: function() {
			this.$redis.cZset(this.insert_form).then((result)=>{
				this.requestZset();
			})
		},
		// 更新正在收集信息
		updatingZset: function(member) {
			// 1. 获取将要修改的哈希字段
			this.update_form.member = member;
			// 2. 打开模态框
			$('#myModal').modal('toggle');
		},
		// 更新
		updateZset: function() {
			this.$redis.eZset(this.update_form).then((result)=>{
				// 返回结果之后，它关闭模态框，并且清空值, 且需要更新数据信息
				$('#myModal').modal('toggle');
				this.requestZset();
			})
		},
		deleteZset: function(member = '') {
			// 两个等于号索引0也等同于''
			if (member === '') {
				this.$parent.delString({key: this.key});
			} else {
				this.$redis.dZset({key: this.key, member: member}).then((result)=>{
					this.requestZset();
				})
			}
		},
		// 更新键的生存时间
		updateTTL: function() {
			this.$redis.expire(this.update_form).then((result)=>{
				this.requestZset();
			})
		},
		bindExpire: function(ttl) {
			// 如果这么写就不用监听key_info的ttl属性了
			this.insert_form.expire = ttl;
			this.update_form.expire = ttl;
		}
	},
	created () {
		this.requestZset();
	},
	watch: {
		'$route' (to, from) { //监听路由是否变化
		    if(this.$route.params.key){// 判断条件1  判断传递值的变化
		    	this.key = this.$route.params.key;
		      	this.requestZset()
		    }
		},
		// 'key_info.ttl': {
		// 	handler: function() {
		// 		this.insert_form.expire = this.key_info.ttl;
		// 		this.update_form.expire = this.key_info.ttl;
		// 	},
		// }
	}
}

export { Ezset }