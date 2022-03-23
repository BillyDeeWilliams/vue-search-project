<template>
<div :class="$style.main">
 <form  :class="$style.searchForm" >
 <ul>
  <li> 
    <input @input="showResults($event)"
          @keydown.prevent.enter="showResults($event)"
          @keydown.tab="showResults($event)"
         @keydown.delete="showResultsDel($event)"
     type ="text" v-model="nameInput" placeholder="Search by name"/>
  </li>
  <li> 
    <input @input="showResults($event)"
          @keydown.prevent.enter="showResults($event)"
          @keydown.tab="showResults($event)"
         @keydown.delete="showResultsDel($event)"
     type ="text" v-model="tagInput" placeholder="Search by tag" />
  </li>
</ul>
 </form>
 <div   :class="$style.results" >
 <section v-if:="searching">
 <Record  v-for="studentRecord in searchStudentsByName" 
          :id="studentRecord.id"
          v-bind="studentRecord"
          @refresh-search="updateResults(tagInput, nameInput)"/>
          </section>
</div>
</div>
</template>

<script>

</script>

<script setup>
import Record from './Record.vue'
import {ref, computed, onMounted} from 'vue'

const searching = ref(false)
const nameInput = ref('')
const tagInput = ref('')



function showResults(e){
    searching.value = false
  if( e.target.value != ''){
    setTimeout(()=>{searching.value = true  }, 200)
  }else{
    searching.value = false
  }
}

function showResultsDel(e){
    searching.value = false
  if(  e.target.value.length > 1){
     setTimeout(()=> {searching.value = true  }, 200)
  }
    searching.value = false
}


 let sourceData = ref([])
  if(localStorage.getItem("students") == null){

    setTimeout(()=> { 
        sourceData =JSON.parse(localStorage.getItem("students")).value.students

sourceData = sourceData.map(student => {
  //calculate and add gpa to each record
  const gradePointSum = student.grades.reduce((acc, grade) => acc += Number(grade), 0)
  const gradePointAverage = gradePointSum/student.grades.length
  return{...student, gradePointAverage} 
})

sourceData = sourceData.map(student => {
  if(!student.tags){
    //const tags = ["test"]
     const tags = []
    return{...student, tags} 
  }
  return{...student}
})
 }, 1000);
 
  }else{
//get data from local storage - should have gone thorugh expire check and been (re)fetched if neccessary
  sourceData =JSON.parse(localStorage.getItem("students")).value.students

sourceData = sourceData.map(student => {
  //calculate and add gpa to each record
  const gradePointSum = student.grades.reduce((acc, grade) => acc += Number(grade), 0)
  const gradePointAverage = gradePointSum/student.grades.length
  return{...student, gradePointAverage} 
})

sourceData = sourceData.map(student => {
  if(!student.tags){
    // const tags = ["test"]
    const tags = []
    return{...student, tags} 
  }
  return{...student}
})
  } 
 
 

//filter results by name
let searchStudentsByName = computed(()=>{
if(searching){
  return sourceData.filter(function(student) {
    // console.log("Tag input: " + tagInput.value)
    // console.log("Name input: " + nameInput.value)
    if(tagInput.value != '' && nameInput.value == ""){
      if(student.tags.length > 0){
        for (let i = 0; i < student.tags.length ; i++) {
          if (student.tags[i].search(tagInput.value) != -1 ) {
            console.log('tag match')
            return student
          }
        }
      }
    }
    else if(tagInput.value == '' && nameInput.value != ""){
      if(student.firstName.toUpperCase().match(nameInput.value.toUpperCase()) ||
        student.lastName.toUpperCase().match(nameInput.value.toUpperCase())){
        console.log('name match')
        return student
      }
    //    console.log("no Tag input: " + tagInput.value)
    // console.log("yes Name input: " + nameInput.value)
    }
    else if(tagInput.value != '' && nameInput.value != ""){
      if(student.tags.length > 0){
        for (let i = 0; i < student.tags.length ; i++) {
          if ((student.tags[i].search(tagInput.value) != -1) &&
            (student.firstName.toUpperCase().match(nameInput.value.toUpperCase()) ||
            student.lastName.toUpperCase().match(nameInput.value.toUpperCase()))){
            console.log('tag and name match')
            return student
          }
        }
      }
    }
  })
}
})

</script>
<style module>


input::-webkit-input-placeholder, 
input::-ms-input-placeholder, 
input:-ms-input-placeholder, 
input::-moz-placeholder, 
input::placeholder, 
input:-moz-placeholder {/* Firefox 18- */
	opacity: 1;
  color: #ddd;
}

.belowForm{
  margin-bottom: 0;
}

.results{
  max-width:970px;
  height: 100%;
  min-height:100vh;
  margin: 0 auto;
}
.searchForm{
  width: 100%;
  padding-top: 10px;
  text-align: left;
  font-size: 1.2rem;
  color: #666;
  background-color: #ddd;
  border-radius: 15px;
}

.main{
 max-width:970px;
    margin: 15px auto;
    color: #666;
    background-color: #ddd;
    border-radius: 15px;
    box-shadow: -4px 12px 8px 5px #26222226;
    border: outset #80808045;

}
.searchForm input[type="text"]{
background: unset;
    border: unset;
    font-size: 1.2rem;
    outline: none;
    width: 98%;
    font-weight: 100;
    padding: 0 10px;
    border-bottom: 1px solid #999;
}

ul{
  list-style: none;
  margin: 0;
  padding: 0;
}
.searchForm li{
    padding: 5px;

}
</style>