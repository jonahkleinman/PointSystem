import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import AddPoint from '@/views/AddPoint.vue'
import TeacherDashboard from '@/views/TeacherDashboard.vue'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { onMounted, ref } from 'vue'

const isLoggedIn = ref(false)

let auth;
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  })
})
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/add',
    name: 'Add',
    component: AddPoint,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: TeacherDashboard,
    meta: {
      requiresAuth: true,
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
  if (getAuth().currentUser) {
    next();
  } else {
    next('/')
  }
  } else {
    next();
  }
})

export default router