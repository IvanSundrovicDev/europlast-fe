import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: '/',
    routes: [
      {
    // =============================================================================
    // MAIN LAYOUT ROUTES
    // =============================================================================
        path: '/',
        component: () => import('@/layouts/main/Main.vue'),
        children: [
      // =============================================================================
      // Theme Routes
      // =============================================================================
          {
            path: '/',
            name: 'kalendar',
            component: () => import('@/views/admin/calendar.vue'),
          },
          {
            path: '/profil/novi',
            name: 'novi profil',
            component: () => import('@/views/admin/profile/add-profile.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/profil/edit',
            name: 'profil edit',
            component: () => import('@/views/admin/profile/profile-edit.vue'),
          },
          {
            path: '/nalozi/novi/:id',
            name: 'novi nalog',
            component: () => import('@/views/admin/nalozi/add-nalog.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/nalozi/pregled',
            name: 'pregled naloga',
            component: () => import('@/views/admin/nalozi/nalozi-overview.vue'),
          },
          {
            path: '/nalozi/pregled/:id',
            name: 'pregled naloga po id',
            component: () => import('@/views/admin/nalozi/nalozi-edit.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/narudzbe/nova',
            name: 'nova-narudzba',
            component: () => import('@/views/admin/order/new-order.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/narudzbe/pregled',
            name: 'pregled narudzbi',
            component: () => import('@/views/admin/order/order-overview.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/narudzbe/pregled/:id',
            name: 'pregled narudzbi po id',
            component: () => import('@/views/admin/order/order-by-id.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/reklamacije/pregled',
            name: 'pregled reklamacija',
            component: () => import('@/views/admin/reclamations/reclamation-overview.vue'),
          },
          {
            path: '/reklamacije/nova',
            name: 'nova reklamacija',
            component: () => import('@/views/admin/reclamations/new-reclamation.vue'),
          },
            {
                path: '/povratnice/pregled',
                name: 'pregled povratnica',
                component: () => import('@/views/admin/reclamations/povratnice-overview'),
            },
          {
            path: '/papirici',
            name: 'pregled narudzbi',
            component: () => import('@/views/admin/order/papirici.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/pozicije/pregled',
            name: 'pregled pozicija',
            component: () => import('@/views/admin/positions/positions-overview.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/pozicije/pregled/:id',
            name: 'pregled pozicije',
            component: () => import('@/views/admin/positions/position-overview.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/pozicije/nova',
            name: 'nova pozicija',
            component: () => import('@/views/admin/positions/new-position.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/materijali/novi',
            name: 'novi materijal',
            component: () => import('@/views/admin/materials/add-material.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/materijali/pregled',
            name: 'pregled materijala',
            component: () => import('@/views/admin/materials/materials-overview.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/materijali/pregled/:id',
            name: 'pregled pojedinacnog materijala',
            component: () => import('@/views/admin/materials/material-overview.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/isporuke/pregled',
            name: 'pregled isporuka',
            component: () => import('@/views/admin/delivery/deliveries-overview.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/isporuke/nova',
            name: 'nova isporuka',
            component: () => import('@/views/admin/delivery/new-delivery.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/zaposlenici/pregled',
            name: 'popis zaposlenika',
            component: () => import('@/views/admin/employee/employee-list.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/zaposlenici/uredi/:id',
            name: 'uredi zaposlenika',
            component: () => import('@/views/admin/employee/employee-edit.vue'),
              meta: { requiresAdmin: true }
          },
            {
                path: '/zaposlenici/aktivnosti/:id',
                name: 'aktivnost zaposlenika',
                component: () => import('@/views/admin/employee/employee-activity'),
                meta: { requiresAdmin: true }
            },
          {
            path: '/zaposlenici/dodaj',
            name: 'dodaj zaposlenika',
            component: () => import('@/views/admin/employee/add-employee.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/zaposlenici/barkodovi',
            name: 'barkodovi zaposlenika',
            component: () => import('@/views/admin/employee/employee-barcode.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/zaposlenici/nedovrsene-operacije',
            name: 'nedovrsene operacije',
            component: () => import('@/views/admin/employee/unfinished-operations.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/strojevi/pregled',
            name: 'pregled strojeva',
            component: () => import('@/views/admin/machine/machines-overview.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/strojevi/uredi/:id',
            name: 'uredi stroj',
            component: () => import('@/views/admin/machine/edit-machine.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/strojevi/dodaj',
            name: 'dodaj stroj',
            component: () => import('@/views/admin/machine/add-machine.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/strojevi/barkodovi',
            name: 'barkodovi strojeva',
            component: () => import('@/views/admin/machine/machine-barcode.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/kooperanti/pregled',
            name: 'pregled kupcaca',
            component: () => import('@/views/admin/buyers/buyers.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/kooperanti/novi',
            name: 'dodaj kupca',
            component: () => import('@/views/admin/buyers/add-buyer.vue'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/kooperanti/uredi/:id',
            name: 'uredi kupca',
            component: () => import('@/views/admin/buyers/edit-buyer.vue'),
              meta: { requiresAdmin: true }
          },
          {
              path: '/kontakt_forma',
              name: 'uredi kupca',
              component: () => import('@/views/admin/contactForm/contact-form'),
              meta: { requiresAdmin: true }
          },
          {
              path: '/changelog',
              name: 'changelog',
              component: () => import('@/views/admin/changelog'),
              meta: { requiresAdmin: true }
          },
          {
            path: '/cijene',
            name: 'cijene',
            component: () => import('@/views/admin/cijene'),
            meta: { requiresAdmin: true }
        }
        ],
      },
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
      {
        path: '',
        component: () => import('@/layouts/full-page/FullPage.vue'),
        children: [
      // =============================================================================
      // PAGES
      // =============================================================================
          {
            path: '/login',
            name: 'pageLogin',
            component: () => import('@/views/pages/Login.vue')
          },
          {
            path: '/greska',
            name: 'pageError404',
            component: () => import('@/views/pages/Error404.vue')
          },
        ]
      },
      // Redirect to 404 page, if no match found
      {
        path: '*',
        redirect: '/greska'
      }
    ],
})

router.beforeEach((to, from, next) => {
    let loggedIn = !!localStorage.user;

  if(loggedIn || to.path === '/login') {
      next()
    } else {
      localStorage.clear()
        next('/login')
  }

  if (localStorage.user) {
      let user = JSON.parse(localStorage.user)

      if(to.meta.requiresAdmin) {
          if(user.role === 'administrator') {
              next()
          } else {
              next('/greska')
          }
      }
  }
})

export default router