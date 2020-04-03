export default {
    coolRounder: function(x){
      var res = Math.round(x * 100) / 100;
      if(isNaN(res)){
        return "-";
      }
      return Math.round(x * 100) / 100 + "%";
    },
    isValidDate: function (d){
      return d instanceof Date && !isNaN(d);
    },
    coolNumber: function (n){
      if(n < 10){
        return "0" + n;
      }
      return n;
    },
    getIdAfterDash: function(str){
      return str.substring(str.lastIndexOf('-') + 1);
    },
    getChildIndex: function(element){
      var i = 0;
      while((element = element.previousElementSibling) != null){
        i++;
      }
      return i;
    },
    isInArrayById: function(id, array){
      for(var i = 0; i < array.length; i++){
        if(array[i].id == id){
          return true;
        }
      }
      return false;
    },
    isInArrayBy_Id: function(_id, array){
      for(var i = 0; i < array.length; i++){
        if(array[i]._id == _id){
          return true;
        }
      }
      return false;
    }
}
