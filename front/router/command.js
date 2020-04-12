/**
 * 命令行
 */

const Command = {
	template: `
		<div class="col-md-12">
			<p>&nbsp;</p>
			<div class="panel panel-default">
				<div class="panel-heading">Reids命令<span @click="switchState" data-toggle="collapse" data-parent="#accordion" 
		                href="#command" class="pull-right"><span class="glyphicon" :class="[eye ? 'glyphicon-eye-open' : 'glyphicon-eye-close']"></span>结果</span></div>
				<div class="panel-body">
					<div id="command" class="panel-collapse collapse in">
			            <div class="panel-body">
			                <table class="table">
						        <th>执行语句</th><th>执行结果</th>
						        <template v-for="(item, key) in result">
									<tr><td>{{ key }}</td><td>{{ item }}</td></tr>
						        </template>
						    </table>
			            </div>
			        </div>	<!-- /#command -->
					<textarea class="form-control" style="font-size: 18px;color: #000;" cols="30" rows="10" v-model="command"></textarea>
				</div>
				<div class="panel-footer">
					<button @click="submitCommand" type="button" class="btn btn-success">执行</button>
				</div>
			</div>
		</div>
	`,
	data () {
		return {
			command: '',
			result: {},
			eye: false
		}
	},
	methods: {
		switchState: function() {
			this.eye = !this.eye;
		},
		submitCommand: function() {
			// 提交完成之后会有结果。将结果放在上方
			this.$redis.command(this.command).then((result)=>{
				this.result = {};
				this.result = result.data.data;
			})
		},
		cleanUp: function() {
			this.command = {};
		}
	},
}

export { Command }