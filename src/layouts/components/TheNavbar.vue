<template>
  <div class="relative">
    <div class="vx-navbar-wrapper">
      <vs-navbar
        class="vx-navbar navbar-custom"
        :color="navbarColor"
        :class="classObj"
      >
        <!-- SM - OPEN SIDEBAR BUTTON -->
        <feather-icon
          class="sm:inline-flex xl:hidden cursor-pointer mr-1"
          icon="MenuIcon"
          @click.stop="showSidebar"
        ></feather-icon>

        <template v-if="breakpoint != 'md'">
          <!-- STARRED PAGES - FIRST 10 -->
          <ul class="vx-navbar__starred-pages">
            <draggable
              v-model="starredPagesLimited"
              :group="{ name: 'pinList' }"
              class="flex cursor-move"
            >
              <li
                class="starred-page"
                v-for="page in starredPagesLimited"
                :key="page.url"
              >
                <vx-tooltip :text="page.label" position="bottom" delay=".3s">
                  <feather-icon
                    svgClasses="h-6 w-6"
                    class="p-2 cursor-pointer"
                    :icon="page.labelIcon"
                    @click="$router.push(page.url)"
                  ></feather-icon>
                </vx-tooltip>
              </li>
            </draggable>
          </ul>

          <!-- STARRED PAGES MORE -->
          <div
            class="vx-navbar__starred-pages--more-dropdown"
            v-if="starredPagesMore.length"
          >
            <vs-dropdown vs-custom-content vs-trigger-click>
              <feather-icon
                icon="ChevronDownIcon"
                svgClasses="h-4 w-4"
                class="cursor-pointer p-2"
              ></feather-icon>
              <vs-dropdown-menu>
                <ul class="vx-navbar__starred-pages-more--list">
                  <draggable
                    v-model="starredPagesMore"
                    :group="{ name: 'pinList' }"
                    class="cursor-move"
                  >
                    <li
                      class="starred-page--more flex items-center cursor-pointer"
                      v-for="page in starredPagesMore"
                      :key="page.url"
                      @click="$router.push(page.url)"
                    >
                      <feather-icon
                        svgClasses="h-5 w-5"
                        class="ml-2 mr-1"
                        :icon="page.labelIcon"
                      ></feather-icon>
                      <span class="px-2 pt-2 pb-1">{{ page.label }}</span>
                    </li>
                  </draggable>
                </ul>
              </vs-dropdown-menu>
            </vs-dropdown>
          </div>
        </template>

        <vs-spacer></vs-spacer>

        <!-- USER META -->
        <div class="the-navbar__user-meta flex mr-2">Ø</div>
        <div class="the-navbar__user-meta flex items-center">
          <vs-dropdown
            vs-custom-content
            vs-trigger-click
            class="cursor-pointer"
          >
            <div class="text-right leading-tight sm:block">
              <p class="font-semibold">{{ userName }}</p>
            </div>
            <vs-dropdown-menu class="vx-navbar-dropdown">
              <ul style="min-width: 9rem">
                <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="goToProfile()"
                >
                  <feather-icon
                    icon="UserIcon"
                    svgClasses="w-4 h-4"
                  ></feather-icon>
                  <span class="ml-2">Profil</span>
                </li>
                <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="gotoWebmail"
                >
                  <feather-icon
                    icon="UserIcon"
                    svgClasses="w-4 h-4"
                  ></feather-icon>
                  <span class="ml-2">Webmail</span>
                </li>
                <vs-divider class="m-1"></vs-divider>
                <li
                  class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
                  @click="logOut()"
                >
                  <feather-icon
                    icon="LogOutIcon"
                    svgClasses="w-4 h-4"
                  ></feather-icon>
                  <span class="ml-2">Odjava</span>
                </li>
              </ul>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>
      </vs-navbar>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "the-navbar",
  props: {
    navbarColor: {
      type: String,
      default: "#fff",
    },
  },
  data() {
    return {
      navbarSearchAndPinList: this.$store.state.navbarSearchAndPinList,
      searchQuery: "",
      showFullSearch: false,
      username: "",
      unreadNotifications: [
        {
          index: 0,
          title: "New Message",
          msg: "Are your going to meet me tonight?",
          icon: "MessageSquareIcon",
          time: this.randomDate({ sec: 10 }),
          category: "primary",
        },
        {
          index: 1,
          title: "New Order Recieved",
          msg: "You got new order of goods.",
          icon: "PackageIcon",
          time: this.randomDate({ sec: 40 }),
          category: "success",
        },
        {
          index: 2,
          title: "Server Limit Reached!",
          msg: "Server have 99% CPU usage.",
          icon: "AlertOctagonIcon",
          time: this.randomDate({ min: 1 }),
          category: "danger",
        },
        {
          index: 3,
          title: "New Mail From Peter",
          msg: "Cake sesame snaps cupcake",
          icon: "MailIcon",
          time: this.randomDate({ min: 6 }),
          category: "primary",
        },
        {
          index: 4,
          title: "Bruce's Party",
          msg: "Chocolate cake oat cake tiramisu",
          icon: "CalendarIcon",
          time: this.randomDate({ hr: 2 }),
          category: "warning",
        },
      ],
      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
      autoFocusSearch: false,
      showBookmarkPagesDropdown: false,
      locale: "hr",
    };
  },
  watch: {
    $route() {
      if (this.showBookmarkPagesDropdown)
        this.showBookmarkPagesDropdown = false;
    },
  },
  computed: {
    // HELPER
    sidebarWidth() {
      return this.$store.state.sidebarWidth;
    },
    breakpoint() {
      return this.$store.state.breakpoint;
    },

    // NAVBAR STYLE
    classObj() {
      if (this.sidebarWidth == "default") return "navbar-default";
      else if (this.sidebarWidth == "reduced") return "navbar-reduced";
      else return "navbar-full";
    },

    // BOOKMARK & SEARCH
    data() {
      return this.$store.state.navbarSearchAndPinList;
    },
    starredPages() {
      return this.$store.state.starredPages;
    },
    starredPagesLimited: {
      get() {
        return this.starredPages.slice(0, 10);
      },
      set(list) {
        this.$store.dispatch("arrangeStarredPagesLimited", list);
      },
    },
    starredPagesMore: {
      get() {
        return this.starredPages.slice(10);
      },
      set(list) {
        this.$store.dispatch("arrangeStarredPagesMore", list);
      },
    },
  },
  methods: {
    gotoWebmail() {
      window.open("https://webmail.europlast.hr", "_blank");
    },
    getUserName() {
      this.userName = this.$user.first_name + " " + this.$user.last_name;

      if (!localStorage.greeted) {
        this.$vs.notify({
          title: `Dobrodošao ${this.$user.first_name} ${this.$user.last_name}!`,
          text: "Prijava u sustav uspješna.",
          position: "bottom-right",
          color: "success",
        });
        localStorage.setItem("greeted", true);
      }
    },
    goToProfile() {
      window.location.href = "/profil/edit";
    },
    logOut() {
      localStorage.clear();
      window.location.href = "/login";
    },
    showSidebar() {
      this.$store.commit("TOGGLE_IS_SIDEBAR_ACTIVE", true);
    },
    selected(item) {
      this.$router.push(item.url);
      this.showFullSearch = false;
    },
    actionClicked(item) {
      // e.stopPropogation();
      this.$store.dispatch("updateStarredPage", {
        index: item.index,
        val: !item.highlightAction,
      });
    },
    showNavbarSearch() {
      this.showFullSearch = true;
    },
    showSearchbar() {
      this.showFullSearch = true;
    },
    elapsedTime(startTime) {
      let x = new Date(startTime);
      let now = new Date();
      var timeDiff = now - x;
      timeDiff /= 1000;

      var seconds = Math.round(timeDiff);
      timeDiff = Math.floor(timeDiff / 60);

      var minutes = Math.round(timeDiff % 60);
      timeDiff = Math.floor(timeDiff / 60);

      var hours = Math.round(timeDiff % 24);
      timeDiff = Math.floor(timeDiff / 24);

      var days = Math.round(timeDiff % 365);
      timeDiff = Math.floor(timeDiff / 365);

      var years = timeDiff;

      if (years > 0) {
        return years + (years > 1 ? " Years " : " Year ") + "ago";
      } else if (days > 0) {
        return days + (days > 1 ? " Days " : " Day ") + "ago";
      } else if (hours > 0) {
        return hours + (hours > 1 ? " Hrs " : " Hour ") + "ago";
      } else if (minutes > 0) {
        return minutes + (minutes > 1 ? " Mins " : " Min ") + "ago";
      } else if (seconds > 0) {
        return seconds + (seconds > 1 ? ` sec ago` : "just now");
      }

      return "Just Now";
    },
    outside: function () {
      this.showBookmarkPagesDropdown = false;
    },
    // Method for creating dummy notification time
    randomDate({ hr, min, sec }) {
      let date = new Date();

      if (hr) date.setHours(date.getHours() - hr);
      if (min) date.setMinutes(date.getMinutes() - min);
      if (sec) date.setSeconds(date.getSeconds() - sec);

      return date;
    },
  },
  directives: {
    "click-outside": {
      bind: function (el, binding) {
        const bubble = binding.modifiers.bubble;
        const handler = (e) => {
          if (bubble || (!el.contains(e.target) && el !== e.target)) {
            binding.value(e);
          }
        };
        el.__vueClickOutside__ = handler;
        document.addEventListener("click", handler);
      },

      unbind: function (el) {
        document.removeEventListener("click", el.__vueClickOutside__);
        el.__vueClickOutside__ = null;
      },
    },
  },
  beforeMount() {
    this.getUserName();
  },
  components: {
    draggable,
  },
};
</script>
