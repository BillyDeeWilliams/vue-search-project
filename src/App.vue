<template>
<header>
<h1>Taggable Search Demo</h1>
<h2>built with vue.js 3 using the composition API</h2>
<hr>
</header>
<searchform />
</template>

<script setup >
import searchform from './components/search-form.vue'
import { onMounted } from 'vue'

function setWithExpiry(key, value, ttl) {
	const now = new Date()
  
	const item = {
		value: value,
		expiry: now.getTime() + ttl,
	}
	localStorage.setItem(key, JSON.stringify(item))
	
}
function getWithExpiry(key) {
	const itemStr = localStorage.getItem(key)
	if (!itemStr) {
		return null
	}
	const item = JSON.parse(itemStr)
	const now = new Date()
	if (now.getTime() > item.expiry) {
		localStorage.removeItem(key)
		return null
	}
	return item.value
}

 onMounted(()=>{
 async function getstudents() {
  if(getWithExpiry("students") == null){
    fetch('https://api.hatchways.io/assessment/students')
      .then(response => response.json())
      .then(data => setWithExpiry("students", data, 3600000))
      .catch(err => console.error(err));
    console.log('fetching...')   
  }else{
    console.log('there already is data')
  } 
 }
  getstudents()

 })

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;

 }
body{
  margin: 0;
  background-color: #ccc;
      box-sizing: border-box;
}
</style>
