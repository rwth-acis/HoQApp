<template>
  <div>
    <h2> {{ categoryName }} </h2>
    <p id="alertBox">{{ error }}</p>
    <canvas id="canvas" width='800' height='600' v-on:click="clickCanvas"></canvas>
    <table id="houseTable">
        <!-- specifications -->
        <tr id="specifications">
          <td class="controlPanel" colspan='2'>
            <h1 style="margin:0px 0px 20px 0px">Legend</h1>
            <div style="width:160px;display:inline-block;vertical-align:top">
              <h3 style="margin:0;min-height:45px">Interrelationships matrix</h3>
              <div style="text-align:center">
                <div style="display:inline-block;width:40px;height:40px;align:center;vertical-align:middle"><img src="../assets/table/strong-positive.png" width="40" height="40"/></div>
                <div style="display:inline-block;width:120px;vertical-align: middle">Strong positive</div>
              </div>
              <div style="text-align:center">
                <div style="display:inline-block;width:40px;height:40px;align:center;vertical-align:middle"><img src="../assets/table/positive.png" width="40" height="40"/></div>
                <div style="display:inline-block;width:120px;vertical-align: middle">Positive</div>
              </div>
              <div style="text-align:center">
                <div style="display:inline-block;width:40px;height:40px;align:center;vertical-align:middle"><img src="../assets/table/strong-negative.png" width="40" height="40"/></div>
                <div style="display:inline-block;width:120px;vertical-align: middle">Strong negative</div>
              </div>
              <div style="text-align:center">
                <div style="display:inline-block;width:40px;height:40px;align:center;vertical-align:middle"><img src="../assets/table/negative.png" width="40" height="40"/></div>
                <div style="display:inline-block;width:120px;vertical-align: middle">Negative</div>
              </div>
            </div>
            <div style="width:160px;display:inline-block;vertical-align:top">
              <h3 style="margin:0;min-height:45px">Relationships matrix</h3>
              <div style="text-align:center">
                <div style="display:inline-block;width:40px;height:40px;align:center;vertical-align:middle"><img src="../assets/table/strong.png" width="40" height="40"/></div>
                <div style="display:inline-block;width:120px;vertical-align: middle">Strong(9)</div>
              </div>
              <div style="text-align:center">
                <div style="display:inline-block;width:40px;height:40px;align:center;vertical-align:middle"><img src="../assets/table/fair.png" width="40" height="40"/></div>
                <div style="display:inline-block;width:120px;vertical-align: middle">Fair(3)</div>
              </div>
              <div style="text-align:center">
                <div style="display:inline-block;width:40px;height:40px;align:center;vertical-align:middle"><img src="../assets/table/weak.png" width="40" height="40"/></div>
                <div style="display:inline-block;width:120px;vertical-align: middle">Weak(1)</div>
              </div>
            </div>
            <div style="width:160px;display:inline-block;vertical-align:top">
              <h3 style="margin:0;min-height:45px">Min/Max</h3>
              <div style="text-align:center">
                <div style="display:inline-block;width:40px;height:40px;align:center;vertical-align:middle"><img src="../assets/table/neutral.png" width="40" height="40"/></div>
                <div style="display:inline-block;width:120px;vertical-align: middle">Neutral</div>
              </div>
              <div style="text-align:center">
                <div style="display:inline-block;width:40px;height:40px;align:center;vertical-align:middle"><img src="../assets/table/arrow-up.png" width="40" height="40"/></div>
                <div style="display:inline-block;width:120px;vertical-align: middle">Maximize</div>
              </div>
              <div style="text-align:center">
                <div style="display:inline-block;width:40px;height:40px;align:center;vertical-align:middle"><img src="../assets/table/arrow-down.png" width="40" height="40"/></div>
                <div style="display:inline-block;width:120px;vertical-align: middle">Minimize</div>
              </div>
            </div>
          </td>
          <td v-for="(specification, index) in specifications" :id="'ts-' + specification._id" class="specification">
            <p class="sideway"><span>
              <input type="text" placeholder="New Specification.." class="specInput verticalInput" spellcheck="false" :value="specification.name" v-on:blur="changeSpecificationName" v-on:keyup="blurIfEnter" v-if="authorized" />
              <input type="text" placeholder="New Specification.." class="specInput verticalInput" spellcheck="false" :value="specification.name" v-on:blur="changeSpecificationName" v-on:keyup="blurIfEnter" v-else readonly />
            </span></p>
          </td>
          <td class="specification">
            <p class="sideway"><span>
              <input type="text" placeholder="New Specification.." class="specInput verticalInput" spellcheck="false" v-on:blur="addNewColumn" v-on:keyup="blurIfEnter" v-if="authorized" />
              <input type="text" placeholder="New Specification.." class="specInput verticalInput" spellcheck="false" v-on:blur="addNewColumn" v-on:keyup="blurIfEnter" v-else readonly />
            </span></p>
          </td>
          <td class="controlPanel" colspan='5'>
            <div v-if="authorized">
              <input v-for="(product, index) in products" :id="'product-' + product.id" v-on:keyup="blurIfEnter" v-on:blur="changeProduct" type="text" :placeholder="'Product ' + (index + 1)" v-bind:value="product.name" />
            </div>
            <div v-else>
              <input v-for="(product, index) in products" :id="'product-' + product.id" v-on:keyup="blurIfEnter" v-on:blur="changeProduct" type="text" :placeholder="'Product ' + (index + 1)" v-bind:value="product.name" readonly />
            </div>
          </td>
        </tr>
        <!-- minMax -->
        <tr id="minMax">
          <td class="hidden" colspan='2'></td>
          <td v-for="(specification, index) in specifications" :class="'minMaxCell ' + getMinMaxClassFromValue(specification.minMax)" v-on:click="clickMinMax"></td>
          <td class="minMaxCell"></td>
          <td id="productValue-1" class="product-name">1</td>
          <td id="productValue-2" class="product-name">2</td>
          <td id="productValue-3" class="product-name">3</td>
          <td id="productValue-4" class="product-name">4</td>
          <td id="productValue-5" class="product-name">5</td>
        </tr>
        <!-- relationships -->
        <tr v-for="(requirement, indexR) in requirements" :id="'cr-' + requirement.id" class="requirement-row">
          <td class="customer-requirement">{{ requirement.name }}</td>
          <td :id="'priority-' + requirement.id" class="requirement-priorities">{{ (requirement.upVotes - requirement.downVotes) }}</td>
          <td v-for="(specification, indexS) in specifications" :class="'relationships ' + getRelClass(specification, requirement)" v-on:click="clickRelation"></td>
          <td class="relationships"></td>
          <td v-for="i in 5" class="product-value" v-on:click="clickProductValue">{{ getProductAbbreviation(requirement.id, i) }}</td>
        </tr>
        <!-- targets -->
        <tr id="targets">
          <td class="hidden" colspan='2'></td>
          <td v-for="(specification, index) in specifications" class="target">
            <p class="sideway"><span>
              <input type="text" placeholder="New Target.." class="targetInput verticalInput" spellcheck="false" :value="specification.target" v-on:blur="changeTargetName" v-on:keyup="blurIfEnter" v-if="authorized" />
              <input type="text" placeholder="New Target.." class="targetInput verticalInput" spellcheck="false" :value="specification.target" v-on:blur="changeTargetName" v-on:keyup="blurIfEnter" v-else readonly />
            </span></p>
          </td>
          <td class="target">
            <p class="sideway"><span><input type="text" placeholder="New Target.." class="targetInput verticalInput" spellcheck="false" readonly /></span></p>
          </td>
          <td class="hidden" colspan='5'></td>
        </tr>
        <!-- importanceValues -->
        <tr id="importanceValue">
          <td class="hidden" colspan='2'></td>
          <td v-for="(specification, index) in specifications" :id="'importanceValue-' + specification._id" class="extra"></td>
          <td id="importanceValueTotal" class="extra"></td>
          <td class="hidden" colspan='5'>Total Importance Value</td>
        </tr>
        <!-- importanceWeights -->
        <tr id="importanceWeight">
          <td class="hidden" colspan='2'></td>
          <td v-for="(specification, index) in specifications" :id="'importanceWeight-' + specification._id" class="extra"></td>
          <td id="importanceWeightTotal" class="extra"></td>
          <td class="hidden" colspan='5'>Total Importance Weight</td>
        </tr>
    </table>
  </div>
</template>

<script>

import PostService from '../PostService'
import helpers from '../helpers/helpers.js'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { WebsocketProvider } from 'y-websocket'
export default {
  name: 'ProjectsComponent',
  data () {
    return {
      categoryName: '',
      error: '',
      authorized: false,
      activeUser: null,
      developers: [],
      yMap: null,
      idb: null,
      provider: null,
      requirements: [],
      specifications: [],
      products: [],
      canvas: null,
      categoryId: '',
      needsUpdate: true,
      interval: null
    }
  },
  async created () {
  },
  async mounted(){
    document.title = "House of Quality";
    this.categoryId = this.$route.params.categoryId;
    this.canvas = document.getElementById("canvas");
    // prevents text selection
    this.canvas.onmousedown = function(){
      return false;
    };
    // get indexedDB
    this.idb = await this.getDb();
    // ACTIVE USER
    if(this.$oidc.isAuthenticated){
      try {
        this.activeUser = await PostService.getActiveUser(this.$oidc.user);
        this.developers = await PostService.getCategoryDevelopers(this.categoryId);
        if(this.activeUser && this.developers){
          this.authorized = !(this.getElementIndexById(this.developers, this.activeUser.id) == -1);
          if(this.authorized){
            this.saveAuthorizedCategoryLocally();
          }
        }
      } catch (err) {
        var authorizedCategories = await this.getAuthorizedCategoryLocally();
        authorizedCategories.forEach(authCat => {
          if(authCat == this.categoryId){
            this.authorized = true;
          }
        });
      }
    }
    this.categoryName = await this.getCategoryNameLocally();
    // REQUIREMENTS
    try {
      this.requirements = await PostService.getAllRequirements(this.categoryId);
      this.saveRequirementsLocally();
      console.log(this.requirements);
    } catch (err) {
      this.requirements = await this.getRequirementsLocally();
    }
    if(this.requirements.length == 0){
      this.$router.push('/my-projects');
    }
    // SPEICIFICATIONS
    try {
      this.specifications = await PostService.getAllSpecifications(this.categoryId);
      this.saveSpecificationsLocally();
    } catch (err){
      this.specifications = await this.getSpecificationsLocally();
    }
    // PRODUCTS
    try {
      this.products = await PostService.getAllProducts(this.categoryId);
      this.saveProductsLocally();
    } catch (err){
      this.products = await this.getProductsLocally();
    }
    this.requirements.sort(function(a, b){
      if(a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
      if(a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
      return 0;
    });
    this.specifications.sort(function(a, b){
      return new Date(a.created) - new Date(b.created);
    });
    this.products.sort(function(a, b){
      if(a.id < b.id) { return -1; }
      if(a.id > b.id) { return 1; }
      return 0;
    });
    const ydoc = new Y.Doc();
    this.provider = new WebrtcProvider('hoq-' + this.categoryId, ydoc, { signaling: ['wss://demos.yjs.dev'] });
    // this.provider = new WebsocketProvider('wss://demos.yjs.dev', 'my-roomname', ydoc);
    this.provider.on('status', event => {
      // connected
    })
    this.yMap = ydoc.getMap('map');
    this.yMap.observe(this.yOnChange);
    this.calculateImportance();
    this.createCanvas();
    window.addEventListener("resize", this.createCanvas);
    this.interval = window.setInterval(this.checkRequirements, 60000);
  },
  updated(){
    this.calculateImportance();
    if(this.canvas && this.needsUpdate){
      this.createCanvas();
      // this.needsUpdate = false;
    }
  },
  beforeDestroy(){
    window.removeEventListener("resize", this.createCanvas);
    clearInterval(this.interval);
    if(this.provider){
      this.provider.destroy();
    }
  },
  destoryed(){
  },
  methods:{
    getMinMaxClassFromValue: function(value){
      switch (value) {
        case 1:
          return "minMaxUp";
        case -1:
          return "minMaxDown";
        case 0:
          return "minMaxNeutral";
        default:
          return "";
      }
    },
    getRelClass: function(specification, requirement){
      var index = this.getElementIndexBy_Id(specification.requirements, requirement.id);
      if(!specification.requirements[index]){
        return "";
      }
      return this.getRelClassFromValue(specification.requirements[index].value);
    },
    getRelClassFromValue: function(value){
      switch (value) {
        case 0:
          return "";
        case 1:
          return "relWeak";
        case 3:
          return "relFair";
        case 9:
          return "relStrong";
        default:
          return "";
      }
    },
    getElementIndexById: function(array, id){
      for(var i = 0; i < array.length; i++){
        if(array[i].id == id){
          return i;
        }
      }
      return -1;
    },
    getElementIndexBy_Id: function(array, id){
      for(var i = 0; i < array.length; i++){
        if(array[i]._id == id){
          return i;
        }
      }
      return -1;
    },
    calculateImportance: function(){
      var totalImportance = 0;
      for(var i = 0; i < this.specifications.length; i++){
        var importance = 0;
        var tsId = this.specifications[i]._id;
        if(!document.getElementById("ts-" + tsId)){
          continue;
        }
        var tsCellIndex = document.getElementById("ts-" + tsId).cellIndex;
        for(var j = 0; j < this.specifications[i].requirements.length; j++){
          var crId = this.specifications[i].requirements[j]._id;
          if(document.getElementById('priority-' + crId)){
            var priority = document.getElementById('priority-' + crId).textContent;
            importance += this.specifications[i].requirements[j].value * priority;
          }
        }
        totalImportance += importance;
        document.getElementById('importanceValue').children[tsCellIndex].textContent = importance;
      }

      for(var i = 0; i < this.specifications.length; i++){
        // TODO: SHOULD BE VALUE NOT TEXTCONTENT
        var tsId = this.specifications[i]._id;
        var tsCellIndex = document.getElementById("ts-" + tsId).cellIndex;
        if(!document.getElementById("ts-" + tsId)){
          continue;
        }
        var importance = document.getElementById('importanceValue').children[tsCellIndex].textContent;
        document.getElementById('importanceWeight').children[tsCellIndex].textContent = helpers.coolRounder(importance * 100 / totalImportance);
      }

      if(document.getElementById('importanceValueTotal') && document.getElementById('importanceWeightTotal')){
        document.getElementById('importanceValueTotal').textContent = totalImportance;
        document.getElementById('importanceWeightTotal').textContent = "100%";
      }
    },
    clearCanvas: function(){
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    createCanvas: function(){
      // TODO: KEEP VALUES
      this.clearCanvas();
      var ctx = this.canvas.getContext('2d');
      if(!document.getElementById('specifications')){
        return;
      }
      var firstSpecification = document.getElementById('specifications').children[1];

      var totalWidth = 0;
      for(var i = 0; i < this.specifications.length + 1; i++){
        totalWidth += firstSpecification.offsetWidth;
      }

      var viewportOffsetTD = firstSpecification.getBoundingClientRect();

      // adjust canvas
      this.canvas.width = totalWidth;
      this.canvas.height = totalWidth / 2;
      this.canvas.style.transform = "translateX(-" + (this.canvas.offsetLeft - viewportOffsetTD.left) + "px)";

      ctx.beginPath();
      ctx.moveTo(0, this.canvas.height);
      ctx.lineTo(this.canvas.width, this.canvas.height);
      ctx.lineTo(this.canvas.width / 2, 0);
      ctx.lineTo(0, this.canvas.height);
      ctx.fillStyle = "#f5f5f5";
      ctx.fill();
      ctx.stroke();

      var columnWidth = firstSpecification.offsetWidth;

      for(var i = 0; i < this.specifications.length; i++){
        ctx.beginPath();
        ctx.moveTo((i + 1) * columnWidth, this.canvas.height);
        ctx.lineTo(this.canvas.width / 2 + (columnWidth / 2) * (i + 1), 0 + (columnWidth / 2) * (i + 1));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.canvas.width - (i + 1) * columnWidth, this.canvas.height);
        ctx.lineTo(this.canvas.width / 2 - (columnWidth / 2) * (i + 1), 0 + (columnWidth / 2) * (i + 1));
        ctx.stroke();
      }

      for(var i = 0; i < this.specifications.length; i++){
        for(var j = 0; j < this.specifications[i].specifications.length; j++){
          if(document.getElementById('ts-' + this.specifications[i]._id) && document.getElementById('ts-' + this.specifications[i].specifications[j]._id)){
            var tsIndex1 = document.getElementById('ts-' + this.specifications[i]._id).cellIndex; // changeToDate
            var tsIndex2 = document.getElementById('ts-' + this.specifications[i].specifications[j]._id).cellIndex; // changeToDate
            this.setInterrelationship(tsIndex1, tsIndex2, this.specifications[i].specifications[j].value);
          }
        }
      }
    },
    setInterrelationship: function(tsIndex1, tsIndex2, value){
      if(tsIndex1 == tsIndex2){
        return;
      }
      var firstSpecification = document.getElementById('specifications').children[1];
      var columnWidth = firstSpecification.offsetWidth;
      var ctx = this.canvas.getContext('2d');
      var x = (tsIndex2 + tsIndex1 - 1) * columnWidth / 2;
      var y = this.canvas.height - Math.abs(tsIndex2 - tsIndex1) * columnWidth / 2;
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
          img.src = require('../assets/table/strong-negative.png');
          img.height = '35';
          img.onload = function() {
            ctx.drawImage(img, x, y, 35, 35);
          };
          break;
        case -1:
          // TODO: CHANGE VALUE
          var img = new Image();
          img.src = require('../assets/table/negative.png');
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
          img.src = require('../assets/table/positive.png');
          img.width = '35';
          img.height = '35';
          img.onload = function() {
            ctx.drawImage(img, x, y, 35, 35);
          };
          break;
        case 2:
          // TODO: CHANGE VALUE
          var img = new Image();
          img.src = require('../assets/table/strong-positive.png');
          img.width = '35';
          img.height = '35';
          img.onload = function() {
            ctx.drawImage(img, x, y, 35, 35);
          };
          break;
      }
    },
    clickMinMax: function(e){
      if(!this.authorized){
        this.authAlert();
        return;
      }
      var cellIndex = e.target.cellIndex;
      outerloop:
      for(var i = 0; i < this.specifications.length; i++){
        if(this.specifications[i]._id == helpers.getIdAfterDash(document.getElementById('specifications').children[cellIndex].id)){
          var newVal = 0;
          switch(this.specifications[i].minMax){
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
          this.specifications[i].minMax = newVal;
          this.setMinMax(e.target, newVal);
          this.saveSpecificationsLocally();
          PostService.changeSpecification(this.specifications[i]);
          this.yChangeSpecifications();
          break outerloop;
        }
      }
    },
    setMinMax: function(cell, value){
      cell.classList.remove("minMaxUp");
      cell.classList.remove("minMaxDown");
      cell.classList.remove("minMaxNeutral");
      cell.classList.add(this.getMinMaxClassFromValue(value));
    },
    clickRelation: function(e){
      if(!this.authorized){
        this.authAlert();
        return;
      }
      var rowIndex = e.target.parentElement.rowIndex;
      var cellIndex = e.target.cellIndex;
      outerloop:
      for(var i = 0; i < this.specifications.length; i++){
        if(this.specifications[i]._id == helpers.getIdAfterDash(document.getElementById('specifications').children[cellIndex - 1].id)){
          for(var j = 0; j < this.specifications[i].requirements.length; j++){
            if(this.specifications[i].requirements[j]._id == helpers.getIdAfterDash(e.target.parentNode.id)){
              var newVal = 0;
              switch(this.specifications[i].requirements[j].value){
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
              this.specifications[i].requirements[j].value = newVal;
              this.setRelationship(e.target, newVal);
              this.calculateImportance();
              this.saveSpecificationsLocally();
              PostService.changeSpecification(this.specifications[i]);
              this.yChangeSpecifications();
              break outerloop;
            }
          }
        }
      }
    },
    setRelationship: function(cell, value){
      cell.classList.remove("relWeak");
      cell.classList.remove("relFair");
      cell.classList.remove("relStrong");
      if(this.getRelClassFromValue(value) != ""){
        cell.classList.add(this.getRelClassFromValue(value));
      }
    },
    blurIfEnter: function(e){
      if(e.keyCode === 13){
        e.target.blur();
      }
    },
    changeTargetName: function(e){
      var tsIndex = e.target.closest('td').cellIndex;
      var tsId = helpers.getIdAfterDash(document.getElementById('specifications').children[tsIndex].id);
      for(var i = 0; i < this.specifications.length; i++){
        if(this.specifications[i]._id == tsId){
          if(this.specifications[i].target == e.target.value){
            return;
          }
          this.specifications[i].target = e.target.value;
          this.saveSpecificationsLocally();
          PostService.changeSpecification(this.specifications[i]);
          this.yChangeSpecifications();
          break;
        }
      }
    },
    changeSpecificationName: function(e){
      if(e.target.value != ""){
        var index = this.getElementIndexBy_Id(this.specifications, helpers.getIdAfterDash(e.target.closest('td').id));
        if(index >= 0){
          if(this.specifications[index].name == e.target.value){
            return;
          }
          this.specifications[index].name = e.target.value;
          this.saveSpecificationsLocally();
          PostService.changeSpecification(this.specifications[index]);
          this.yChangeSpecifications();
        }
      } else {
        this.deleteColumn(e);
      }
    },
    clickCanvas: function(e){
      if(!this.authorized){
        this.authAlert();
        return;
      }
      var ctx = this.canvas.getContext('2d');
      var firstSpecification = document.getElementById('specifications').children[1];
      var columnWidth = firstSpecification.offsetWidth;
      var x;
      var y;
      if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
      }
      else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      x -= (this.canvas.getBoundingClientRect().left + document.documentElement.scrollLeft);
      y -= (this.canvas.getBoundingClientRect().top + document.documentElement.scrollTop);
      var ctrLeft = 0;
      for(var i = 0; i < this.specifications.length + 1; i++){
        if(x - i * columnWidth > (this.canvas.height - y)){
          ctrLeft++;
        }
      }
      var ctrRight = -1;
      for(var i = 0; i < this.specifications.length + 1; i++){
        if(this.canvas.width - x - i * columnWidth > (this.canvas.height - y)){
          ctrRight++;
        }
      }
      var ctrRightCoordinate = this.specifications.length + 1 - ctrRight;
      if(ctrLeft <= this.specifications.length && ctrRightCoordinate <= this.specifications.length && ctrLeft >= 1 && ctrRightCoordinate >= 1 && ctrLeft != ctrRightCoordinate){
        var specLeft = document.getElementById('specifications').children[ctrLeft];
        var specRight = document.getElementById('specifications').children[ctrRightCoordinate];
        var newValL = 0;
        var newValR = 0;
        for(var i = 0; i < this.specifications.length; i++){
          if(this.specifications[i]._id == helpers.getIdAfterDash(specLeft.id)){
            for(var j = 0; j < this.specifications[i].specifications.length; j++){
              if(this.specifications[i].specifications[j]._id == helpers.getIdAfterDash(specRight.id)){
                this.specifications[i].specifications[j].value++;
                if(this.specifications[i].specifications[j].value > 2){
                  this.specifications[i].specifications[j].value = -2;
                }
                newValL = this.specifications[i].specifications[j].value;
                this.saveSpecificationsLocally();
                PostService.changeSpecification(this.specifications[i]);
                this.yChangeSpecifications();
              }
            }
          }
          if(this.specifications[i]._id == helpers.getIdAfterDash(specRight.id)){
            for(var j = 0; j < this.specifications[i].specifications.length; j++){
              if(this.specifications[i].specifications[j]._id == helpers.getIdAfterDash(specLeft.id)){
                this.specifications[i].specifications[j].value++;
                if(this.specifications[i].specifications[j].value > 2){
                  this.specifications[i].specifications[j].value = -2;
                }
                newValR = this.specifications[i].specifications[j].value;
                this.saveSpecificationsLocally();
                PostService.changeSpecification(this.specifications[i]);
                this.yChangeSpecifications();
              }
            }
          }
        }
        if(newValL != newValR){
          // console.log("NEW VALUES MISMATCH");
          // console.log(newValL, newValR);
        }
        // clear previous
        var x = (ctrLeft + ctrRightCoordinate - 1) * columnWidth / 2;
        var y = this.canvas.height - Math.abs(ctrRightCoordinate - ctrLeft) * columnWidth / 2;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2 * Math.PI, false);
        ctx.fill();
        x -= 35/2;
        y -= 35/2;
        if(newValL != 0){
          var img = new Image();
          switch(newValL){
            case 1:
              img.src = require('../assets/table/positive.png');
              break;
            case 2:
              img.src = require('../assets/table/strong-positive.png');
              break;
            case -1:
              img.src = require('../assets/table/negative.png');
              break;
            case -2:
              img.src = require('../assets/table/strong-negative.png');
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
      }
    },
    addNewColumn: function(e){
      this.needsUpdate = true;
      if(e.target.value == ""){
        return;
      }
      var specification = {"name": e.target.value, "categoryId": this.categoryId + ""};
      e.target.value = "";
      specification._id = Date.now() + "";
      specification.minMax = 0;
      specification.target = "";
      specification.requirements = new Array();
      specification.specifications = new Array();
      specification.created = "";
      // new ts relationships
      for(var i = 0; i < this.requirements.length; i++){
        specification.requirements.push({"_id": this.requirements[i].id + "", "value": 0});
      }
      // new ts specifications
      for(var i = 0; i < this.specifications.length; i++){
        specification.specifications.push({"_id": this.specifications[i]._id + "", "value": 0});
      }
      this.specifications.push(specification);
      // old ts specifications
      for(var i = 0; i < this.specifications.length; i++){
        this.specifications[i].specifications.push({"_id": specification._id + "", "value": 0});
      }
      this.saveSpecificationsLocally();
      PostService.addSpecification(specification);
      this.yChangeSpecifications();
    },
    deleteColumn: function(e){
      this.needsUpdate = true;
      var specificationElement = e.target.closest('td');
      var specificationId = helpers.getIdAfterDash(specificationElement.id);
      var index = this.getElementIndexBy_Id(this.specifications, specificationId);
      if(confirm('Are you sure you want to delete this technical specification?')){
        // TODO: DELETE FROM LOCAL DATABASE
        this.deleteSpecificationsLocally(specificationId);
        PostService.deleteSpecification({"_id": specificationId});
        if(index >= 0){
          this.specifications.splice(index, 1);
        }
        this.yChangeSpecifications();
      } else {
        if(index >= 0){
          e.target.value = this.specifications[index].name;
        }
      }
    },
    changeProduct: function(e){
      for(var i = 0; i < this.products.length; i++){
        if(this.products[i].id == helpers.getIdAfterDash(e.target.id)){
          if(this.products[i].name == e.target.value){
            return;
          }
          this.products[i].name = e.target.value;
          if(e.target.value == ""){
            for(var j = 0; j < this.products[i].requirements.length; j++){
              this.products[i].requirements[j].value = 0;
            }
          }
          if(this.products[i].name.length < 2){
            this.products[i].abbreviation = this.products[i].name;
          } else {
            this.products[i].abbreviation = this.products[i].name.toUpperCase().substring(0, 1) + this.products[i].name.toLowerCase().substring(1, 2);
          }
          this.saveProductsLocally();
          PostService.changeProduct(this.products[i]);
          this.yChangeProducts();
          // this.setProductValues();
        }
      }
    },
    getProductAbbreviation: function(requirementId, productValue){
      for(var i = 0; i < this.products.length; i++){
        var index = this.getElementIndexBy_Id(this.products[i].requirements, requirementId);
        if(index >= 0){
          if(this.products[i].requirements[index].value == productValue){
            var cell = document.getElementById("cr-" + requirementId).children[2 + this.specifications.length + productValue];
            if(cell){
              if(this.products[i].id == 0){
                cell.classList.add("redText");
              } else {
                cell.classList.remove("redText");
              }
            }
            return this.products[i].abbreviation;
          }
        }
      }
      return "";
    },
    clickProductValue: function(e){
      if(!this.authorized){
        this.authAlert();
        return;
      }
      var cellIndex = e.target.cellIndex;
      var crId = helpers.getIdAfterDash(e.target.parentNode.id);
      var value = cellIndex - this.specifications.length - 2; // 2 represents the first 2 columns
      var newId = 0;

      outerloop:
      for(var i = 0; i < this.products.length; i++){
        for(var j = 0; j < this.products[i].requirements.length; j++){
          if(this.products[i].requirements[j]._id == crId && this.products[i].requirements[j].value == value){
            this.products[i].requirements[j].value = 0;
            var oldId = this.products[i].id;
            newId = this.products[i].id + 1;
            this.saveProductsLocally();
            PostService.changeProduct(this.products[i]);
            this.yChangeProducts();
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
        for(var s = 0; s < this.products.length; s++){
          if(this.products[s].id == newId){
            for(var t = 0; t < this.products[s].requirements.length; t++){
              if(this.products[s].requirements[t]._id == crId && this.products[s].requirements[t].value != 0 || this.products[s].name == ""){
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
        for(var i = 0; i < this.products.length; i++){
          if(this.products[i].id == newId){
            for(var j = 0; j < this.products[i].requirements.length; j++){
              if(this.products[i].requirements[j]._id == crId){
                this.products[i].requirements[j].value = value;
                if(this.products[i].id == 0){
                  e.target.classList.add("redText");
                } else {
                  e.target.classList.remove("redText");
                }
              }
            }
            this.saveProductsLocally();
            PostService.changeProduct(this.products[i]);
            this.yChangeProducts();
            break outerloop2;
          }
        }
      }
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
    async getRequirementsLocally(){
      return new Promise((resolve, reject) => {
        let trans = this.idb.transaction(['requirements'],'readonly');
        trans.oncomplete = e => {
          resolve(requirements);
        };
        let store = trans.objectStore('requirements');
        let requirements = [];
        store.openCursor().onsuccess = e => {
          let cursor = e.target.result;
          if (cursor) {
            var found = false;
            var requirement = cursor.value.value;
            for(var i = 0; i < requirement.categories.length; i++){
              if(requirement.categories[i].id == this.categoryId){
                found = true;
              }
            }
            if(found){
              requirements.push(cursor.value.value);
            }
            cursor.continue();
          }
        };
      });
    },
    async getSpecificationsLocally(){
      return new Promise((resolve, reject) => {
        let trans = this.idb.transaction(['specifications'],'readonly');
        trans.oncomplete = e => {
          resolve(specifications);
        };
        let store = trans.objectStore('specifications');
        let specifications = [];
        store.openCursor().onsuccess = e => {
          let cursor = e.target.result;
          if (cursor) {
            if(cursor.value.value.categoryId == this.categoryId){
              specifications.push(cursor.value.value);
            }
            cursor.continue();
          }
        };
      });
    },
    async getProductsLocally(){
      return new Promise((resolve, reject) => {
        let trans = this.idb.transaction(['products'],'readonly');
        trans.oncomplete = e => {
          resolve(products);
        };
        let store = trans.objectStore('products');
        let products = [];
        store.openCursor().onsuccess = e => {
          let cursor = e.target.result;
          if (cursor) {
            if(cursor.value.value.categoryId == this.categoryId){
              products.push(cursor.value.value);
            }
            cursor.continue();
          }
        };
      });
    },
    async getAuthorizedCategoryLocally(){
      return new Promise((resolve, reject) => {
        let trans = this.idb.transaction(['authorizedCategories'],'readonly');
        trans.oncomplete = e => {
          resolve(authorizedCategories);
        };
        let store = trans.objectStore('authorizedCategories');
        let authorizedCategories = [];
        store.openCursor().onsuccess = e => {
          let cursor = e.target.result;
          if (cursor) {
            if(cursor.key == this.$oidc.user.profile.sub){
              authorizedCategories.push(cursor.value.value);
            }
            cursor.continue();
          }
        };
      });
    },
    async getCategoryNameLocally(){
      return new Promise((resolve, reject) => {
        let trans = this.idb.transaction(['categories'],'readonly');
        trans.oncomplete = e => {
          resolve(categoryName);
        };
        let store = trans.objectStore('categories');
        let categoryName = '';
        store.openCursor().onsuccess = e => {
          let cursor = e.target.result;
          if (cursor) {
            if(cursor.key == this.categoryId){
              categoryName = cursor.value.value.name;
            } else {
              cursor.continue();
            }
          }
        };
      });
    },
    async saveRequirementsLocally(){
      return new Promise((resolve, reject) => {
        let trans = this.idb.transaction(['requirements'],'readwrite');
        trans.oncomplete = e => {
          resolve();
        };
        let store = trans.objectStore('requirements');
        // delete old specifications
        store.openCursor().onsuccess = e => {
          let cursor = e.target.result;
          if (cursor) {
            if(cursor.value.value.categoryId == this.categoryId && !helpers.isInArrayById(cursor.value.key, this.requirements)){
              store.delete(cursor.value.key);
            }
            cursor.continue();
          }
        };
        this.requirements.forEach(requirement => {
          store.put({key: requirement.id, value: requirement});
        });
      });
    },
    async saveSpecificationsLocally(){
      return new Promise((resolve, reject) => {
        let trans = this.idb.transaction(['specifications'],'readwrite');
        trans.oncomplete = e => {
          resolve();
        };
        let store = trans.objectStore('specifications');
        // delete old specifications
        store.openCursor().onsuccess = e => {
          let cursor = e.target.result;
          if (cursor) {
            if(cursor.value.value.categoryId == this.categoryId && !helpers.isInArrayBy_Id(cursor.value.key, this.specifications)){
              store.delete(cursor.value.key);
            }
            cursor.continue();
          }
        };
        this.specifications.forEach(specification => {
          store.put({key: specification._id, value: specification});
        });
      });
    },
    async saveProductsLocally(){
      return new Promise((resolve, reject) => {
        let trans = this.idb.transaction(['products'],'readwrite');
        trans.oncomplete = e => {
          resolve();
        };
        let store = trans.objectStore('products');
        this.products.forEach(product => {
          store.put({key: product.id, value: product});
        });
      });
    },
    async saveAuthorizedCategoryLocally(){
      return new Promise((resolve, reject) => {
        let trans = this.idb.transaction(['authorizedCategories'],'readwrite');
        trans.oncomplete = e => {
          resolve();
        };
        let store = trans.objectStore('authorizedCategories');
        store.put({key: this.$oidc.user.profile.sub, value: this.categoryId});
      });
    },
    async deleteSpecificationsLocally(key){
      return new Promise((resolve, reject) => {
        let trans = this.idb.transaction(['specifications'],'readwrite');
        trans.oncomplete = e => {
          resolve();
        };
        let store = trans.objectStore('specifications');
        store.delete(key);
      });
    },
    yOnChange: function(){
      this.needsUpdate = true; // for createCanvas()
      if(this.yMap.get('specifications')){
        this.specifications = this.yMap.get('specifications').toArray();
      }
      if(this.yMap.get('products')){
        this.products = this.yMap.get('products').toArray();
      }
    },
    entriesForCategoryId: function(array, categoryId) {
      var ans = new Array();
      for(var i = 0; i < array.length; i++){
        if(array[i].categoryId == categoryId){
          ans.push(array[i]);
        }
      }
      return ans;
    },
    yChangeSpecifications: function(){
      const ySpecifications = new Y.Array();
      ySpecifications.push(this.specifications);
      this.yMap.set('specifications', ySpecifications);
    },
    yChangeProducts: function(){
      const yProducts = new Y.Array();
      yProducts.push(this.products);
      this.yMap.set('products', yProducts);
    },
    async checkRequirements(){
      try {
        // this.requirements = await this.getRequirementsLocally();
        let newRequirements = await PostService.getAllRequirements(this.categoryId);
        for(var i = 0; i < this.requirements.length; i++){
          var index1 = this.getElementIndexById(newRequirements, this.requirements[i].id);
          if(index1 >= 0){
            this.requirements[i].name = newRequirements[index1].name;
            this.requirements[i].upVotes = newRequirements[index1].upVotes;
            this.requirements[i].downVotes = newRequirements[index1].downVotes;
          } else {
            console.log("changeS1");
            for(var j = 0; j < this.specifications.length; j++){
              var idx = this.getElementIndexBy_Id(this.specifications[j].requirements, this.requirements[i].id);
              if(idx >= 0){
                this.specifications[j].requirements.splice(idx, 1);
                PostService.changeSpecification(this.specifications[j]);
              }
            }
            for(var j = 0; j < this.products.length; j++){
              var idx = this.getElementIndexBy_Id(this.products[j].requirements, this.requirements[i].id);
              if(idx >= 0){
                this.products[j].requirements.splice(idx, 1);
                PostService.changeProduct(this.products[j]);
              }
            }
            this.requirements.splice(i, 1);
          }
        }
        for(var i = 0; i < newRequirements.length; i++){
          var index2 = this.getElementIndexById(this.requirements, newRequirements[i].id);
          if(index2 == -1){
            console.log("changeS2");
            for(var j = 0; j < this.specifications.length; j++){
              this.specifications[j].requirements.push({"_id": newRequirements[i].id + "", "value": 0});
              PostService.changeSpecification(this.specifications[j]);
            }
            for(var j = 0; j < this.products.length; j++){
              this.products[j].requirements.push({"_id": newRequirements[i].id + "", "value": 0});
              PostService.changeProduct(this.products[j]);
            }
            this.requirements.push(newRequirements[i]);
            this.requirements.sort(function(a, b){
              if(a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
              if(a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
              return 0;
            });
          }
        }
        this.saveRequirementsLocally();
      } catch (err) {
      }
    },
    authAlert: function(){
      if(this.$oidc.isAuthenticated){
        this.error = "You are not authorized for this diagram. Only users assigned as developers in Requirements Bazaar can perform changes.";
      } else {
        this.error = "You are not logged in.";
      }
      setTimeout(() => {
        this.error = "";
        document.getElementById('alertBox').display = "none";
      }, 5000);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

body{

}

td {
  border: 1px solid gray;
}

#houseTable {
  border-collapse: collapse;
  position: relative;
  min-width: 800px;
  top: 45px;
  left: 50%;
  transform: translate(-50%, 0);
  margin: 0px;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}

#houseTable td {
  padding: 5px;
  width: 45px;
  height: 25px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 35px 35px;
  text-align: center;
  vertical-align: middle;
}

tr:nth-child(odd) {
  background: #d1d8e8;
}

tr:nth-child(even) {
  background: #e9eef4;
}

canvas {
  position: relative;
  top: 50px;
  left: 50%;
  transform: translate(-50%, 0);
  margin: 0px;
}

.container {
  display:block;
  width: 1200px;
  height: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.controlPanel {
  border: none;
  background-color: white;
  font-size: 14px;
  padding: 0px;
}

.controlPanel > input {
  width: 200px;
  height: 40px;
  margin-top:5px;
  margin-bottom:5px;
  font-size: 16px;
}

.requirements {
  text-align: left;
  width: 250px;
}

.customer-requirement{
  min-width: 500px;
  font-size: 16px;
}

.requirement-priorities {
  background-color: #fad6a6;
  text-align: center;
  min-width: 45px;
  max-width: 45px;
  font-size: 16px;
}

.relationships {
  text-align: center;
  width: 45px;
  max-width: 45px;
  cursor: pointer;
}

.target {
  height: 200px;
}

.extra {
  text-align: center;
  width: 45px;
  max-width: 45px;
  font-size: 12px;
}

.hidden {
  background-color: #fff;
  border: none;
  text-align: center;
}

.minMaxCell {
  background-color: #b9dde9;
  cursor: pointer;
}

.vertical-text {
  height:200px;
}

.vertical-text.tech-requirements span, .vertical-text.tech-requirements {
  writing-mode: vertical-rl;
  -webkit-writing-mode: vertical-rl;
  -ms-writing-mode: vertical-rl;
  padding: 5px;
}

.specification{
  height: 200px;
  width: 45px;
  max-width: 45px;
  padding: 0;
}

.sideway{
  white-space: nowrap;
  margin: 0;
  padding: 0;
  float: left;
  width: 45px;
  max-width: 45px;
  height: 200px;
}

.sideway span {
  vertical-align: top;
  display: inline-block;
  transform: translate(0, 200px) rotate(270deg);
  transform-origin: 0 0;
  width: 200px;
  height: 45px;
}
.verticalInput {
  padding: 0;
  color: silver;
  background: none;
  border: none;
  line-height: 0.8em;
  vertical-align: middle;
  outline: none;
  display: inline;
  font-size: 16px;
}
.productInput{
  /* height: 40px !important; */
}
.product-value{
  font-size: 16px;
}
[type="text"] {
  /* color: rgb(255, 127, 39); */
  color: black;
  height: 48px;
  width: 100%;
  text-align: center;
}
form {
  overflow: hidden;
}

.minMaxUp {
  background-image: url('../assets/table/arrow-up.png');
}

.minMaxDown {
  background-image: url('../assets/table/arrow-down.png');
}

.minMaxNeutral {
  background-image: url('../assets/table/neutral.png');
}

.relWeak {
  background-image: url('../assets/table/weak.png');
}

.relFair {
  background-image: url('../assets/table/fair.png');
}

.relStrong {
  background-image: url('../assets/table/strong.png');
}

.product-name{
  width: 45px;
  max-width: 45px;
}

.redText {
  color: red;
}

.blackText {
  color: black;
}

</style>
