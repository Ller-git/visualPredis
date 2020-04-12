/**
 * 组件递归
 * 这是一个递归键的组件
 */

Vue.component('Keys', {
	template: `<ul>
		<template v-for="(item, index) in val">
		<br>
		<li v-if="item.hasOwnProperty('visualpredis')">
			<a :href="'#/edit/'+item.type+'/'+parent+':'+index">
				<span class="glyphicon glyphicon-file"></span>
				&emsp;{{ index }}
				<span class="pull-right alert alert-info" style="font-size: 12px;padding: 3px;margin: 0;width: 60px;">&emsp;{{ item.type }}</span>
			</a>
		</li>
		<li v-else >							
			<span @click="showChildKey(index)" class="glyphicon" :class="[show_child_key.includes(index) ? 'glyphicon-folder-open' : 'glyphicon-folder-close']"></span>
			&emsp;{{ index }}
			<span class="pull-right alert alert-success" style="font-size: 12px;padding: 3px;margin: 0;width: 60px;">&emsp;group</span>
			<Keys v-if="show_child_key.includes(index)" :val="item" :parent="parent+':'+index"></Keys>
		</li>
		</template>	
	</ul>`,
	props: ['val', 'parent'],
	data: function() {
		return {
			show_child_key: [],
		}
	},
	methods: {
		showChildKey: function(index) {
			// 关联索引其实可以使用 'a' in arr 这种方式，不过in如果是下标数组的话就不行了。
			if (this.show_child_key.includes(index)) {
				// 关闭
				let sck_index = this.show_child_key.indexOf(index)
				this.show_child_key.splice(sck_index, 1)
			} else {
				// 开启
				this.show_child_key.push(index)
			}
		},
	},
	created() {
	},
})