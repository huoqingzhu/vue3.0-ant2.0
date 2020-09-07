import {
  Button,
} from "ant-design-vue";
const ant = {
  install(Vue) {
    Vue.component(Button.name, Button);
  },
};
export default ant;