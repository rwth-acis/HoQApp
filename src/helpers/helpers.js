export default {
  // rounds a number to the 2nd decimal point
  coolRounder: function(x){
    var res = Math.round(x * 100) / 100;
    if(isNaN(res)){
      return "-";
    }
    return Math.round(x * 100) / 100 + "%";
  },
  // checks if it's a valid date
  isValidDate: function (d){
    return d instanceof Date && !isNaN(d);
  },
  // adds 0 if it's a single digit (1-9)
  coolNumber: function (n){
    if(n < 10){
      return "0" + n;
    }
    return n;
  },
  // returns string after last "-"
  getIdAfterDash: function(str){
    return str.substring(str.lastIndexOf('-') + 1);
  },
  // returns the child index of an HTML element
  getChildIndex: function(element){
    var i = 0;
    while((element = element.previousElementSibling) != null){
      i++;
    }
    return i;
  },
  // checks if an element is in an array depending on its id
  isInArrayById: function(id, array){
    for(var i = 0; i < array.length; i++){
      if(array[i].id == id){
        return true;
      }
    }
    return false;
  },
  // check if an element is in an array depending on its _id
  isInArrayBy_Id: function(_id, array){
    for(var i = 0; i < array.length; i++){
      if(array[i]._id == _id){
        return true;
      }
    }
    return false;
  }
}
