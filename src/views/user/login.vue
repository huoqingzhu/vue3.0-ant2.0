<template>
<h1 @click="login">登陆</h1>
</template>

<script>
import {
  useStore
} from "vuex";

import {
  useRouter
} from "vue-router";
export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    let login = () => {
      store.commit("setOpen", true);
      router.push("/").catch(() => {});
    };
    return {
      login,
    };
  },
};
</script>
