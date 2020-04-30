const Czset = {
	template: `
		<div class="panel panel-default" style="margin: 30px;border-radius: 0px;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);">
		    <div class="panel-heading" style="background-color: #fff;">
		        <h3 class="panel-title">
		            创建 
		            <div class="btn-group">
						<button type="button" class="btn btn-default dropdown-toggle" 
								data-toggle="dropdown">
							ZSET <span class="caret"></span>
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
				<template v-for="item in form.zset">
		        <div class="form-group row">
				    <label for="firstname" class="col-sm-1 col-sm-offset-1 control-label"><span style="color: #f56c6c;">*</span>Members</label>
		        	<div class="col-sm-9">
						<input placeholder="member" v-model="item.member" style="width: 150px; display: inline-block;" type="text" class="form-control">
						<input placeholder="score" v-model="item.score" style="width: 250px; display: inline-block;" type="text" class="form-control">
				    	<button @click="delHash(item)" class="btn btn-default">Remove</button>
				    </div>
		        </div>
		        </template>
		        <p>&nbsp;</p>

		        <div class="form-group row">
				    <div class="col-sm-offset-2 col-sm-9">
				    	<button @click="addHash" type="submit" class="btn btn-success">Add Field</button>
				    </div>
				</div>
				<p>&nbsp;</p>

				<div class="form-group row">
				    <div class="col-sm-offset-2 col-sm-9">
				    	<button type="button" @click="submitHash" class="btn btn-primary">Submit</button>
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
				zset: [
					{member: '', score: ''},
				]
			}
		}
	},
	methods: {
		// 新增字段
		addHash: function () {
			this.form.zset.push({member: '', score: ''});
		},
		// 提交创建字段
		submitHash: function() {
			this.$redis.cZset(this.form).then((result)=>{
				this.$parent.init();
			})
		},
		// 移出字段
		delHash: function(item) {
			// 不能直接传下标，因为下标刚开始循环完了之后就会记住，当你删除中间的之后，后面的下标不会变化，这样删除的时候就会出现问题
		    var index = this.form.zset.indexOf(item);
		    if (index != -1) {
		    	this.form.zset.splice(index, 1);
		    }
		},
		bindExpire: function(ttl) {
			this.form.expire = ttl;
		}
	},
	created () {

	}
}

export { Czset }