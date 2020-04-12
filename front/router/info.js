const Info = {
	template: `
		<div class="col-md-12">
			<h2>&emsp;信息</h2>
			<template v-for="(item, key) in info">
			<div class="panel panel-default">
			    <div class="panel-heading" style="background-color: #fff;">
			        <h3 class="panel-title">
			            {{ key }}
			        </h3>
			    </div>
			    <div class="panel-body">
				    <table class="table table-striped">
				  		<tbody v-for="(item2, key2) in item">
						    <tr :key="key2">
						      <td>{{ key2 }}</td>
						      <td>{{ item2 }}</td>
						    </tr>
					  </tbody>
					</table>
			    </div>
			</div>
			</template>
		</div>
	`,
	data () {
		return {
			info: {}
		}
	},
	methods: {
		requestData: function() {
			this.$redis.info().then((result)=>{
				this.info = result.data;
			})
		}
	},
	created(){
		this.requestData()
	}
}

export { Info }