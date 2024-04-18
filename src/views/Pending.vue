<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Pending Points Requests</h1>
    <div class="mb-6">
      <input type="text" v-model="searchName" placeholder="Filter by student name" class="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
    </div>
    <div class="space-y-4">
      <div v-for="request in filteredRequests" :key="request.id" class="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
        <div>
          <h2 class="font-semibold text-lg text-gray-800">{{ request.memberId }}</h2>
          <p class="text-gray-600">Points: {{ request.points }}</p>
          <p class="text-gray-600">Reason: {{ request.reason }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from '../main.js';
import { collection, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      pendingRequests: [],
      searchName: '',
    };
  },
  computed: {
    filteredRequests() {
      let requests = this.pendingRequests;
      if (this.searchName) {
        requests = requests.filter(request =>
          request.memberId && request.memberId.toLowerCase().includes(this.searchName.toLowerCase())
        );
      }
      return requests;
    },
  },
  async created() {
    await this.fetchRequests();
  },
  methods: {
    async fetchRequests() {
      try {
        const querySnapshot = await getDocs(collection(db, 'pending'));
        this.pendingRequests = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === 'pending') {
            this.pendingRequests.push({ id: doc.id, ...data });
          }
        });
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    },
  },
};
</script>
