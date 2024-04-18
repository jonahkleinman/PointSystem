import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import AddPoint from '@/views/AddPoint.vue'
import Admin from '@/views/Admin.vue'
import Pending from '@/views/Pending.vue'
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
    component: Login,
    meta: {
      requiresUnauth: true,
    }
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
    path: '/pending',
    name: 'Pending',
    component: Pending,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: {
      requiresAuth: true,
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  await new Promise((resolve, reject) => {
    if (!auth) {
      auth = getAuth();
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      isLoggedIn.value = !!user;
      unsubscribe();
      resolve();
    }, reject);
  });

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isLoggedIn.value) {
      const userId = auth.currentUser?.uid;
      if (to.name === 'Admin') {
        if (userId === 'DB9ljAWIxZUaHSKoVL8jbYao4u32') {
          next();
        } else {
          next('/');
        }
      } else {
        next();
      }
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

export default router