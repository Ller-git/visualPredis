const Service = {
	template: `
		<div class="col-md-12">
			<p>&nbsp;</p>
			<div class="panel panel-default">
			    <div class="panel-heading" style="background-color: #fff;">
			        <h3 class="panel-title">
			            新增服务配置
			        </h3>
			    </div>
			    <div class="panel-body">
				    <p>&nbsp;</p>
			    	<div class="form-group row">
					    <label for="firstname" class="col-sm-1 col-sm-offset-1 control-label"><span style="color: #ec7254;">*</span>名称</label>
					    <div class="col-sm-9">
					    	<input type="text" v-model="name" class="form-control" placeholder="name">
					    </div>
					</div>
			        <p>&nbsp;</p>
			        <div class="form-group row">
					    <label for="firstname" class="col-sm-1 col-sm-offset-1 control-label"><span style="color: #ec7254;">*</span>地址</label>
					    <div class="col-sm-9">
					    	<input type="text" v-model="host" class="form-control" placeholder="host">
					    </div>
					</div>
			        <p>&nbsp;</p>
			        <div class="form-group row">
					    <label for="firstname" class="col-sm-1 col-sm-offset-1 control-label"><span style="color: #ec7254;">*</span>端口</label>
					    <div class="col-sm-9">
					    	<input type="text" v-model="port" class="form-control" placeholder="port">
					    </div>
					</div>
			        <p>&nbsp;</p>
			        <div class="form-group row">
					    <label for="firstname" class="col-sm-1 col-sm-offset-1 control-label"><span style="color: #ec7254;">*</span>验证密码</label>
					    <div class="col-sm-9">
					    	<input type="text" v-model="password" class="form-control" placeholder="password">
					    </div>
					</div>
			        <p>&nbsp;</p>
					<div class="form-group row">
					    <div class="col-sm-offset-2 col-sm-9">
					    	<button @click="appendService" type="button" class="btn btn-primary">确认提交</button>
					    </div>
					</div>
					<p>&nbsp;</p>
			    </div>
			</div>
			</template>
		</div>
	`,
	data () {
		return {
			name: '',
			host: '',
			port: '',
			password: '',
		}
	},
	methods: {
		appendService: function() {
			this.$redis.appendService(this.$data).then((result)=>{
				// 重新获取配置信息
				this.$parent.service();
			})
		}
	},
}

export { Service }