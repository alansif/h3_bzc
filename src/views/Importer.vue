<template>
    <div>
        <v-toolbar dense>
            <upload-btn small @file-update="update" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
                <template slot="icon-left">
                    <v-icon small left>input</v-icon>
                </template>
            </upload-btn>
        </v-toolbar>
		<div ref="importergrid" style="width:100%"></div>
    </div>
</template>

<script>
    import XLSX from 'xlsx'
    import UploadButton from 'vuetify-upload-button'

    function readWorkbookFromLocalFile(file, callback) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});
            if(callback) callback(workbook);
        };
        reader.readAsBinaryString(file);
    }

    function workbook2json(workbook) {
        let sheetNames = workbook.SheetNames;
        let worksheet = workbook.Sheets[sheetNames[0]];
        let json = XLSX.utils.sheet_to_json(worksheet);
        return json;
    }

    export default {
        data() {
            return {
                mygrid: {}
            }
        },
        methods: {
            update(file) {
                if (!file) return;
                readWorkbookFromLocalFile(file, workbook => {
                    let json = workbook2json(workbook);
                    let j1 = json.map(v => {
                        let u = {id:this.mygrid.uid()};
                        for(let k in v) {
                            u[k.trim()] = v[k];
                        }
                        return u;
                    });
                    let jj = { data:j1 };
                    const j2 = JSON.stringify(jj);
                    this.mygrid.parse(j2, "js");
                });
            }
        },
        mounted() {
			const mygrid = new dhtmlXGridObject(this.$refs.importergrid);
			mygrid.setImagePath("codebase/imgs/");
			mygrid.enableAutoHeight(true);
			mygrid.setDateFormat("%Y/%m/%d", "%Y/%m/%d");
			mygrid.setNumberFormat("0,000.00");
			mygrid.load('cols.json', function(){
				let ht = mygrid.cellType.map(v => v === "coro" ? "#select_filter" : "#text_filter");
				mygrid.attachHeader(ht.join());
			},'json');
            mygrid.init();
            const a = [];
            this.mygrid = mygrid;
        },
        components: {
            'upload-btn': UploadButton
        }
    }
</script>
