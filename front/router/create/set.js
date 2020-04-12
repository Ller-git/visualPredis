const Cset = {
	template: `
		<div class="panel panel-default" style="margin: 30px;border-radius: 0px;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);">
		    <div class="panel-heading" style="background-color: #fff;">
		        <h3 class="panel-title">
		            创建 
		            <div class="btn-group">
						<button type="button" class="btn btn-default dropdown-toggle" 
								data-toggle="dropdown">
							SET <span class="caret"></span>
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
				    <label for="firstname" class="col-sm-1 col-sm-offset-1 control-label"><span style="color: #ec7254;">*</span>Key</label>
				    <div class="col-sm-9">
				    	<input type="text" v-model="form.key" class="form-control" id="firstname" placeholder="请输入键">
				    </div>
				</div>
				<p>&nbsp;</p>

				<Expire :time="form.expire"></Expire>

				<p>&nbsp;</p>
		        <template v-for="(item, index) in form.set">
		        <div class="form-group row">
				    <label for="firstname" class="col-sm-1 col-sm-offset-1 control-label"><span style="color: #f56c6c;"></span>Member</label>
		        	<div class="col-sm-9">
						<input placeholder="value" v-model="item.value" style="width: 250px; display: inline-block;" type="text" class="form-control">
				    	<button @click="delSet(item)" class="btn btn-default">Remove</button>
				    </div>
		        </div>
		        </template>
		        <p>&nbsp;</p>

		        <div class="form-group row">
				    <div class="col-sm-offset-2 col-sm-9">
				    	<button @click="addSet" type="submit" class="btn btn-success">Add Member</button>
				    </div>
				</div>
				<p>&nbsp;</p>

				<div class="form-group row">
				    <div class="col-sm-offset-2 col-sm-9">
				    	<button @click="submitSet" type="button" class="btn btn-primary">Submit</button>
				    	<button type="reset" class="btn btn-default">Reset</button>
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
				set: [
					{value: ''}
				]
			}
		}
	},
	methods: {
		// 新增list
		addSet: function() {
			this.form.set.push({value: ''});
		},
		// 删除list
		delSet: function(item) {
			var index = this.form.list.indexOf(item);
		    if (index != -1) {
		    	this.form.set.splice(index, 1);
		    }
		},
		// 提交数据
		submitSet: function() {
			this.$redis.cSet(this.form).then((result)=>{
				console.log(result.data);
			})
		},
		bindExpire: function(ttl) {
			this.form.expire = ttl;
		}
	},
	created () {

	}
}

export { Cset }