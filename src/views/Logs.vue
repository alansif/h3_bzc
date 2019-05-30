<template>
    <div>
        <v-toolbar dense>
            <v-btn small color="primary" @click="reload"><v-icon small left>refresh</v-icon>刷新</v-btn>
        </v-toolbar>
		<div ref="logsgrid" style="width:100%"></div>
    </div>
</template>

<script>
	export default {
		data() {
			return {
                mygrid: {}
			}
        },
        mounted() {
            const head = "id,action,rowid,fieldname,valuefrom,valueto,occurtime,operator,jsondata,transaction";
			const mygrid = new dhtmlXGridObject(this.$refs.logsgrid);
			mygrid.setImagePath("codebase/imgs/");
			mygrid.enableAutoHeight(true);
			mygrid.setDateFormat("%Y/%m/%d", "%Y/%m/%d");
            mygrid.setNumberFormat("0,000.00");
            mygrid.setHeader(head);
            mygrid.setColumnIds(head);
            mygrid.setColTypes("ron,ro,ron,ro,ro,ro,ro,ro,ro,ro");
            mygrid.setColSorting("int,str,int,str,str,str,date,str,str,str");
            mygrid.setInitWidths("60,80,60,130,180,180,150,100,100,120");
			mygrid.init();
            mygrid.load("/api/logs", "js");
            this.mygrid = mygrid;
        },
        methods: {
            reload() {
                this.mygrid.clearAndLoad("/api/logs", "js");
            }
        }
    }
</script>
