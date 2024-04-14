<template>
  <div class="flex flex-col items-center justify-center bg-gray-900 min-h-screen">
    <form @submit.prevent="submitPoints" class="bg-white text-gray-900 p-6 rounded shadow-md">
      <div class="mb-4">
        <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Select Your Name:</label>
        <select id="name" v-model="selectedName" class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
          <option disabled value="">Please select one</option>
          <option v-for="name in members" :key="name" :value="name">{{ name }}</option>
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
import {onMounted, ref} from 'vue';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import {getAuth, onAuthStateChanged} from "firebase/auth"
import db from '../main.js';

const members = ref([]);
const selectedName = ref('');
const points = ref(0);
const reason = ref('');

const fetchMembers = async () => {
  const membersSnapshot = await getDocs(collection(db, 'members'));
  membersSnapshot.forEach(memberDoc => {
    members.value.push(memberDoc.id);
  });
};

fetchMembers();
const userEmail = ref(null);
let auth;

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userEmail.value = user.email;
    }
  });
});
const submitPoints = async () => {
  if (!selectedName.value || points.value <= 0 || !reason.value) {
    alert('Please fill in all fields.');
    return;
  }

  try {
    const docRef = await addDoc(collection(db, 'pending'), {
      memberId: selectedName.value,
      points: points.value,
      reason: reason.value,
      status: 'pending',
      timestamp: new Date(),
      userEmail: userEmail.value
    });

    selectedName.value = '';
    points.value = 0;
    reason.value = '';
    alert('Your points request has been submitted for approval.');
  } catch (e) {
    console.error('Error adding document: ', e);
    alert('There was an error submitting your points request.');
  }
};
</script>

<style scoped>
</style>
