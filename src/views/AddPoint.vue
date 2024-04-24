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
  <div v-if="showModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
    <div class="bg-white p-4 rounded">
      <p class="text-black">You already have a pending points submission. Instead of submitting a new one, please edit this one. Do not remove your original point reason, just add the new one as well.</p>
      <div class="flex justify-between mt-4">
        <button @click="editExistingSubmission" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit</button>
      </div>
    </div>
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
    const existingDoc = querySnapshot.docs[0];
    const existingTimestamp = existingDoc.data().timestamp.toDate();
    const today = new Date();
    if (existingTimestamp.setHours(0,0,0,0) === today.setHours(0,0,0,0)) {
      existingDocRef.value = existingDoc;
      Swal.fire({
        title: 'Existing Submission Found!',
        text: 'You already have a pending points submission from today. Instead of submitting a new one, please your old one. Do not remove your original point reason, just add the new one as well.',
        icon: 'info',
        showCancelButton: false,
        confirmButtonText: 'Edit Submission',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          editExistingSubmission();
        } else {
          closeModal();
        }
      });
    }
  }
};

const editExistingSubmission = () => {
  points.value = existingDocRef.value.data().points;
  reason.value = existingDocRef.value.data().reason;
  closeModal();
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

const closeModal = () => {
  showModal.value = false;
};

const submitPoints = async () => {
  if (!selectedName.value || points.value <= 0 || !reason.value) {
    Swal.fire('Incomplete Fields', 'Please fill in all fields.', 'error');
    return;
  }

  try {
    if (existingDocRef.value) {
      await updateDoc(doc(db, 'pending', existingDocRef.value.id), {
        points: points.value,
        reason: reason.value,
        timestamp: new Date()
      });
      Swal.fire({
        title: 'Saved!',
        text: 'Your edited points request has been resubmitted for approval.',
        icon: 'success',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
      });
      closeModal();
      resetForm();
      router.push('/pending');
    } else {
      await addDoc(collection(db, 'pending'), {
        memberId: selectedName.value,
        points: points.value,
        reason: reason.value,
        status: 'pending',
        timestamp: new Date(),
        userEmail: userEmail.value
      });
      Swal.fire({
        title: 'Submitted!',
        text: 'Your points request has been submitted for approval.',
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      resetForm();
      router.push('/pending');
    }
  } catch (error) {
    Swal.fire('Error', 'There was a problem processing your request.', 'error');
  }
};

const resetForm = () => {
  selectedName.value = '';
  points.value = 0;
  reason.value = '';
  existingDocRef.value = null;
};
</script>


<style scoped>
</style>
