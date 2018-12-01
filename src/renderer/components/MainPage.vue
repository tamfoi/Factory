<template>
  <div>
    <h1>&#x1f469;&#x1f3fb;&#x200d;&#x1f4bb;Factory</h1>
    <div class="headButtonWrap">
      <button class="newProject" v-on:click="generateNewProject">新規プロジェクトを作成する</button>
    </div>
    <ul class="projectListRoot">
      <li class="projectItemWrap" v-for="(project,index) in settingData.projectList" v-bind:key="getUniqueKeyByIndex(index)">
        <project-item v-on:saveProject="saveProject" v-on:deleteProject="deleteProject" v-bind:index="index" v-bind:project="project"></project-item>
      </li>
    </ul>
  </div>
</template>

<script>
  import ProjectItem from './MainPage/ProjectItem'
  
  const fs = require("fs");
  const path = require("path");

  export default {
    data(){
      return {
        settingPath: process.env.NODE_ENV === 'development' ? path.join(__static,"../factory.setting.json") : path.join(__static,"../../../../../factory.setting.json"),
        settingData: null
      }
    },
    components: { ProjectItem },
    created(){

      //設定ファイルが存在しなければ生成する(初回起動)
      try {
        fs.statSync(this.settingPath);
      } catch (error) {
        fs.writeFileSync(this.settingPath,`{"projectList":[]}`);
      }

      this.settingData = JSON.parse(fs.readFileSync(this.settingPath,'utf-8'));

    },
    mounted(){

    },
    methods: {
      getUniqueKeyByIndex(index){
        return String(Date.now()) + String(index);
      },
      saveProject(){
        fs.writeFileSync(this.settingPath,JSON.stringify(this.settingData));
      },
      deleteProject(index){
        this.settingData.projectList.splice(index,1);
        this.saveProject();
      },
      generateNewProject(){
        this.settingData.projectList.unshift({
          name:`project-${Date.now()}`,
          templatePath:"",
          dataPath:"",
          outputPath:"",
          outputFileNameTemplate:"file_<%- index%>.html"
        })
        this.saveProject();
      }
    }
  }
</script>

<style>
  *{
    font-family: "游ゴシック", "ヒラギノ角ゴ Pro W3", "メイリオ", sans-serif;
  }
  body{
    margin:0;
    color: #fff;
    background-color:#222222;
    font-size: 20px;
    padding: 15px;
  }
  h1{
    margin:0;
  }
  button{
    cursor: pointer;
    border: none;
    border-radius: 3px;
    padding: 5px;
    color: #fff;
    text-shadow: 0px 1px 1px black;
    font-size: 16px;
    font-weight: 500;
  }
  button:focus{
    outline: none;
  }
  .headButtonWrap{
    margin-top: 10px;
  }
  .newProject{
    background-color: #52a852;
  }
  .newProject:hover{
    background-color: #5cba5c;
  }
  .projectListRoot{
    padding:0;
    margin: 13px 0 0 0;
  }
  .projectItemWrap{
    list-style:none;
  }
  .projectItemWrap:not(:first-child){
    margin-top: 14px;
  }
</style>
