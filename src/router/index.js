import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import AddPoint from '@/views/AddPoint.vue'
import TeacherDashboard from '@/views/TeacherDashboard.vue'

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
    component: AddPoint
  },
  {
    path: '/admin',
    name: 'Admin',
    component: TeacherDashboard
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router