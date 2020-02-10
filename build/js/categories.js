window.onload = function() {

  // get data
  var data = getRequest('https://requirements-bazaar.org/bazaar/projects/'+ projectId + '/categories?per_page=15');
  document.getElementById("projectName").innerHTML = getProjectName(projectId);
  // append
  for(d of data){
    var creationDate = new Date(d.creationDate);
    var lastUpdatedDate = new Date(d.lastUpdatedDate);
    var shortDescription = d.description;
    var limit = 100;
    if(d.description.length > limit){
      shortDescription = d.description.substring(0, limit);
      for(var i = limit - 1; i > 50; i--){
        if(shortDescription[i] == " "){
          shortDescription = shortDescription.substring(0, i);
          break;
        }
        shortDescription = shortDescription.substring(0, i);
      }
      shortDescription = shortDescription.concat("..");
    }
    var leaderName = "Unassigned";
    if(d.leader.userName != "Unassigned"){
      leaderName = d.leader.firstName + " " + d.leader.lastName;
    }
    var active = d.numberOfRequirements == 0 ? "not-active" : "";
    element = document.createElement("tr");
    document.getElementById("projectsTable").children[0].appendChild(element);
    var created = isValidDate(creationDate) ? coolNumber(creationDate.getDate()) + "/" + coolNumber(creationDate.getMonth()) + "/" + creationDate.getFullYear() : "n/a";
    var lastUpdated = isValidDate(lastUpdatedDate) ? coolNumber(lastUpdatedDate.getDate()) + "/" + coolNumber(lastUpdatedDate.getMonth()) + "/" + lastUpdatedDate.getFullYear() : "n/a";
    element.innerHTML = "<td><a href='https://requirements-bazaar.org/projects/" + d.projectId + "/categories/" + d.id + "' target='_blank'>" + d.name + "</a></td><td title='" + d.description + "'>" + shortDescription + "</td><td>" + created + "</td><td>" + lastUpdated + "</td><td>" + d.numberOfFollowers + "</td><td>" + d.numberOfRequirements + "</td><td>" + leaderName +"</td><td><a class='" + active + "' href='/hoq?categoryId=" + d.id + "'>To House of Quality</a></td>";
  }

}

function getProjectName(projectId){
  var project = getRequest('https://requirements-bazaar.org/bazaar/projects/'+ projectId);
  if(project){
    return project.name;
  } else {
    return "There is no project with that id.";
  }
}


function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

function coolNumber(n){
  if(n < 10){
    return "0" + n;
  }
  return n;
}

function getRequest(url) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", url, false ); // false for synchronous request
  xmlHttp.send( null );
  return JSON.parse(xmlHttp.responseText);
}
