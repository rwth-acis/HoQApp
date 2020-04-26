<template>
  <div>
    <h2> Projects </h2>
    <div v-if="this.$oidc.isAuthenticated">
      <table id="projectsTable">
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Categories</th>
          <th>Created</th>
          <th>Last Updated</th>
          <th>Followers</th>
          <th>Actions</th>
        </tr>
        <tr v-for="(project, index) in displayedProjects">
          <td><a :href="'https://requirements-bazaar.org/projects/' + project.id" target='_blank'>{{ project.name }}</a></td>
          <td :title="project.description">{{ project.shortDescription }}</td>
          <td>{{ project.numberOfCategories }}</td>
          <td>{{ project.created }}</td>
          <td>{{ project.lastUpdated }}</td>
          <td>{{ project.numberOfFollowers }}</td>
          <td>
            <router-link v-if="project.numberOfCategories > 0" :to="'/categories/' + project.id">To Categories</router-link>
            <span v-else>To Categories</span>
          </td>
        </tr>
      </table>
    </div>
    <div v-else>
      <p>You are not logged in.</p>
    </div>
    <br />
    <br />
    <br />
    <br />
    <br />
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item">
          <button type="button" class="page-link" v-if="page != 1" @click="page--"> Previous </button>
          <button type="button" class="page-link" v-for="pageNumber in pages" @click="page = pageNumber"> {{pageNumber}} </button>
          <button type="button" @click="page++" v-if="page < pages.length" class="page-link"> Next </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>

import PostService from '../PostService'
import helpers from '../helpers/helpers.js'
export default {
  name: 'ProjectsComponent',
  data () {
    return {
      activeUser: null,
      idb: null,
      projects: [],
      page: 1,
      perPage: 25,
      pages: [],
    }
  },
  async created () {

  },
  async mounted(){
    document.title = "My Projects";
    // get indexedDB
    this.idb = await this.getDb();
    // ACTIVE USER
    if(this.$oidc.isAuthenticated){
      try {
        this.activeUser = await PostService.getActiveUser(this.$oidc.user);
      } catch (err) {

      }
      try {
        this.projects = await PostService.getMyProjects(this.activeUser.id);
        this.saveProjectsLocaly();
      } catch (err){
        this.projects = await this.getProjectsLocaly();
      }
    }
    // (MY)PROJECTS

    this.projects.sort(function(a, b){
      if(a.name < b.name) { return -1; }
      if(a.name > b.name) { return 1; }
      return 0;
    });

    this.projects.forEach(project => {
      // description
      project.shortDescription = project.description;
      var limit = 100;
      if(project.description.length > limit){
        project.shortDescription = project.description.substring(0, limit);
        for(var i = limit - 1; i > 50; i--){
          if(project.shortDescription[i] == " "){
            project.shortDescription = project.shortDescription.substring(0, i);
            break;
          }
          project.shortDescription = project.shortDescription.substring(0, i);
        }
        project.shortDescription = project.shortDescription.concat("..");
      }
      // dates
      var creationDate = new Date(project.creationDate);
      var lastUpdatedDate = new Date(project.lastUpdatedDate);
      project.created = helpers.isValidDate(creationDate) ? helpers.coolNumber(creationDate.getDate()) + "/" + helpers.coolNumber(creationDate.getMonth()) + "/" + creationDate.getFullYear() : "n/a";
      project.lastUpdated = helpers.isValidDate(lastUpdatedDate) ? helpers.coolNumber(lastUpdatedDate.getDate()) + "/" + helpers.coolNumber(lastUpdatedDate.getMonth()) + "/" + lastUpdatedDate.getFullYear() : "n/a";
      // following
      project.following = project.following ? "Yes" : "No";
      // active link
      project.active = project.numberOfCategories == 0 ? "not-active" : "";
    });

  },
  computed: {
    displayedProjects() {
      return this.paginate(this.projects);
    }
  },
  watch: {
    projects() {
      this.setPages();
    }
  },
  filters: {
    trimWords(value){
      return value.split(" ").splice(0,20).join(" ") + '...';
    }
  },
  methods:{
    setPages () {
      let numberOfPages = Math.ceil(this.projects.length / this.perPage);
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },
    paginate (projects) {
      let page = this.page;
      let perPage = this.perPage;
      let from = (page * perPage) - perPage;
      let to = (page * perPage);
      return  projects.slice(from, to);
    },
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
    async getProjectsLocaly(){
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
            projects.push(cursor.value.value); // DO NOT I REPEAT DO NOT REMOVE SECOND VALUE FROM HERE
            cursor.continue();
          }
        };
      });
    },
    async saveProjectsLocaly(){
      return new Promise((resolve, reject) => {
        let trans = this.idb.transaction(['projects'],'readwrite');
        trans.oncomplete = e => {
          resolve();
        };
        let store = trans.objectStore('projects');
        store.clear();
        this.projects.forEach(project => {
          store.put({key: project.id, value: project});
        });
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

#projectsTable td, th {
  border: 1px solid gray;
}

#projectsTable {
  border-collapse: collapse;
  min-width: 800px;
  position: relative;
  top: 45px;
  left: 50%;
  transform: translate(-50%, 0);
  margin: 0px;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}

#projectsTable td {
  padding: 10px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 35px 35px;
  height: 25px;
}

#projectsTable td>a{
  text-decoration: none;
}

#projectsTable td>a:link{
  color: #007db5;
}

#projectsTable td>a:hover{
  color: #f1593c;
}

#projectsTable tr:nth-child(odd) {
  background: #d1d8e8;
}

#projectsTable tr:nth-child(even) {
  background: #e9eef4;
}

ul {
  list-style-type: none;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}

button.page-link {
	display: inline-block !important;
}
button.page-link {
    font-size: 20px;
    color: #29b3ed;
    font-weight: 500;
}
.offset{
  width: 500px !important;
  margin: 20px auto;
}

</style>
