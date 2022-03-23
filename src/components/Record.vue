<template>
  <div class="studentRecord" >
   <div class="record">
    <div  class="recordHeading" :class=" active && recordExpanded ">
      <img class="studentProfilePic" :src=pic alt="" />
      <div>
       <h2> {{ firstName }} {{ lastName }}</h2>
        <ul>
          <li>Email: {{ email }}</li>
          <li>Company: {{ company }} </li>
          <li>Skill: {{ skill }}</li>
          <li>Average: {{ gradePointAverage }}%</li>
        </ul>
        
      </div>
      <button @click="expandRecord($event)" class="expandButton"></button>
     
    </div>
  
   <div class="recordExpandable">
      <div>
        <ul class="gradeList">
          <li v-for="(grade, index) in grades" :key="grade.id">Test {{ index + 1 }}: {{ grade }}</li>
        </ul>
       
      </div>
    </div>
  
   </div>
    <Tagging v-model="updatedTags"  v-on:update:modelValue="updateTags" />      
  </div>
</template>

<script>
import {computed, ref, onUpdated } from 'vue'
import Tagging from './Tagging.vue'

export default {
 name: 'Record',
 components: {
    Tagging: Tagging,
  },
  props: {
    pic:{
      type: String
    },
    firstName: {
      type: String
    },
    lastName:{
      type: String
    },
    email: {
      type: String
    },
    company:{
      type: String
    },
    skill: {
      type: String
    },
    grades: {
      type: Array
    },
    gradePointAverage:{
      type: Number
    },
    tags:{
      type: Array
    },
    id:{
      type: String
    },
    isExpanded:{
      type: Boolean,
      default: false
    }
  },
setup(props) {

function setWithExpiry(key, value, ttl) {
	const now = new Date()
	const item = {
		value: value,
		expiry: now.getTime() + ttl,
	}
	localStorage.setItem(key, JSON.stringify(item))	
}

let recordExpanded =  props.isExpanded
const active = "active"

function expandRecord(e){
  e.target.parentNode.classList.toggle('active')
  recordExpanded = !recordExpanded
  if (recordExpanded == false){
    updatedTags = [];
  }
}

  let updatedTags = ref([])
    updatedTags = props.tags
  
  function updateTags(){
    const memoryIndex = (props.id -1)
    const recordData = JSON.parse(localStorage.getItem("students")).value.students[memoryIndex]
    const oldData = JSON.parse(localStorage.getItem("students")).value.students
    let updatedData = oldData
    recordData.tags = updatedTags
    updatedData[memoryIndex] = recordData
    let data = { students: updatedData}
    setWithExpiry("students", data, 3600000)  
  }
  onUpdated(()=>{
    updatedTags = JSON.parse(localStorage.getItem("students")).value.students[(props.id -1)].tags
  })

return {updatedTags, expandRecord, updateTags, recordExpanded, active}

}
}


</script>
<style >

.expandButton {
  background: unset;
  border: none;
  outline: none;
  width: 10%;
  position: relative;
}
.expandButton::after {
       content: '\002B';
    color: #999;
    font-weight: bold;
   margin-left: 5px;
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 5rem;
}
.active .expandButton:after {
    content: "\2212";
}

.recordExpandable{ 
    padding: 0;
    background-color: #ddd;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
    transition: padding 0.2s ease-in-out;
    color: black;
    display: flex;
    justify-content: flex-end;;
}

.active + .recordExpandable{
  max-height: 100%;
  padding: 20px;
  padding-top: 0;
}

.studentRecord{
  border-bottom: 1px solid black;
  width:  100%;
}
.recordExpandable > div{
    width: 70%; 
}
.gradeList{
    text-align: left;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}

div.active + .recordExpandable ul.gradeList{
  opacity: 1;
}
.studentRecord h4{
  margin: 0;
  padding: 1.3em;
}
.record{
  margin: 0;
  padding: 0;
}
.recordHeading{
  display: flex;
  padding: 20px;
  justify-content: flex-end;
  padding-bottom: 0;
}
.recordHeading h2{
  text-transform: uppercase;
    font-size: 2rem;
    font-weight: 600;
    color: black;
}

.recordHeading div{
    width: 60%;
    text-align: left;
}

.recordHeading li {
    padding: 5px 0;
}
.studentProfilePic{
    border: 1px solid black;
    border-radius: 100%;
    width: 100px;
    height: 100px;
    margin: 0;

}


@media(min-width: 667px){
.expandButton::after{
      top: 0;
    bottom: unset;
}
.studentProfilePic{
    width: 175px;
    height: 175px;
    margin: 30px;
    margin-right: auto;
    margin-bottom: 0;
}
}
</style>