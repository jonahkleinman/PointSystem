<template>
  <div class="bg-gray-900 text-white">
    <nav class="flex justify-between items-center p-4">
      <div class="flex space-x-4">
        <router-link to="/" class="hover:text-blue-400 transition duration-300 ease-in-out">Home</router-link>
        <router-link to="/add" v-if='isLoggedIn' class="hover:text-blue-400 transition duration-300 ease-in-out">Add Points</router-link>
        <router-link to="/pending" class="hover:text-blue-400 transition duration-300 ease-in-out">Pending</router-link>
        <router-link to="/login" v-if='!isLoggedIn' class="hover:text-blue-400 transition duration-300 ease-in-out">Login</router-link>
        <router-link to="/admin" v-if="isAdmin" class="hover:text-blue-400 transition duration-300 ease-in-out">Admin</router-link>
      </div>
      <button @click="handleSignOut" v-if='isLoggedIn' class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">Sign Out</button>
    </nav> 
  </div>
</template>

<script>
  export default {
    name: 'Header',
    props: ['isLoggedIn', 'isAdmin', 'handleSignOut']
  }
</script>