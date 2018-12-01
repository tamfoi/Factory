<template>
  <div v-on:click.right.prevent="openMenu" class="projectItemWrap">
    <div class="projectImteHead">
      <div class="title">{{project.name}}</div>
      <button v-on:click="settingChange" v-bind:class="{edit : editSettingChange}">{{editSettingChange ? '設定を保存する' : '設定を変更する'}}</button>
      <button v-on:click="generateFile" v-bind:disabled="editSettingChange">ファイルを生成する</button>
    </div>
    <div class="setting" v-show="editSettingChange">
      <div class="settingItem input">
        <div class="settingName">プロジェクト名</div>
        <input placeholder="プロジェクト名" v-model="project.name" v-bind:disabled="disabledSettingChange">
      </div>
      <div class="settingItem select">
        <div class="settingName">テンプレート</div>
        <button v-on:click="selectTemplatePath" v-bind:disabled="disabledSettingChange" >{{ project.templatePath.length > 0 ? project.templatePath : "選択する" }}</button>
      </div>
      <div class="settingItem select">
        <div class="settingName">データ</div>
        <button v-on:click="selectDataPath" v-bind:disabled="disabledSettingChange">{{ project.dataPath.length > 0 ? project.dataPath : "選択する" }}</button>
      </div>
      <div class="settingItem select">
        <div class="settingName">出力先</div>
        <button v-on:click="selectOutputPath" v-bind:disabled="disabledSettingChange">{{ project.outputPath.length > 0 ? project.outputPath : "選択する" }}</button>
      </div>
      <div class="settingItem input">
        <div class="settingName">命名規則</div>
        <input placeholder="file_<%- index %>.html" v-model="project.outputFileNameTemplate" v-bind:disabled="disabledSettingChange">
      </div>
    </div>
  </div>
</template>

<script>

  const electron = require("electron");
  const ejs = require('ejs');
  const fs = require('fs');
  const path = require('path');

  export default {
    props: [
      'index',
      'project'
    ],
    data () {
      return {
        editSettingChange: false,
        rightClickMenu:null
      }
    },
    mounted(){
      
      this.rightClickMenu = new electron.remote.Menu();
      this.rightClickMenu.append(new electron.remote.MenuItem({
        label: 'このプロジェクトを削除する',
        click: () => {
          this.deleteProject();
        }
      }));

    },
    methods:{
      saveProject(){
        this.$emit('saveProject');
      },
      deleteProject(){
        this.$emit('deleteProject', this.index);
      },
      selectTemplatePath(){
        electron.remote.dialog.showOpenDialog(null, {
          title: 'テンプレートファイル選択',
          defaultPath: '.',
          filters: [
            {name: 'ejsファイル', extensions: ['ejs']}
          ]
        }, (result) => {
          this.project.templatePath = result[0];
        });
      },
      selectDataPath(){
        electron.remote.dialog.showOpenDialog(null, {
          title: 'データファイル選択',
          defaultPath: '.',
          filters: [
            {name: 'jsonファイル', extensions: ['json']}
          ]
        }, (result) => {
          this.project.dataPath = result[0];
        });
      },
      selectOutputPath(){
        electron.remote.dialog.showOpenDialog(null, {
          properties: ['openDirectory'],
          title: '出力先選択',
          defaultPath: '.'
        }, (result) => {
          this.project.outputPath = result[0];
        });
      },
      settingChange(){
        
        if(this.editSettingChange){
          //設定を保存させる
          this.saveProject();
        }

        this.editSettingChange = !this.editSettingChange;
      },
      generateFile(){

        if(this.project.templatePath == null && this.project.dataPath == null && this.project.outputPath == null) return;

        const dataAll = JSON.parse(fs.readFileSync(this.project.dataPath,'utf8'));
  
        dataAll.forEach((data,index) => {

          ejs.renderFile(this.project.templatePath, data, (error,output) => {
            
            if(!error){

              const outputFileName = ejs.render(this.project.outputFileNameTemplate,{index:index, data:data});

              fs.writeFileSync(path.join(this.project.outputPath,outputFileName),output,() => {
                electron.shell.openExternal(this.project.outputPath);
              });
            
            }

          })
        });

      },
      openMenu(){
        this.rightClickMenu.popup(electron.remote.getCurrentWindow());
      }
    },
    computed: {
      disabledSettingChange(){
        return !this.editSettingChange;
      }
    }
    
  }
</script>

<style scoped>
  button{
    min-width:500
  }
  .projectItemWrap{
    background-color:#3e3e3e;
    border-radius: 5px;
  }
  .projectImteHead{
    background-color: #303030;
    padding: 10px 15px;
    display:flex;
  }
  .title{
    flex-grow:1;
  }
  .projectImteHead button{
    background-color: #5275a8;
    min-width: 155px;
  }
  .projectImteHead button:not(:first-child){
    margin-left: 10px;
  }
  .projectImteHead button:not(:disabled):hover{
    background-color: #5281a8;
  }
  .projectImteHead button:disabled{
    opacity:0.5;
    cursor: auto;
  }
  .projectImteHead button.edit{
    background-color: #a85252;
  }
  .projectImteHead button.edit:hover{
    background-color:#a86552
  }

  .setting{
    padding: 10px 15px;
  }
  .setting .settingItem{
    display: flex;
  }
  .setting .settingItem:not(:first-child){
    margin-top: 10px;
  }
  .setting .settingName{
    width: 300px;
    border-right: 3px solid #252525;
  }
  .setting input,
  .setting button{
    margin-left: 15px;
    flex-grow: 1;
    text-align: left;
  }
  .setting input{
    font-size: 16px;
    padding: 5px;
    background-color: #e0e0e0;
    outline: none;
    border: none;
  }
  .setting button{
    background-color: #5b5b5b;
  }
  .setting button:hover{
    background-color: #bd8b06;
  }
</style>
