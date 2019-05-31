<template>
	<div>
		<div ref="grid" style="width:100%"></div>
		<v-snackbar v-model="snackbar" color="warning" :timeout="3000" top>请填写必要信息</v-snackbar>
	</div>
</template>

<script>
	let mygrid;
	let dp;

	function not_empty(value,id,ind){
		if (value=="") return false;
		return true;
	}

	export default {
		name: 'grid',
		data() {
			return {
				snackbar: false,
				errmsg: ''
			}
		},
		mounted() {
			mygrid = new dhtmlXGridObject(this.$refs.grid);
			mygrid.setImagePath("codebase/imgs/");
			mygrid.enableAutoHeight(true);
			mygrid.setDateFormat("%Y/%m/%d", "%Y/%m/%d");
			mygrid.setNumberFormat("0,000.00");
			mygrid.load('cols.json', function(){
				let ht = mygrid.cellType.map(v => v === "coro" ? "#select_filter" : "#text_filter");
				mygrid.attachHeader(ht.join());
			},'json');
			mygrid.init();
			mygrid.load("/api/data", "js");
			dp = new dataProcessor("/api/data");
			dp.enableDataNames(true);
			dp.enablePartialDataSend(true);
			dp.setTransactionMode("JSON", false);
			dp.setUpdateMode("off");
			dp.setVerificator(0, not_empty);
			dp.setVerificator(1, not_empty);
			dp.setVerificator(2, not_empty);
			dp.setVerificator(3, not_empty);
			dp.setVerificator(4, not_empty);
			
			dp.attachEvent("onValidationError",(id,messages) => {
				this.snackbar = true;
				return true; // confirm block
			});
			
			dp.attachEvent("onAfterUpdate", (id, action, tid, response) => {
				if (action === 'inserted') {
					mygrid.changeRowId(id, tid);
				}
			});
			
			dp.init(mygrid);
		},
		methods: {
			add() {
				if (dp.getSyncState() === false) {
					return false;
				}
				dp.setUpdateMode("cell", false);
				const uid = mygrid.uid();
				mygrid.addRow(uid, ",,,,");
				dp.setUpdated(uid);
				dp.setUpdateMode("off", false);
				return true;
			},
			del() {
				if (dp.getSyncState() === false) {
					return false;
				}
				mygrid.deleteSelectedRows();
				return true;
			},
			save() {
				dp.sendData();
			},
			setUserData(key, value) {
				mygrid.setUserData("", key, value);
			}
		}
	}
</script>
