/**
 * 组件v-model
 * 这是一个加减的input框
 */


Vue.component('Expire', {
	template: `<div class="form-group row">
				    <label for="firstname" class="col-sm-1 col-sm-offset-1 control-label"><span style="color: #ec7254;">*</span>Expire</label>
				    <div class="col-sm-9">
						<div class="input-group" style="width: 200px;">
				            <span @click="update('prev')" class="input-group-addon"><span class="glyphicon glyphicon-minus"></span></span>
				            <input title="有效时间"  
			data-container="body" data-toggle="popover" data-placement="top" 
			data-content="单位秒，除-1为永久有效，小于0皆为立即过期。" :value="expire" @input="update($event.target.value)" type="text"  class="form-control text-center">
				            <span @click="update('next')" class="input-group-addon"><span class="glyphicon glyphicon-plus"></span></span>
				        </div>
				    </div>
				</div>`,
	props: ['time'],
	// 不能直接使用time属性，它老报错，意思是我子组件修改了父组件的值，但是我是v-bind绑定的又不是v-model,怎么也修改不了父组件的值啊。难受
	data() {
		return {
			expire: this.time,
		}
	},
	methods: {
		update: function(action) {
			if (action == 'prev') {
				this.expire -= 1;
			} else if (action == 'next') {
				this.expire += 1;
			} else {
				this.expire = action;
			}
			this.$parent.bindExpire(this.expire);
		}
	},
	created() {
	},
	watch: {
		'time': {
			handler: function() {
				this.expire = this.time;
			},
		}
	}
})