<template>
  <div class="p-4 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Requests</h1>
    <div class="flex flex-col md:flex-row md:items-center gap-4 mb-6">
      <select v-model="selectedStatus" class="block w-full md:w-auto form-select px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none">
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="denied">Denied</option>
        <option value="all">All</option>
      </select>
      <input type="text" v-model="searchName" placeholder="Filter by student name" class="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" />
    </div>
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div v-for="(house, code) in houses" :key="code" class="p-4 border border-gray-200 rounded-lg">
        <h3 class="font-semibold">{{ house.name }}</h3>
        <p>Total Points: {{ house.totalPoints }}</p>
      </div>
    </div>
    <div class="space-y-4">
      <div v-for="request in filteredRequests" :key="request.id" class="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="font-semibold text-lg text-gray-800">{{ request.memberId }}</h2>
            <p class="text-gray-600">Points: {{ request.points }}</p>
            <p class="text-gray-600">Reason: {{ request.reason }}</p>
          </div>
          <div v-if="selectedStatus === 'pending'">
            <button @click="approveRequest(request.id)" class="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Approve</button>
            <button @click="denyRequest(request.id)" class="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Deny</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from '../main.js';
import { collection, getDocs, updateDoc, doc, runTransaction } from 'firebase/firestore';

export default {
  data() {
    return {
      pendingRequests: [],
      approvedRequests: [],
      deniedRequests: [],
      selectedStatus: 'pending',
      searchName: '',
      houses: {},
    };
  },
  computed: {
    filteredRequests() {
      let requests = [];
      if (this.selectedStatus === 'all') {
        requests = [...this.pendingRequests, ...this.approvedRequests, ...this.deniedRequests];
      } else if (this.selectedStatus === 'pending') {
        requests = this.pendingRequests;
      } else if (this.selectedStatus === 'approved') {
        requests = this.approvedRequests;
      } else if (this.selectedStatus === 'denied') {
        requests = this.deniedRequests;
      }
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
        const membersSnapshot = await getDocs(collection(db, 'members'));
        this.calculateHousePoints(membersSnapshot);

        this.pendingRequests = [];
        this.approvedRequests = [];
        this.deniedRequests = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === 'pending') {
            this.pendingRequests.push({ id: doc.id, ...data });
          } else if (data.status === 'approved') {
            this.approvedRequests.push({ id: doc.id, ...data });
          } else if (data.status === 'denied') {
            this.deniedRequests.push({ id: doc.id, ...data });
          }
        });
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    },
    calculateHousePoints(membersSnapshot) {
      const houseNames = { a: 'Academic', i: 'Integrity', k: 'Kindness', r: 'Respect' };
      const challengePoints = { a: 10, i: 13, k: 15, r: 11 };
      let housesData = {};

      Object.keys(houseNames).forEach(code => {
        housesData[code] = {
          name: houseNames[code],
          totalPoints: challengePoints[code] || 0,
        };
      });

      membersSnapshot.forEach(doc => {
        let memberData = doc.data();
        let houseCode = memberData.house;
        if (housesData[houseCode]) {
          housesData[houseCode].totalPoints += memberData.points;
        }
      });

      this.houses = housesData;
    },
    async approveRequest(requestId) {
      const requestRef = doc(db, 'pending', requestId);
      try {
        await runTransaction(db, async (transaction) => {
          const requestDoc = await transaction.get(requestRef);
          if (!requestDoc.exists()) {
            throw "Document does not exist!";
          }
          const requestData = requestDoc.data();
          const memberRef = doc(db, 'members', requestData.memberId);

          const memberDoc = await transaction.get(memberRef);
          if (!memberDoc.exists()) {
            throw "Member document does not exist!";
          }
          const memberData = memberDoc.data();

          const newPoints = memberData.points + requestData.points;

          transaction.update(memberRef, { points: newPoints });

          transaction.update(requestRef, { status: 'approved' });
        });
        this.fetchRequests();
      } catch (e) {
        console.error("Transaction failed: ", e);
      }
    },
    async denyRequest(requestId) {
      const requestRef = doc(db, 'pending', requestId);
      await updateDoc(requestRef, {
        status: 'denied',
      });
      this.fetchRequests();
    },
  },
};
</script>

<style scoped>
</style>
