<template>
  <div>
    <h2 v-if="project"> Categories to {{ project.name }} </h2>
    <table id="categoriesTable">
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Requirements</th>
        <th>Created</th>
        <th>Last Updated</th>
        <th>Followers</th>
        <th>Leader</th>
        <th>Actions</th>
      </tr>
      <tr v-for="(category, index) in categories">
        <td><a :href="'https://beta.requirements-bazaar.org/projects/' + projectId + '/categories/' + category.id" target='_blank'>{{ category.name }}</a></td>
        <td :title="category.description">{{ category.shortDescription }}</td>
        <td>{{ category.numberOfRequirements }}</td>
        <td>{{ category.created }}</td>
        <td>{{ category.lastUpdated }}</td>
        <td>{{ category.numberOfFollowers }}</td>
        <td>{{ category.leaderName }}</td>
        <td>
          <router-link v-if="category.numberOfRequirements > 0" :to="'/hoq/' + category.id">To HoQ</router-link>
          <span v-else>To HoQ</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>

import PostService from '../PostService'
import helpers from '../helpers/helpers.js'
export default {
  name: 'CategoriesComponent',
  data () {
    return {
      categories: [],
      projectId: '',
      project: null,
      text: ''
    }
  },
  async created () {
    document.title = "Categories";
    this.projectId = this.$route.params.projectId;
    this.idb = await this.getDb();
    try {
      this.project = await PostService.getProject(this.projectId);
      this.categories = await PostService.getAllCategories(this.projectId);
      this.saveCategoriesLocaly();
    } catch (err){
      var project = await this.getProjectName(this.projectId);
      this.project = project[0];
      this.categories = await this.getCategoriesLocaly();
      if(!this.project){
        this.$router.push('/projects');
      }
    }
    this.categories.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    });
    this.categories.forEach(category => {
      // description
      category.shortDescription = category.description;
      var limit = 100;
      if(category.description.length > limit){
        category.shortDescription = category.description.substring(0, limit);
        for(var i = limit - 1; i > 50; i--){
          if(category.shortDescription[i] == " "){
            category.shortDescription = category.shortDescription.substring(0, i);
            break;
          }
          category.shortDescription = category.shortDescription.substring(0, i);
        }
        category.shortDescription = category.shortDescription.concat("..");
      }
      // dates
      var creationDate = new Date(category.creationDate);
      category.created = helpers.isValidDate(creationDate) ? helpers.coolNumber(creationDate.getDate()) + "/" + helpers.coolNumber(creationDate.getMonth()) + "/" + creationDate.getFullYear() : "n/a";
      var lastUpdatedDate = new Date(category.lastUpdatedDate);
      category.lastUpdated = helpers.isValidDate(lastUpdatedDate) ? helpers.coolNumber(lastUpdatedDate.getDate()) + "/" + helpers.coolNumber(lastUpdatedDate.getMonth()) + "/" + lastUpdatedDate.getFullYear() : "n/a";
      // leader
      if(category.leader.firstName && category.leader.lastName){
        category.leaderName = category.leader.firstName + " " + category.leader.lastName;
      } else {
        category.leaderName = "Unassigned";
      }
      // active link
      category.active = category.numberOfRequirements == 0 ? "not-active" : "";
    });
  },
  methods:{
    async getDb() {
      return new Promise((resolve, reject) => {
        let request = window.indexedDB.open('hoqStore', 1);

        request.onerror = e => {
          console.log('Error opening db', e);
          reject('Error');
        };

        request.onsuccess = e => {
          resolve(e.target.result);
        };

        request.onupgradeneeded = e => {
          console.log('onupgradeneeded');
          let db = e.target.result;
          let projectsStore = db.createObjectStore('projects', {keyPath: 'key'});
          let categoriesStore = db.createObjectStore('categories', {keyPath: 'key'});
          let requirementsStore = db.createObjectStore('requirements', {keyPath: 'key'});
          let specificationsStore = db.createObjectStore('specifications', {keyPath: 'key'});
          let productsStore = db.createObjectStore('products', {keyPath: 'key'});
          let authorizedCategoriesStore = db.createObjectStore('authorizedCategories', {keyPath: 'key'});
        };
      });
    },
    async getCategoriesLocaly(){
      return new Promise((resolve, reject) => {
        let trans = this.idb.transaction(['categories'],'readonly');
        trans.oncomplete = e => {
          resolve(categories);
        };
        let store = trans.objectStore('categories');
        let categories = [];
        store.openCursor().onsuccess = e => {
          let cursor = e.target.result;
          if (cursor) {
            categories.push(cursor.value.value); // DO NOT I REPEAT DO NOT REMOVE SECOND VALUE FROM HERE
            cursor.continue();
          }
        };
      });
    },
    async getProjectName(projectId){
      return new Promise((resolve, reject) => {
        let trans = this.idb.transaction(['projects'],'readonly');
        trans.oncomplete = e => {
          resolve(projects);
        };
        let store = trans.objectStore('projects');
        let projects = [];
        store.openCursor().onsuccess = e => {
          let cursor = e.target.result;
          if (cursor) {
            if(cursor.value.key == projectId){
              projects.push(cursor.value.value); // DO NOT I REPEAT DO NOT REMOVE SECOND VALUE FROM HERE
            }
            cursor.continue();
          }
        };
      });
    },
    async saveCategoriesLocaly(){
      return new Promise((resolve, reject) => {
        let trans = this.idb.transaction(['categories'],'readwrite');
        trans.oncomplete = e => {
          resolve();
        };
        let store = trans.objectStore('categories');
        store.clear();
        this.categories.forEach(category => {
          store.put({key: category.id, value: category});
        });
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

#categoriesTable td, th {
  border: 1px solid gray;
}

#categoriesTable {
  border-collapse: collapse;
  min-width: 800px;
  position: relative;
  top: 45px;
  left: 50%;
  transform: translate(-50%, 0);
  margin: 0px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#categoriesTable td {
  padding: 10px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 35px 35px;
  height: 25px;
}

#categoriesTable td>a{
  text-decoration: none;
}

#categoriesTable td>a:link{
  color: #007db5;
}

#categoriesTable td>a:hover{
  color: #f1593c;
}

#categoriesTable tr:nth-child(odd) {
  background: #d1d8e8;
}

#categoreisTable tr:nth-child(even) {
  background: #e9eef4;
}

</style>
