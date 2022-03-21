<template>
	<div class="mainBox" v-if="loaded">
		<LogIn v-if="$route.path.startsWith('/login')" />
		<Main v-else />
	</div>
</template>

<script>
import Main from "./views/Main_v3";
import LogIn from "./views/login/LogIn_v3";
import axios from './axios';

export default {
  components: {
    Main,
    LogIn,
  },
  data() {
    return {
      loaded: false,
    };
  },
  mounted() {
    window.thisVue = this;

    [
      "NewStyle/normalize.css",
      "NewStyle/jquery-ui.css",
      "NewStyle/custom-ui.css",
      "NewStyle/chosen.css",
      "NewStyle/common.css",
      "NewStyle/aside.css",
      "NewStyle/topmenu.css", // "NewStyle/mainmenu.css",
      "NewStyle/pagination.css",
      "NewStyle/dropdown_for_images.css",
      "NewStyle/jstree.css",
      "NewStyle/multiple-select.css",
      "NewStyle/pagination.css",
      "NewStyle/jstree.css",
      "NewStyle/eqtree.min.css"
    ].forEach(link =>
      axios.get(this.settings.appUrl + link)
        .then(response => {
          var s = document.createElement("style");
          s.innerHTML = response.data.replaceAll('../', this.settings.appUrl);
          document.getElementsByTagName("head")[0].appendChild(s);
          setTimeout(() => this.loaded = true, 500);
        })
    );
  }
};
</script>