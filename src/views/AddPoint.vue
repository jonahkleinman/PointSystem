<template>
  <div class="flex flex-col items-center justify-center bg-gray-900" style="height: 86vh;">
    <h1 class="text-4xl font-bold text-white mb-6">Welcome to the House Point System!</h1>
    <button @click="showForm = true" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">Add Points</button>
    <form v-if="showForm" @submit.prevent="submitPoints" class="bg-white text-gray-900 p-6 rounded shadow-lg">
      <div class="mb-4">
        <input type="text" v-model="initials" placeholder="Your Initials" class="mb-2">
      </div>
      <div class="mb-4">
        <input type="number" v-model="points" placeholder="Points" class="mb-2">
      </div>
      <div class="mb-4">
        <textarea v-model="reason" placeholder="Reason" class="mb-2"></textarea>
      </div>
      <div class="flex justify-center">
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
      </div>
    </form>
  </div>
</template>
