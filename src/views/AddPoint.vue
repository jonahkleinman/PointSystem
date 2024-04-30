<template>
  <div class="flex flex-col items-center justify-center bg-gray-900" style="height: 85vh">
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
        <input type="number" id="points" v-model="points" placeholder="Points" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" min="0" max="5">
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
import { ref, onMounted } from 'vue';
import { collection, getDocs, query, where, addDoc, doc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Swal from 'sweetalert2'
import db from '../main.js';
import router from '../router'

const members = ref([]);
const selectedName = ref('');
const points = ref(0);
const reason = ref('');
const existingDocRef = ref(null);
const showModal = ref(false);
const userEmail = ref(null);
let auth;

const fetchMembers = async () => {
  const membersSnapshot = await getDocs(collection(db, 'members'));
  members.value = membersSnapshot.docs.map(doc => doc.id);
};

const checkExistingSubmission = async (email) => {
  const q = query(collection(db, 'pending'), where('userEmail', '==', email), where('status', '==', 'pending'));
  const querySnapshot = await getDocs(q);
  if (querySnapshot && !querySnapshot.empty) {
    existingDocRef.value = querySnapshot.docs.find(doc => {
      return doc.data().timestamp.toDate().setHours(0,0,0,0) === new Date().setHours(0,0,0,0);
    });
  }
};

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      userEmail.value = user.email;
      await fetchMembers();
      const emailParts = userEmail.value.split('@')[0];
      const lastName = emailParts.substring(1);
      const formattedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
      selectedName.value = members.value.find(name => name === formattedLastName) || '';
      await checkExistingSubmission(userEmail.value);
    }
  });
});

const submitPoints = async () => {
  if (!selectedName.value || points.value <= 0 || !reason.value) {
    Swal.fire('Incomplete Fields', 'Please fill in all fields.', 'error');
    return;
  }

  try {
    if (existingDocRef.value) {
      const currentData = existingDocRef.value.data();
      const updatedPoints = currentData.points + points.value;
      const updatedReason = `${currentData.reason}, ${points.value} for ${reason.value}`;

      await updateDoc(doc(db, 'pending', existingDocRef.value.id), {
        points: updatedPoints,
        reason: updatedReason,
        timestamp: new Date()
      });
      Swal.fire('Updated!', 'Your points request has been updated with the new submission.', 'success');
    } else {
      await addDoc(collection(db, 'pending'), {
        memberId: selectedName.value,
        points: points.value,
        reason: `${points.value} for ${reason.value}`,
        status: 'pending',
        timestamp: new Date(),
        userEmail: userEmail.value
      });
      Swal.fire('Submitted!', 'Your points request has been submitted for approval.', 'success');
    }
    router.push('/pending');
  } catch (error) {
    Swal.fire('Error', 'There was a problem processing your request.', 'error');
  }
};
</script>

<style scoped>
</style>
