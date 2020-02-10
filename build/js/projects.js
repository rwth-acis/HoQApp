window.onload = function() {

  // get data
  var data = getRequest('https://requirements-bazaar.org/bazaar/projects?per_page=15');
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
    var following = d.following ? "Yes" : "No";
    var active = d.numberOfCategories == 0 ? "not-active" : "";
    var created = isValidDate(creationDate) ? coolNumber(creationDate.getDate()) + "/" + coolNumber(creationDate.getMonth()) + "/" + creationDate.getFullYear() : "n/a";
    var lastUpdated = isValidDate(lastUpdatedDate) ? coolNumber(lastUpdatedDate.getDate()) + "/" + coolNumber(lastUpdatedDate.getMonth()) + "/" + lastUpdatedDate.getFullYear() : "n/a";
    element = document.createElement("tr");
    document.getElementById("projectsTable").children[0].appendChild(element);
    element.innerHTML = "<td><a href='https://requirements-bazaar.org/projects/" + d.id + "' target='_blank'>" + d.name + "</a></td><td title='" + d.description + "'>" + shortDescription + "</td><td>" + d.numberOfCategories + "</td><td>" + created + "</td><td>" + lastUpdated + "</td><td>" + d.numberOfFollowers + "</td><td>" + following + "</td><td><a class='" + active + "' href='/categories?projectId=" + d.id + "'>To Categories</a></td>";
  }

}

function isValidDate(d) {
  console.log(d instanceof Date && !isNaN(d));
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
