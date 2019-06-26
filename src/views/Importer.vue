<template>
    <div>
        <v-toolbar dense>
            <upload-btn small @file-update="update" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
                <template slot="icon-left">
                    <v-icon small left>input</v-icon>
                </template>
            </upload-btn>
            <v-spacer></v-spacer>
            <v-btn small color="primary" :disabled="dissave" :loading="loadingsave" @click="save"><v-icon small left>done</v-icon>保存</v-btn>
        </v-toolbar>
		<div ref="importergrid" style="width:100%"></div>
        <v-snackbar v-model="snackbarsucc" color="success" :timeout="5000" top>保存成功
            <v-btn flat @click="snackbarsucc = false"><v-icon small right>highlight_off</v-icon></v-btn>
        </v-snackbar>
        <v-snackbar v-model="snackbarfail" color="error" :timeout="5000" top>保存失败
            <v-btn flat @click="snackbarfail = false"><v-icon small right>highlight_off</v-icon></v-btn>
        </v-snackbar>
    </div>
</template>

<script>
//    import XLSX from 'xlsx'
    import UploadButton from 'vuetify-upload-button'

    function readWorkbookFromLocalFile(file, callback) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {type: 'binary', cellDates:true});
            if(callback) callback(workbook);
        };
        reader.readAsBinaryString(file);
    }

    function workbook2json(workbook) {
        let sheetNames = workbook.SheetNames;
        let worksheet = workbook.Sheets[sheetNames[0]];
        let json = XLSX.utils.sheet_to_json(worksheet, {raw:true});
        return json;
    }

    export default {
        data() {
            return {
                mygrid: {},
                filedata: [],
                dissave: true,
                loadingsave: false,
                snackbarsucc: false,
                snackbarfail: false
            }
        },
        methods: {
            update(file) {
                if (!file) return;
                readWorkbookFromLocalFile(file, workbook => {
                    let json = workbook2json(workbook);
                    let aid = 1000;
                    let j1 = json.map(v => {
                        let u = {id:aid++};
                        for(let k in v) {
                            if (v[k].constructor.name === 'Date') {
                                u[k.trim()] = v[k].toISOString().slice(0, 10);
                            } else if (v[k].constructor.name === 'String') {
                                u[k.trim()] = v[k].trim().replace('\r\n', '');
                            } else {
                                u[k.trim()] = v[k];
                            }
                        }
                        return u;
                    });
                    this.filedata = j1;
                    const j2 = JSON.stringify({ data:j1 });
                    this.mygrid.parse(j2, "js");
                    this.$axios.post('/api/bulkcheck', this.filedata)
                        .then(response => {
                            const ids = response.data.ids;
                            for (const id of ids) {
                                this.mygrid.setRowColor(id, "#ffc0c0");
                            }
                            this.dissave = ids.length > 0;
                        })
                        .catch(error => {
                            console.error(error);
                            console.log(error.response);
                        });
                });
            },
            save() {
                this.loadingsave = true;
                this.$axios.post('/api/bulksave', { user:this.$root.username, data:this.filedata })
                    .then(response => {
                        console.log(response);
                        this.snackbarsucc = true;
                    })
                    .catch(error => {
                        console.error(error);
                        console.log(error.response);
                        this.snackbarfail = true;
                    })
                    .finally(() => {
                        this.dissave = true;
                        this.loadingsave = false;
                    });
            }
        },
        mounted() {
			const mygrid = new dhtmlXGridObject(this.$refs.importergrid);
			mygrid.setImagePath("codebase/imgs/");
			mygrid.enableAutoHeight(true, 400);
			mygrid.setDateFormat("%Y-%m-%d", "%Y-%m-%d");
//			mygrid.setDateFormat("%Y/%n/%j", "%Y/%n/%j");
			mygrid.setNumberFormat("0,000.00");
			mygrid.load('cols.json', function(){
				let ht = mygrid.cellType.map(v => v === "coro" ? "#select_filter" : "#text_filter");
				mygrid.attachHeader(ht.join());
			},'json');
            mygrid.init();
            mygrid.setEditable(false);
            this.mygrid = mygrid;
        },
        components: {
            'upload-btn': UploadButton
        }
    }
</script>
