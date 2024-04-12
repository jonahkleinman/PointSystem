<template>
  <div class="flex flex-col items-center justify-center bg-gray-900 min-h-screen">
    <form @submit.prevent="submitPoints" class="bg-white text-gray-900 p-6 rounded shadow-md">
      <div class="mb-4">
        <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Select your name:</label>
        <select id="name" v-model="selectedname" @change="updateMembers" class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
          <option disabled value="">Please select one</option>
          <option v-for="name in names" :key="name" :value="name">{{ name }}</option>
        </select>
      </div>
      <div class="mb-4">
              <label for="points" class="block text-gray-700 text-sm font-bold mb-2">Points:</label>
              <input type="number" id="points" v-model="points" placeholder="Points" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" min="0" max="3">
            </div>
            <div class="mb-4">
              <label for="reason" class="block text-gray-700 text-sm font-bold mb-2">Reason:</label>
              <textarea id="reason" v-model="reason" placeholder="Reason" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"></textarea>
            </div>
            <div class="flex justify-center">
              <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit for Approval</button>
            </div>
          </form>
        </div>
      </template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
  import db from '../main.js'

  const selectedname = ref('')
  const names = ref([])
  const selectednameMembers = ref([])

  const fetchnamesAndMembers = async () => {
    const membersSnapshot = await getDocs(collection(db, 'members'))
    membersSnapshot.forEach(async memberDoc => {
    })
  }

  onMounted(() => {
    fetchnamesAndMembers()
  })

  const updateMembers = () => {
    selectednameMembers.value = members.value[selectedname.value] || []
  }

  const submitPoints = () => {
    //TODO: add submit logic here
  }
</script>
