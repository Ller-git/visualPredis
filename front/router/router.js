import { Info } from "./info.js";

import { Cstring } from "./create/string.js";
import { Chash } from "./create/hash.js";
import { Clist } from "./create/list.js";
import { Cset } from "./create/set.js";
import { Czset } from "./create/zset.js";

import { Estring } from "./edit/string.js";
import { Ehash } from "./edit/hash.js";
import { Elist } from "./edit/list.js";
import { Eset } from "./edit/set.js";
import { Ezset } from "./edit/zset.js";

import { Command } from "./command.js";
import { Service } from "./service.js";

const routes = [
	// 功能
	{ path: '/', component: Info },

	// 新建
	{ path: '/create/string', component: Cstring },
	{ path: '/create/hash', component: Chash },
	{ path: '/create/list', component: Clist },
	{ path: '/create/set', component: Cset },
	{ path: '/create/zset', component: Czset },
	
	// 编辑加查看
	{ path: '/edit/string/:key', component: Estring },
	{ path: '/edit/hash/:key', component: Ehash },
	{ path: '/edit/list/:key', component: Elist },
	{ path: '/edit/set/:key', component: Eset },
	{ path: '/edit/zset/:key', component: Ezset },


	// 执行命令
	{ path: '/command', component: Command },
	{ path: '/service', component: Service },
]


// 默认导出
export default new VueRouter({
	routes //(缩写) 相当于routes: routes
})