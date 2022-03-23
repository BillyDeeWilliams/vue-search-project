import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
// import VueCompositionAPI from '@vue/composition-api';
//Vue.use
createApp(App).use(store).mount('#app')

/*
fetch('https://api.hatchways.io/assessment/students')
	.then(response => response.json())
	.then(data => console.log(data))
	.catch(err => console.error(err));*/