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

  const isLoggedIn = ref(false)

  let auth;
  onMounted(() => {
    auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        isLoggedIn.value = true;
      } else {
        isLoggedIn.value = false;
      }
    })
  })

  const handleSignOut = () => {
    signOut(auth).then(() => {
      router.push('/')
    })
  }
  defineExpose({ handleSignOut })
</script>


<template>
  <div id="app" class="min-h-screen bg-gray-800 text-white">
    <Header :isLoggedIn="isLoggedIn" :handleSignOut="handleSignOut" />
    <router-view/>
    <Footer />
  </div>
</template>