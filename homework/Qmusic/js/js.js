var audio = document.querySelector('audio')
var routes = [{
		path: '/',
		component: {
			template: '#index',
			data() {
				return {
					input: '',
					hotitem: ''
				}
			},
			methods: {
				findhot() {
					this.$http.jsonp('https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?', {
						params: {
							format: 'jsonp',
							jsonpCallback: 'callback'
						},
						jsonpCallback: 'callback'
					}).then((res) => {
						this.hotitem = res.data.data.hotkey
					})
				},
				hotclick(a) {
					this.input = a
				},
			},
		}
	},
	{
		path: '/findlist/:songname',
		component: {
			template: '#findlist',
			data() {
				return {
					songlist: ''
				}
			},
			activated() {
				this.$http.jsonp('https://c.y.qq.com/soso/fcgi-bin/client_search_cp', {
					params: {
						g_tk: 5381,
						p: 1,
						n: 20,
						w: this.$route.params.songname,
						format: 'jsonp',
						jsonpCallback: 'callback',
						loginUin: 0,
						hostUin: 0,
						inCharset: 'utf8',
						outCharset: 'utf-8',
						notice: 0,
						platform: 'yqq',
						needNewCode: 0,
						remoteplace: 'txt.yqq.song',
						t: 0,
						aggr: 1,
						cr: 1,
						catZhida: 1,
						flag_qc: 0,
					},
					jsonpCallback: 'callback'
				}).then((res) => {
					this.songlist = res.data.data.song.list
				})
			}
		}
	},
	{
		path: '/sort',
		component: {
			template: '#sort',
			data() {
				return {
					sortlist: []
				}
			},
			created() {
				this.$http.jsonp('https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?', {
					params: {
						format: 'jsonp',
						jsonpCallback: 'MusicJsonCallback'
					},
					jsonpCallback: 'MusicJsonCallback'
				}).then((res) => {
					this.sortlist = res.data.data.topList
				})
			}
		}
	},
	{
		path: '/songlist',
		component: {
			template: '#songlist',
		}
	},
	{
		path: '/singer',
		component: {
			template: '#singer',
			data() {
				return {
					singerlist: []
				}
			},
			created() {
				this.$http.jsonp(
					'https://c.y.qq.com/v8/fcg-bin/v8.fcg?channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&g_tk=5381&jsonpCallback=callback&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0', {
					jsonpCallback: 'callback'
					}).then((res) => {
					for(var i = 0; i < res.data.data.list.length; i++){
						this.singerlist.push({
							name:res.data.data.list[i].Fsinger_name,
							index:res.data.data.list[i].Findex,
							mid:res.data.data.list[i].Fsinger_mid	
						})
					}
					console.log(this.singerlist)
				})
			}
		}
	},
	{
		path: '/playlist/:mid/:songname',
		component: {
			template: '#playlist',
			data() {
				return {
					getsong: true,
					arr: []
				}
			},
			activated() {
				this.arr.unshift({
					name: this.$route.params.songname,
					mid: this.$route.params.mid
				})
			}
		}
	},
	{
		path: '/sortlist/:id',
		component: {
			template: '#sortlist',
			data() {
				return {
					songlist: ''
				}
			},
			activated() {
				this.$http.jsonp('https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg', {
					params: {
						topid: this.$route.params.id,
						format: 'jsonp',
						jsonpCallback: 'callback'
					},
					jsonpCallback: 'callback'
				}).then((res) => {
					this.songlist = res.data.songlist
				})
			}
		}
	},
	{
		path: '/aboutsinger/:singermid',
		component: {
			template: '#aboutsinger',
			data() {
				return {
					singerlist: ''
				}
			},
			activated() {
				this.$http.jsonp('https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg', {
					params: {
						singermid: this.$route.params.singermid,
						begin: 0,
						num: 30,
						format: 'jsonp',
						jsonpCallback: 'callback'
					},
					jsonpCallback: 'callback'
				}).then((res) => {
					this.singerlist = res.data.data
				})
			}
		}
	}


]
var router = new VueRouter({
	routes
})
new Vue({
	el: '#con',
	data: {
		src: '',
		titindex: 0,
		getsong: true,
		arr: [],
		titdata: [{
				name: '首页',
				path: '',
			},
			{
				name: '歌曲列表',
				path: 'findlist/:songname'
			},
			{
				name: '排行榜',
				path: 'sort'
			},
			{
				name: '歌单',
				path: 'songlist'
			},
			{
				name: '歌手',
				path: 'singer'
			},
			{
				name: '播放列表',
				path: 'playlist/:mid'
			},
		]
	},
	watch: {
		'$route.params.mid'(a, b) {
			if (a) {
				if ('/playlist/:mid' != this.$route.path) {
					this.$http.jsonp('https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg', {
						params: {
							g_tk: 1278911659,
							hostUin: 0,
							format: 'jsonp',
							callback: 'callback	',
							inCharset: 'utf8',
							outCharset: 'utf-8',
							notice: 0,
							platform: 'yqq',
							needNewCode: 0,
							cid: 205361747,
							uin: 0,
							songmid: a,
							filename: 'C400' + a + '.m4a',
							guid: 3655047200,
						},
						jsonpCallback: 'callback'
					}).then((res) => {
						this.src = 'http://dl.stream.qqmusic.qq.com/' + res.data.data.items[0].filename + '?vkey=' + res.data.data.items[
							0].vkey + '&guid=3655047200&fromtag=66'
					})
				}
			}
		},
	},
	router
})
