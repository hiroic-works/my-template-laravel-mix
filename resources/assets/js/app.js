import Vue from 'vue';
import Alert from './components/Alert.vue';

import Helper from './Helper.js';

const helper = new Helper();
helper.test();
Helper.log();

if( document.querySelector('#app') ) {
	new Vue({
	    el: '#app',
	    components: { Alert }
	});
}
