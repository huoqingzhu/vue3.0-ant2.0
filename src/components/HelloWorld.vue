<template>
<div class="hello">
  <h1>data、methods与setup</h1>
  <p>
    <a-button type="primary" @click="add()">++</a-button>
    vue2：{{ num }},{{com}},{{obj.name}},
  </p>
  <p>
    <a-button type="primary" @click="addx()">++</a-button>
    vue3：{{numx}},{{comx}},{{objx.name}}
  </p>
</div>
</template>

<script>
import {
  article
} from "../api/article.js";
import {
  reactive,
  toRefs,
  computed,
  watch,
  watchEffect,
  ref
} from "vue";
import {
  useRouter
} from "vue-router";
import {
  mapState,
  mapMutations,
  useStore
} from "vuex";
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },

  data() {
    return {
      num: 1,
      obj: {
        name: "vue2",
      },
    };
  },
  created() {
    console.log(this.$store.state.open);
    this.$store.commit("changOpne", true);
  },
  methods: {
    add() {
      this.num++;
      this.numx++;
      this.$router.push("/about");
    },
  },
  watch: {
    num: {
      deep: true, //开启深度监听
      immediate: true, //上来就观察计算
      handler(a, b) {
        this.obj.name = `vue2变化了：${this.num}`;
      },
    },
  },
  computed: {
    com() {
      return this.num * 2;
    },
    ...mapState(["open"]),
  },
  setup(props) {
    let numx = ref(1);
    const obj = reactive({
      objx: {
        name: "vue3",
      },
    });
    const getData = async () => {
      const data = await article();
      console.log(data);
    };
    getData();
    const store = useStore();
    console.log(store.state.open);
    store.commit("changOpne", false);
    const router = useRouter();
    let comx = computed({
      get: () => {
        return numx.value * 2;
      },
    });
    const addx = () => {
      numx.value++;
      router.push("/about");
    };
    watch(
      () => numx.value,
      () => {
        obj.objx.name = `vue3变化了${numx.value}`;
      }, {
        lazy: false, //等同于immediate: false,
      }
    );

    return {
      numx,
      ...obj,
      addx,
      comx,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
