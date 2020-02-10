var houseRoof = [];
var canvas;
var numberOfSpecifications = 0;
var firstSpecification;
var requirements;
var specifications;
var products;

window.onload = function() {

  canvas = document.getElementById('canvas');
  getSpecifications(categoryId).then(data => {
    data.json().then(specs => {
      specifications = specs;
      numberOfSpecifications = specifications.length;
      document.getElementById("categoryName").innerHTML = getCategoryName(categoryId);
      // tech. specifications (columns)
      var specParent = document.getElementById('specifications');
      for(var i = 0; i < specifications.length; i++){
        var specElement = document.createElement('td');
        specElement.className = "specification";
        specElement.id = "ts-" + specifications[i]._id;
        specElement.innerHTML = '<p class="sideway"><span><input type="text" placeholder="New Specification.." class="specInput verticalInput" spellcheck="false" value="' + specifications[i].name + '" /></span></p>';
        specParent.insertBefore(specElement, specParent.lastChild);
        var specificationInput = specElement.querySelector(".specInput");
        specificationInput.addEventListener("keyup", onEnterPressed);
        specificationInput.addEventListener("blur", onBlur);
      }
      // customer requirements (rows)
      requirements = getRequest('https://requirements-bazaar.org/bazaar/categories/' + categoryId + '/requirements?per_page=100&state=all');
      requirements.forEach(function(r, p){
        var reqElement = document.createElement('tr');
        reqElement.className = "requirement-row";
        reqElement.id = "cr-" + r.id;
        reqElement.innerHTML = '<td class="customer-requirements">' + r.name + '</td><td id="priority-' + r.id + '" class="requirement-priorities">' + (r.upVotes - r.downVotes) + '</td>';
        for(var j = 0; j < specifications.length; j++){
          reqElement.innerHTML += '<td class="relationships"></td>';
        }
        document.getElementById('houseTable').children[0].insertBefore(reqElement, document.getElementById('targets'));
      });
      // min/max, importance value, importance weight, targets
      var minMaxElement = document.getElementById('minMax');
      var targetElement = document.getElementById('targets');
      var importanceValueElement = document.getElementById('importanceValue');
      var importanceWeightElement = document.getElementById('importanceWeight');
      minMaxElement.innerHTML = '<td colspan="2" class="hidden"></td>';
      // targetElement.innerHTML = '<td colspan="2" class="hidden"></td><td colspan="2" class="hidden"></td>';
      importanceValueElement.innerHTML = '<td colspan="2" class="hidden"></td><td colspan="2" class="hidden"></td>';
      importanceWeightElement.innerHTML = '<td colspan="2" class="hidden"></td><td colspan="2" class="hidden"></td>';
      for(var i = 0; i < specifications.length; i++){
        var minMaxToAppend = document.createElement('td');
        minMaxToAppend.className = "minMaxCell";
        // minMaxElement.insertBefore(minMaxToAppend, minMaxElement.lastChild);
        minMaxElement.append(minMaxToAppend);
        minMaxToAppend.addEventListener("click", clickMinMax);
        var targetToAppend = document.createElement('td');
        targetToAppend.className = "target";
        targetToAppend.innerHTML = '<p class="sideway"><span><input type="text" placeholder="New Target.." class="targetInput verticalInput" spellcheck="false" value="' + specifications[i].target + '" /></span></p>';
        targetElement.insertBefore(targetToAppend, targetElement.lastChild);
        var targetInput = targetToAppend.querySelector(".targetInput");
        targetInput.addEventListener("keyup", targetOnEnterPressed);
        targetInput.addEventListener("blur", targetOnBlur);
        var importanceValueToAppend = document.createElement('td');
        importanceValueToAppend.className = "extra";
        importanceValueToAppend.id = "importanceValue-" + specifications[i]._id;
        importanceValueElement.insertBefore(importanceValueToAppend, importanceValueElement.lastChild);
        var importanceWeightToAppend = document.createElement('td');
        importanceWeightToAppend.className = "extra";
        importanceWeightToAppend.id = "importanceWeight-" + specifications[i]._id;
        importanceWeightElement.insertBefore(importanceWeightToAppend, importanceWeightElement.lastChild);
      }
      // set values
      for(var i = 0; i < specifications.length; i++){
        var tsCell = document.getElementById("ts-" + specifications[i]._id);
        var columnNumber = getChildIndex(tsCell) - 1; // one column before it
        var minMaxCell = document.getElementById('minMax').children[columnNumber + 1];
        setMinMax(minMaxCell, specifications[i].minMax);
        for(var j = 0; j < specifications[i].requirements.length; j++){
          var row = document.getElementById("cr-" + specifications[i].requirements[j]._id);
          var relationshipCell = row.children[columnNumber + 2];
          setRelationship(relationshipCell, specifications[i].requirements[j].value);
        }
      }
      // event listeners
      var relationships = document.getElementsByClassName('relationships');
      for(var i = 0; i < relationships.length; i++){
        relationships[i].addEventListener("click", clickRelation);
      }


      getProducts(categoryId).then(data => {
        data.json().then(p => {
          products = p;
          // add new column
          addNewColumn(true);
          calculateImportance();
          firstSpecification = document.getElementsByClassName('specification')[0];
          // product fields
          for(var i = 0; i < products.length; i++){
            var productElement = document.getElementById('product-' + (products[i].id));
            productElement.value = products[i].name;
            productElement.addEventListener("keyup", productOnEnterPressed);
            productElement.addEventListener("blur", productOnBlur);
          }
          // competitive assessment (create fields)
          for(var i = 0; i < 5; i++){
            var productName = document.createElement('td');
            productName.id = "productValue-" + (i + 1);
            productName.textContent = i + 1;
            productName.className = "product-name";
            minMaxElement.append(productName);
            productName.style.width = firstSpecification.offsetWidth + "px";
            requirementElements = document.getElementsByClassName('requirement-row');
            for(var j = 0; j < requirementElements.length; j++){
              var productValue = document.createElement('td');
              productValue.className = "product-value";
              requirementElements[j].appendChild(productValue);
              productValue.addEventListener("click", clickProductValue);
            }
          }


          // competitive assessment (set initial values)
          setProductValues();

          createCanvas();
        });
      });


    });
  });


  // event listeners


  canvas.onmousedown = function(){
    return false;
  };

  canvas.addEventListener('click', function(event) {
      var ctx = canvas.getContext('2d');
      var columnWidth = firstSpecification.offsetWidth;
      var x;
      var y;
      if (event.pageX || event.pageY) {
        x = event.pageX;
        y = event.pageY;
      }
      else {
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      // console.log(x);
      x -= (canvas.getBoundingClientRect().left + document.documentElement.scrollLeft);
      y -= (canvas.getBoundingClientRect().top + document.documentElement.scrollTop);
      // console.log(x + " " + y);
      var ctrLeft = 0;
      for(var i = 0; i < numberOfSpecifications + 1; i++){
        if(x - i * columnWidth > (canvas.height - y)){
          ctrLeft++;
        }
      }
      var ctrRight = -1;
      for(var i = 0; i < numberOfSpecifications + 1; i++){
        if(canvas.width - x - i * columnWidth > (canvas.height - y)){
          // console.log((canvas.width / 2 - x - i * columnWidth) + " " + (canvas.height - y));
          ctrRight++;
        }
      }
      var ctrRightCoordinate = numberOfSpecifications + 1 - ctrRight;
      console.log(ctrLeft, ctrRightCoordinate);
      if(ctrLeft <= numberOfSpecifications && ctrRightCoordinate <= numberOfSpecifications && ctrLeft >= 1 && ctrRightCoordinate >= 1 && ctrLeft != ctrRightCoordinate){
        var specLeft = document.getElementById('specifications').children[ctrLeft];
        var specRight = document.getElementById('specifications').children[ctrRightCoordinate];
        var newValL = 0;
        var newValR = 0;
        for(var i = 0; i < specifications.length; i++){
          if(specifications[i]._id == getIdAfterDash(specLeft.id)){
            for(var j = 0; j < specifications[i].specifications.length; j++){
              if(specifications[i].specifications[j]._id == getIdAfterDash(specRight.id)){
                specifications[i].specifications[j].value++;
                if(specifications[i].specifications[j].value > 2){
                  specifications[i].specifications[j].value = -2;
                }
                newValL = specifications[i].specifications[j].value;
                changeSpecification(specifications[i]);
              }
            }
          }
          if(specifications[i]._id == getIdAfterDash(specRight.id)){
            for(var j = 0; j < specifications[i].specifications.length; j++){
              if(specifications[i].specifications[j]._id == getIdAfterDash(specLeft.id)){
                specifications[i].specifications[j].value++;
                if(specifications[i].specifications[j].value > 2){
                  specifications[i].specifications[j].value = -2;
                }
                newValR = specifications[i].specifications[j].value;
                changeSpecification(specifications[i]);
              }
            }
          }
        }
        if(newValL != newValR){
          console.log("NEW VALUES MISMATCH");
          console.log(newValL, newValR);
        }
        // clear previous
        var x = (ctrLeft + ctrRightCoordinate - 1) * columnWidth / 2;
        var y = canvas.height - Math.abs(ctrRightCoordinate - ctrLeft) * columnWidth / 2;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2 * Math.PI, false);
        ctx.fill();
        x -= 35/2;
        y -= 35/2;
        if(newValL != 0){
          var img = new Image();
          switch(newValL){
            case 1:
              img.src = 'images/table/positive.png';
              break;
            case 2:
              img.src = 'images/table/strong-positive.png';
              break;
            case -1:
              img.src = 'images/table/negative.png';
              break;
            case -2:
              img.src = 'images/table/strong-negative.png';
              break;
            default:
              break;
          }
          img.width = '35';
          img.height = '35';
          img.onload = function(){
            ctx.drawImage(img, x, y, 35, 35);
          }
        }
        return false;
        // console.log(houseRoof);
      }
  }, false);
  // end event listeners

}

function createCanvas(){
  // TODO: KEEP VALUES
  clearCanvas();
  var ctx = canvas.getContext('2d');
  var table = document.getElementById('houseTable');

  var totalWidth = 0;
  for(var i = 0; i < numberOfSpecifications + 1; i++){
    totalWidth += firstSpecification.offsetWidth;
    if(i < numberOfSpecifications){
      houseRoof[i] = new Array(numberOfSpecifications);
    }
  }

  var viewportOffsetTD = firstSpecification.getBoundingClientRect();

  // adjust canvas
  canvas.width = totalWidth;
  canvas.height = totalWidth / 2;
  canvas.style.transform = "translateX(-" + (canvas.offsetLeft - viewportOffsetTD.left) + "px)";

  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(canvas.width / 2, 0);
  ctx.lineTo(0, canvas.height);
  ctx.fillStyle = "#f5f5f5";
  ctx.fill();
  ctx.stroke();

  var columnWidth = firstSpecification.offsetWidth;

  for(var i = 0; i < specifications.length; i++){
    ctx.beginPath();
    ctx.moveTo((i + 1) * columnWidth, canvas.height);
    ctx.lineTo(canvas.width / 2 + (columnWidth / 2) * (i + 1), 0 + (columnWidth / 2) * (i + 1));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width - (i + 1) * columnWidth, canvas.height);
    ctx.lineTo(canvas.width / 2 - (columnWidth / 2) * (i + 1), 0 + (columnWidth / 2) * (i + 1));
    ctx.stroke();
  }

  for(var i = 0; i < specifications.length; i++){
    for(var j = 0; j < specifications[i].specifications.length; j++){
      var tsIndex1 = document.getElementById('ts-' + specifications[i]._id).cellIndex;
      var tsIndex2 = document.getElementById('ts-' + specifications[i].specifications[j]._id).cellIndex;
      setInterrelationship(tsIndex1, tsIndex2, specifications[i].specifications[j].value);
    }
  }
}

function clearCanvas(){
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function addNewColumn(isFirst){
  // select <tr> elements
  var specificationElement = document.getElementById('specifications');
  var minMaxElement = document.getElementById('minMax');
  var targetElement = document.getElementById('targets');
  var requirementRows = document.getElementsByClassName('requirement-row');
  var importanceValueElement = document.getElementById('importanceValue');
  var importanceWeightElement = document.getElementById('importanceWeight');
  // finish previous column
  if(!isFirst){
    var minMaxToAppendOld = minMaxElement.children[document.getElementById('productValue-1').cellIndex - 1];
    minMaxToAppendOld.addEventListener("click", clickMinMax);
    minMaxToAppendOld.style.backgroundImage = "url('images/table/neutral.png')";
    for(var i = 0; i < requirementRows.length; i++){
      var requirementRowToAppendOld = requirementRows[i].getElementsByClassName('product-value')[0].previousSibling;
      requirementRowToAppendOld.addEventListener("click", clickRelation);
    }
    var targetToAppendOld = targetElement.lastChild.previousSibling;
    var targetInput = targetToAppendOld.querySelector(".targetInput");
    targetInput.readOnly = false;
    targetInput.addEventListener("keyup", targetOnEnterPressed);
    targetInput.addEventListener("blur", targetOnBlur);
    if(importanceValueElement.lastChild.previousSibling.textContent == 0){
      importanceWeightElement.lastChild.previousSibling.textContent = "-";
    } else {
      importanceWeightElement.lastChild.previousSibling.textContent = "0%";
    }
    importanceValueElement.lastChild.previousSibling.textContent = "0";
    importanceValueElement.lastChild.previousSibling.removeAttribute('id');
    importanceWeightElement.lastChild.previousSibling.removeAttribute('id');
  }
  specificationElement.lastChild.lastChild
  // add new column
  var specificationToAppend = document.createElement('td');
  specificationToAppend.className = "specification";
  specificationToAppend.innerHTML = `<p class="sideway"><span><input type="text" placeholder="New Specification.." class="specInput verticalInput" onfocus="this.placeholder=''" onblur="this.placeholder='New Specification..'" spellcheck="false" /></span></p>`;
  specificationElement.insertBefore(specificationToAppend, specificationElement.lastChild);
  var minMaxToAppend = document.createElement('td');
  minMaxToAppend.className = "minMaxCell";
  minMaxElement.insertBefore(minMaxToAppend, document.getElementById('productValue-1'));
  for(var i = 0; i < requirementRows.length; i++){
    var requirementRowToAppend = document.createElement('td');
    requirementRowToAppend.className = "relationships";
    requirementRows[i].insertBefore(requirementRowToAppend, requirementRows[i].getElementsByClassName('product-value')[0]);
  }
  var targetToAppend = document.createElement('td');
  targetToAppend.className = "target";
  targetToAppend.innerHTML = '<p class="sideway"><span><input type="text" placeholder="New Target.." class="targetInput verticalInput" spellcheck="false" readonly /></span></p>';
  targetElement.insertBefore(targetToAppend, targetElement.lastChild);
  var importanceValueToAppend = document.createElement('td');
  importanceValueToAppend.className = "extra";
  importanceValueToAppend.id = "importanceValueTotal";
  importanceValueElement.insertBefore(importanceValueToAppend, importanceValueElement.lastChild);
  var importanceWeightToAppend = document.createElement('td');
  importanceWeightToAppend.id = "importanceWeightTotal";
  importanceWeightElement.insertBefore(importanceWeightToAppend, importanceWeightElement.lastChild);
  importanceWeightToAppend.className = "extra";
  // listeners
  var specificationInput = specificationToAppend.querySelector(".specInput");
  specificationInput.addEventListener("keyup", onEnterPressedNew);
  specificationInput.addEventListener("blur", onBlurNew);
}

function productOnEnterPressed(event){
  if(event.keyCode == 13){
    this.blur();
  }
}

function productOnBlur(){
  for(var i = 0; i < products.length; i++){
    if(products[i].id == getIdAfterDash(this.id)){
      products[i].name = this.value;
      if(this.value == ""){
        console.log("empty");
        for(var j = 0; j < products[i].requirements.length; j++){
          products[i].requirements[j].value = 0;
        }
      }
      changeProduct(products[i]).then(function(){
        getProducts(categoryId).then(data => {
          data.json().then(p => {
            products = p;
            console.log(products);
            setProductValues();
          });
        });
      });
      break;
    }
  }
}

function targetOnEnterPressed(event){
  if(event.keyCode == 13){
    this.blur();
  }
}

function targetOnBlur(){
  tsIndex = this.closest('td').cellIndex;
  tsId = getIdAfterDash(document.getElementById('specifications').children[tsIndex].id);
  for(var i = 0; i < specifications.length; i++){
    if(specifications[i]._id == tsId){
      specifications[i].target = this.value;
      changeSpecification(specifications[i]);
      break;
    }
  }
}

function onEnterPressedNew(event){
  if(event.keyCode == 13){
    // TODO:
    if(this.value != ""){
      this.blur();
    }
  }
}

function onBlurNew(){
  // TODO:
  if(this.value != ""){
    addNewColumn(false);
    addSpecification({"name": this.value, "categoryId": categoryId}, this.closest('td'));
    numberOfSpecifications++;
    this.removeEventListener("keyup", onEnterPressedNew);
    this.removeEventListener("blur", onBlurNew);
    this.addEventListener("keyup", onEnterPressed);
    this.addEventListener("blur", onBlur);
  }
}

function onEnterPressed(event){
  if(event.keyCode == 13){
    this.blur();
  }
}

function onBlur(){
  if(this.value != ""){
    // save column
    var specification;
    for(var i = 0; i < specifications.length; i++){
      if(specifications[i]._id == getIdAfterDash(this.closest('td').id)){
        specifications[i].name = this.value;
        specification = specifications[i];
      }
    }
    changeSpecification(specification);
  } else {
    deleteColumn(this);
  }
}

function deleteColumn(input){
  if(confirm('Are you sure you want to delete this technical specification?')){
    var specification = input.closest('td');
    var index = getChildIndex(specification);
    if(specification == firstSpecification){
      firstSpecification = specification.nextSibling;
    }
    specification.remove();
    document.getElementById('minMax').children[index].remove();
    var requirementRows = document.getElementsByClassName('requirement-row');
    Array.from(requirementRows).forEach(row => {
      row.children[index + 1].remove();
    });
    document.getElementById('targets').children[index].remove();
    document.getElementById('importanceValue').children[index].remove();
    document.getElementById('importanceWeight').children[index].remove();
    numberOfSpecifications--;
    deleteSpecification({"_id": getIdAfterDash(input.closest('td').id), "name": this.value, "categoryId": categoryId});
    // TODO: DELETE FROM DATABASE
  } else {
    // TODO: OLD VALUE
  }
}

function clickRelation(){
  var rowIndex = this.parentElement.rowIndex;
  var cellIndex = this.cellIndex;
  outerloop:
  for(var i = 0; i < specifications.length; i++){
    if(specifications[i]._id == getIdAfterDash(document.getElementById('specifications').children[cellIndex - 1].id)){
      for(var j = 0; j < specifications[i].requirements.length; j++){
        if(specifications[i].requirements[j]._id == getIdAfterDash(this.parentNode.id)){
          var newVal = 0;
          switch(specifications[i].requirements[j].value){
            case 0:
              newVal = 1;
              break;
            case 1:
              newVal = 3;
              break;
            case 3:
              newVal = 9;
              break;
            case 9:
              newVal = 0;
              break;
            default:
              newVal = 0;
              break;
          }
          specifications[i].requirements[j].value = newVal;
          setRelationship(this, newVal);
          calculateImportance();
          changeSpecification(specifications[i]);
          break outerloop;
        }
      }
    }
  }
}

function clickMinMax(){
  var cellIndex = this.cellIndex;
  outerloop:
  for(var i = 0; i < specifications.length; i++){
    if(specifications[i]._id == getIdAfterDash(document.getElementById('specifications').children[cellIndex].id)){
      var newVal = 0;
      switch(specifications[i].minMax){
        case 0:
          newVal = 1;
          break;
        case 1:
          newVal = -1;
          break;
        case -1:
          newVal = 0;
          break;
        default:
          newVal = 0;
          break;
      }
      specifications[i].minMax = newVal;
      setMinMax(this, newVal);
      changeSpecification(specifications[i]);
      break outerloop;
    }
  }
}

function clickProductValue(){
  var cellIndex = this.cellIndex;
  var crId = getIdAfterDash(this.parentNode.id);
  var value = cellIndex - specifications.length - 1;
  var newId = 0;

  outerloop:
  for(var i = 0; i < products.length; i++){
    for(var j = 0; j < products[i].requirements.length; j++){
      if(products[i].requirements[j]._id == crId && products[i].requirements[j].value == value){
        products[i].requirements[j].value = 0;
        this.textContent = "";
        var oldId = products[i].id;
        newId = products[i].id + 1;
        changeProduct(products[i]);
        break outerloop;
      }
    }
  }

  outerloop4:
  while(true){
    if(newId > 4){
      newId = -1;
      break;
    }
    outerloop3:
    for(var s = 0; s < products.length; s++){
      if(products[s].id == newId){
        for(var t = 0; t < products[s].requirements.length; t++){
          if(products[s].requirements[t]._id == crId && products[s].requirements[t].value != 0 || products[s].name == ""){
            newId++;
            break outerloop3;
          }
        }
        break outerloop4;
      }
    }
  }

  if(newId != -1){
    outerloop2:
    for(var i = 0; i < products.length; i++){
      if(products[i].id == newId){
        for(var j = 0; j < products[i].requirements.length; j++){
          if(products[i].requirements[j]._id == crId){
            products[i].requirements[j].value = value;
            this.textContent = products[i].abbreviation;
            if(products[i].id == 0){
              this.style.color = "red";
            } else {
              this.style.color = "black";
            }
          }
        }
        changeProduct(products[i]);
        break outerloop2;
      }
    }
  }


}

function getCategoryName(categoryId){
  var category = getRequest('https://requirements-bazaar.org/bazaar/categories/'+ categoryId);
  if(category){
    return category.name;
  } else {
    return "There is no category with that id.";
  }
}


// helpers

function setProductValues(){

  // empty out the table
  var requirementRows = document.getElementsByClassName('requirement-row');
  for(var i = 0; i < requirementRows.length; i++) {
    for(var j = 1; j <= 5; j++){
      if(requirementRows[i].children[requirementRows.length - j]){
        requirementRows[i].children[requirementRows.length - j].textContent = "";
      }
    }
  }
  // set the actual values
  for(var i = 0; i < products.length; i++){
    for(var j = 0; j < products[i].requirements.length; j++){
      if(products[i].requirements[j].value != 0){
        var requirementRow = document.getElementById('cr-' + products[i].requirements[j]._id);
        requirementRow.children[numberOfSpecifications + 1 + products[i].requirements[j].value].textContent = products[i].abbreviation;
        if(products[i].id == 0){
          requirementRow.children[numberOfSpecifications + 1 + products[i].requirements[j].value].style.color = "red";
        } else {
          requirementRow.children[numberOfSpecifications + 1 + products[i].requirements[j].value].style.color = "black";
        }
      }
    }
  }
}

function setRelationship(cell, value){
  // TODO: IF NO CELL SYNC DB
  switch(value){
    case 0:
      cell.style.backgroundImage = "none";
      break;
    case 1:
      cell.style.backgroundImage = "url('images/table/weak.png')";
      break;
    case 3:
      cell.style.backgroundImage = "url('images/table/fair.png')";
      break;
    case 9:
      cell.style.backgroundImage = "url('images/table/strong.png')";
      break;
    default:
      cell.style.backgroundImage = "none";
      break;
  }
}

function setMinMax(cell, value){
  switch(value){
    case 1:
      cell.style.backgroundImage = "url('images/table/arrow-up.png')";
      break;
    case -1:
      cell.style.backgroundImage = "url('images/table/arrow-down.png')";
      break;
    case 0:
      cell.style.backgroundImage = "url('images/table/neutral.png')";
      break;
    default:
      cell.style.backgroundImage = 'none';
      break;
  }
}

function setInterrelationship(tsIndex1, tsIndex2, value){
  if(tsIndex1 == tsIndex2){
    return;
  }
  var columnWidth = firstSpecification.offsetWidth;
  var ctx = canvas.getContext('2d');
  var x = (tsIndex2 + tsIndex1 - 1) * columnWidth / 2;
  var y = canvas.height - Math.abs(tsIndex2 - tsIndex1) * columnWidth / 2;
  // clear previous
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, 2 * Math.PI, false);
  ctx.fill();
  x -= 35/2;
  y -= 35/2;
  switch(value){
    case -2:
      // TODO: CHANGE VALUE
      var img = new Image();
      img.src = 'images/table/strong-negative.png';
      img.width = '35';
      img.height = '35';
      img.onload = function() {
        ctx.drawImage(img, x, y, 35, 35);
      };
      break;
    case -1:
      // TODO: CHANGE VALUE
      var img = new Image();
      img.src = 'images/table/negative.png';
      img.width = '35';
      img.height = '35';
      img.onload = function() {
        ctx.drawImage(img, x, y, 35, 35);
      };
      break;
    case 0:
      // TODO: CHANGE VALUE
      break;
    case 1:
      // TODO: CHANGE VALUE
      var img = new Image();
      img.src = 'images/table/positive.png';
      img.width = '35';
      img.height = '35';
      img.onload = function() {
        ctx.drawImage(img, x, y, 35, 35);
      };
      break;
    case 2:
      // TODO: CHANGE VALUE
      var img = new Image();
      img.src = 'images/table/strong-positive.png';
      img.width = '35';
      img.height = '35';
      img.onload = function() {
        ctx.drawImage(img, x, y, 35, 35);
      };
      break;
  }
}

function calculateImportance(){
  var totalImportance = 0;
  for(var i = 0; i < specifications.length; i++){
    var importance = 0;
    var tsId = specifications[i]._id;
    var tsCellIndex = document.getElementById("ts-" + tsId).cellIndex;
    for(var j = 0; j < specifications[i].requirements.length; j++){
      var crId = specifications[i].requirements[j]._id;
      // TODO: SHOULD BE VALUE NOT TEXTCONTENT
      var priority = document.getElementById('priority-' + crId).textContent;
      importance += specifications[i].requirements[j].value * priority;
    }
    totalImportance += importance;
    document.getElementById('importanceValue').children[tsCellIndex].textContent = importance;
  }

  for(var i = 0; i < specifications.length; i++){
    // TODO: SHOULD BE VALUE NOT TEXTCONTENT
    var tsCellIndex = document.getElementById("ts-" + tsId).cellIndex;
    var tsId = getIdAfterDash(specifications[i]._id);
    var importance = document.getElementById('importanceValue').children[tsCellIndex].textContent;
    document.getElementById('importanceWeight').children[tsCellIndex].textContent = coolRounder(importance * 100 / totalImportance);
  }

  document.getElementById('importanceValueTotal').textContent = totalImportance;
  document.getElementById('importanceWeightTotal').textContent = "100%";

}

function coolRounder(x){
  var res = Math.round(x * 100) / 100;
  if(isNaN(res)){
    return "-";
  }
  return Math.round(x * 100) / 100 + "%";
}

function getRequest(url) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", url, false ); // false for synchronous request
  xmlHttp.send( null );
  return JSON.parse(xmlHttp.responseText);
}

function getChildIndex(element){
  var i = 0;
  while((element = element.previousSibling) != null){
    i++;
  }
  return i;
}

function getIdAfterDash(str){
  return str.substring(str.lastIndexOf('-') + 1);
}

// end helpers

// Network functions

function getSpecifications(categoryId) {
  return fetch('api/tech-specifications?categoryId=' + categoryId).then(response => {
    return response;
    if (!response.ok) {
      throw Error(response.statusText);
    }
    respons.json().then(data => {
      return data;
    });
  });
}

function getProducts(categoryId) {
  return fetch('api/products?categoryId=' + categoryId).then(response => {
    return response;
    if (!response.ok) {
      throw Error(response.statusText);
    }
    respons.json().then(data => {
      return data;
    });
  });
}

function updateSpecifications(){
  getSpecifications(categoryId).then(data => {
    data.json().then(specs => {
      specifications = specs;
    });
  });
}

function addSpecification(specification, td){
  const headers = new Headers({'Content-Type': 'application/json'});
  specification.minMax = 0;
  specification.target = "";
  specification.requirements = new Array();
  specification.specifications = new Array();
  // new ts relationships
  for(var i = 0; i < requirements.length; i++){
    specification.requirements.push({"_id": requirements[i].id, "value": 0});
  }
  // new ts specifications
  for(var i = 0; i < specifications.length; i++){
    specification.specifications.push({"_id": specifications[i]._id, "value": 0});
  }
  var body = JSON.stringify(specification);
  fetch('api/tech-specifications', {
    method: 'POST',
    headers: headers,
    body: body
  }).then(data => {
    data.json().then(_id => {
      specification._id = _id;
      specifications.push(specification);
      td.id = 'ts-' + _id;
      getSpecifications(categoryId).then(data => {
        data.json().then(specs => {
          specifications = specs;
          createCanvas();
          calculateImportance();
        });
      });
    })
  });
}

function changeProduct(product){
  const headers = new Headers({'Content-Type': 'application/json'});
  const body = JSON.stringify(product);
  return fetch('api/products', {
    method: 'PUT',
    headers: headers,
    body: body
  });
}

function changeSpecification(specification){
  const headers = new Headers({'Content-Type': 'application/json'});
  const body = JSON.stringify(specification);
  return fetch('api/tech-specifications', {
    method: 'PUT',
    headers: headers,
    body: body
  });
}

function deleteSpecification(specification){
  // remove from specifications
  for(var i = 0; i < specifications.length; i++){
    var index = -1;
    if(specifications[i]._id == specification._id){
      index = i;
    }
  }
  if(index > -1){
    specifications.splice(index, 1);
  }
  const headers = new Headers({'Content-Type': 'application/json'});
  const body = JSON.stringify(specification);
  fetch('api/tech-specifications', {
    method: 'DELETE',
    headers: headers,
    body: body
  }).then( function() {
    getSpecifications(categoryId).then(data => {
      data.json().then(specs => {
        specifications = specs;
        createCanvas();
        calculateImportance();
      });
    });
  });
}
