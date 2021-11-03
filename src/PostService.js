import axios from 'axios';

const hoqURL = 'https://hoq.tech4comp.dbis.rwth-aachen.de/api';
const reqURL = 'https://requirements-bazaar.org/bazaar';

class PostService {

  /* ReqBaz start */

  // returns a single project
  static getProject(projectId){
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(reqURL + '/projects/'+ projectId);
        const data = res.data;
        resolve(data);
      } catch (err){
        reject(err);
      }
    })
  }

  // returns all projects
  static getAllProjects(){
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(reqURL + '/projects?per_page=10000');
        const data = res.data;
        resolve(data);
      } catch (err){
        reject(err);
      }
    })
  }

  // returns all categories of a project
  static getAllCategories(projectId){
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(reqURL + '/projects/'+ projectId + '/categories?per_page=1000');
        const data = res.data;
        resolve(data);
      } catch (err){
        reject(err);
      }
    })
  }

  // returns authorized projects
  static getMyProjects(userId){
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(reqURL + '/projects?per_page=10000');
        const data = res.data;
        var myProjects = new Array();
        for(var i = 0; i < data.length; i++){
          try {
            var developers = await this.getProjectDevelopers(data[i].id);
            if(this.getElementIndexById(developers, userId) != -1){
              myProjects.push(data[i]);
            }
          } catch (e) {
            // console.log(e);
          }
        }
        resolve(myProjects);
      } catch (err){
        reject(err);
      }
    })
  }

  // returns all requirements of a category
  static getAllRequirements(categoryId){
    return new Promise(async (resolve, reject) => {
      try {
        const httpClient = axios.create();
        httpClient.defaults.timeout = 500;
        const res = await httpClient.get(reqURL + '/categories/' + categoryId + '/requirements?per_page=100&state=all');
        const data = res.data;
        resolve(data);
      } catch (err){
        reject(err);
      }
    })
  }

  // returns active user information
  static getActiveUser(user){
    return new Promise(async (resolve, reject) => {
      try {
        const httpClient = axios.create();
        // httpClient.defaults.timeout = 500;
        const res = await httpClient.get(reqURL + '/users/me', { headers: { 'access-token': user.access_token, 'Authorization': 'Basic ' + window.btoa(user.profile.preferred_username + ':' + user.profile.sub), 'oidc_provider': 'https://api.learning-layers.eu/o/oauth2', } });
        const data = res.data;
        resolve(data);
      } catch (err){
        reject(err);
      }
    })
  }

  // returns developers of a project
  static getProjectDevelopers(projectId){
    return new Promise(async (resolve, reject) => {
      try {
        const httpClient = axios.create();
        // httpClient.defaults.timeout = 500;
        const res = await httpClient.get(reqURL + '/projects/' + projectId + '/contributors');
        const data = res.data.developers;
        resolve(data);
      } catch (err){
        reject(err);
      }
    })
  }

  // returns developers of a category
  static getCategoryDevelopers(categoryId){
    return new Promise(async (resolve, reject) => {
      try {
        const httpClient = axios.create();
        // httpClient.defaults.timeout = 500;
        const res = await httpClient.get(reqURL + '/categories/' + categoryId + '/contributors');
        const data = res.data.developers;
        resolve(data);
      } catch (err){
        reject(err);
      }
    })
  }

  /* ReqBaz end */

  /* HoQ start */

  // returns all products of a diagram
  static getAllProducts(categoryId){
    return new Promise(async (resolve, reject) => {
      try {
        const httpClient = axios.create();
        httpClient.defaults.timeout = 2000;
        const res = await httpClient.get(hoqURL + '/products?categoryId=' + categoryId);
        const data = res.data;
        resolve(data);
      } catch (err){
        reject(err);
      }
    })
  }

  // edit product
  static changeProduct(product){
    return axios.put(hoqURL + '/products/', product);
  }

  // returns all specifications of a diagram
  static getAllSpecifications(categoryId){
    return new Promise(async (resolve, reject) => {
      try {
        const httpClient = axios.create();
        httpClient.defaults.timeout = 500;
        const res = await httpClient.get(hoqURL + '/tech-specifications?categoryId=' + categoryId);
        const data = res.data;
        resolve(data);
      } catch (err){
        reject(err);
      }
    })
  }

  // create a specification
  static addSpecification(specification){
    return axios.post(hoqURL + '/tech-specifications/', specification);
  }

  // edit a specification
  static changeSpecification(specification){
    return axios.put(hoqURL + '/tech-specifications/', specification);
  }

  // delete a specification
  static deleteSpecification(specification){
    return axios.delete(hoqURL + '/tech-specifications/', {data: specification});
  }

  /* HoQ end */

  // helpers
  static getElementIndexById(array, id){
    for(var i = 0; i < array.length; i++){
      if(array[i].id == id){
        return i;
      }
    }
    return -1;
  }

}

export default PostService;
