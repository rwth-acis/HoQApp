import Vue from 'vue'
import Router from 'vue-router'
import VueRouter from 'vue-router'
import HomeComponent from '@/views/HomeComponent'
import ProjectsComponent from '@/components/ProjectsComponent'
import CategoriesComponent from '@/components/CategoriesComponent'
import HoqComponent from '@/components/HoqComponent'
import MyHoqComponent from '@/components/MyHoqComponent'
import PageNotFoundComponent from '@/views/PageNotFoundComponent'
import mainAuth from '../auth';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeComponent
    },
    {
      path: '/projects',
      name: 'Projects',
      component: ProjectsComponent
    },
    {
      path: '/categories/:projectId',
      name: 'Categories',
      component: CategoriesComponent
    },
    {
      path: '/hoq/:categoryId',
      name: 'Hoq',
      component: HoqComponent
    },
    {
      path: '/my-projects/',
      name: 'MyProjects',
      component: MyHoqComponent
    },
    {
      path: '/login',
      name: 'Login',
      meta: {
        authName: mainAuth.authName
      },
      component: () => import('../views/LoginComponent.vue')
    },
    {
      path: '*',
      name: 'PageNotFoundComponent',
      component: PageNotFoundComponent
    }
  ]
});

mainAuth.useRouter(router);

export default router;




// export default new Router({
  //   routes: [
    //     {
      //       path: '/projects',
      //       name: 'ProjectsComponent',
      //       component: ProjectsComponent
      //     },
      //     {
        //       path: '/categories/:projectId',
        //       name: 'CategoriesComponent',
        //       component: CategoriesComponent
        //     },
        //     {
          //       path: '/hoq/:categoryId',
          //       name: 'HoqComponent',
          //       component: HoqComponent
          //     },
          //     {
            //       path: '/secret',
            //       name: 'secret-route',
            //       meta: {
              //         authName: mainOidc.authName
              //       },
              //     }
              //   ]
              // })

// Vue.use(VueRouter)

// const routes = [
//   {
//     path: '/projects',
//     name: 'ProjectsComponent',
//     component: ProjectsComponent
//   },
//   {
//     path: '/categories/:projectId',
//     name: 'CategoriesComponent',
//     component: CategoriesComponent
//   },
//   {
//     path: '/hoq/:categoryId',
//     name: 'HoqComponent',
//     component: HoqComponent
//   },
//   // {
//   //   path: '/about',
//   //   name: 'About',
//   //   // route level code-splitting
//   //   // this generates a separate chunk (about.[hash].js) for this route
//   //   // which is lazy-loaded when the route is visited.
//   //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
//   // }
// ]
//
// const router = new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes
// })
//
// export default router
