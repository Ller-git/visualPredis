const Cstring = {
	template: `
		<div class="panel panel-default" style="margin: 30px; box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);">
		    <div class="panel-heading" style="background-color: #fff;">
		        <h3 class="panel-title">
		            创建 
		            <div class="btn-group">
						<button type="button" class="btn btn-default dropdown-toggle" 
								data-toggle="dropdown">
							STRING <span class="caret"></span>
						</button>
						<ul class="dropdown-menu" role="menu">
							<li><a href="#/create/string">STRING</a></li>
							<li><a href="#/create/hash">HASH</a></li>
							<li><a href="#/create/list">LIST</a></li>
							<li><a href="#/create/set">SET</a></li>
							<li><a href="#/create/zset">ZSET</a></li>
						</ul>
					</div>
		        </h3>
		    </div>
		    <div class="panel-body">
		    	<p>&nbsp;</p>
		    	<div class="form-group row">
				    <label for="firstname" class="col-sm-1 col-sm-offset-1 control-label"><span style="color: #f56c6c;">*</span>Key</label>
				    <div class="col-sm-9">
				    	<input type="text" v-model="form.key" class="form-control" id="firstname" placeholder="请输入名字">
				    </div>
				</div>
				<p>&nbsp;</p>

				<Expire :time="form.expire"></Expire>

				<p>&nbsp;</p>
		        <div class="form-group row">
				    <label for="firstname" class="col-sm-1 col-sm-offset-1 control-label"><span style="color: #ec7254;">*</span>Key</label>
		        	<div class="col-sm-9">
		        		<textarea name="" id="" cols="30" rows="10" class="form-control" v-model="form.value"></textarea>
				    </div>
		        </div>
		        <p>&nbsp;</p>
		        <div class="form-group">
				    <div class="col-sm-offset-2 col-sm-9">
				    	<button type="button" @click="submitString" class="btn btn-primary">Create</button>
				    </div>
				</div>
				<p>&nbsp;</p>
		    </div>
		</div>`,
	data () {
		return {
			form: {
				key: '',
				expire: -1,
				value: '117010410',
			}
		}
	},
	methods: {
		// 提交字符串
		submitString: function() {
			this.$redis.cString(this.form).then((result)=>{
				this.$parent.init();
			})
		},
		bindExpire: function(ttl) {
			this.form.expire = ttl;
		}
	},
	created () {

	}
}

export { Cstring }