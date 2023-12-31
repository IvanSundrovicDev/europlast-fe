import Vue from 'vue'
import VxTooltip from './layouts/components/vx-tooltip/VxTooltip.vue'
import VxBreadcrumb  from './layouts/components/VxBreadcrumb.vue'
import VxCard  from './components/vx-card/VxCard.vue'
import FeatherIcon  from './components/FeatherIcon.vue'

Vue.component(VxTooltip.name, VxTooltip)
Vue.component(VxBreadcrumb.name, VxBreadcrumb)
Vue.component(VxCard.name, VxCard)
Vue.component(FeatherIcon.name, FeatherIcon)

// v-select component
import vSelect from 'vue-select'

// Set the components prop default to return our fresh components
vSelect.props.components.default = () => ({
  Deselect: {
    render: createElement => createElement('feather-icon', {
      props: {
        icon: 'XIcon',
        svgClasses: 'w-4 h-4 mt-1'
      }
    }),
  },
  OpenIndicator: {
    render: createElement => createElement('feather-icon', {
      props: {
        icon: 'ChevronDownIcon',
        svgClasses: 'w-5 h-5'
      }
    }),
  },
});

Vue.component(vSelect)
