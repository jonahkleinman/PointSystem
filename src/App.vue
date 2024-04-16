<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
</style>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { onMounted, ref } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"
import router from './router'

const isLoggedIn = ref(false)
const isAdmin = ref(false)

let auth;
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      isAdmin.value = user.uid === 'DB9ljAWIxZUaHSKoVL8jbYao4u32';
    } else {
      isLoggedIn.value = false;
      isAdmin.value = false;
    }
  })
})

const handleSignOut = () => {
  signOut(auth).then(() => {
    isLoggedIn.value = false;
    isAdmin.value = false;
    router.push('/')
  })
}
defineExpose({ handleSignOut })
</script>


<template>
  <div id="app" class="min-h-screen bg-gray-800 text-white">
    <Header :isLoggedIn="isLoggedIn" :is-admin="isAdmin" :handleSignOut="handleSignOut" />
    <router-view/>
    <Footer />
  </div>
</template>