<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Pending Points</h1>
    <div class="space-y-3">
      <div v-for="request in pendingRequests" :key="request.id" class="p-4 border rounded shadow-sm">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="font-semibold">{{ request.memberId }}</h2>
            <p>Points: {{ request.points }}</p>
            <p>Reason: {{ request.reason }}</p>
          </div>
          <div>
            <button @click="approveRequest(request.id)" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Approve</button>
            <button @click="denyRequest(request.id)" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-2">Deny</button>
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
    };
  },
  async created() {
    await this.fetchPendingRequests();
  },
  methods: {
    async fetchPendingRequests() {
      console.log('Fetching pending requests...');
      try {
        const querySnapshot = await getDocs(collection(db, 'pending'));
        this.pendingRequests = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === 'pending') {
            console.log('Document data:', data);
            this.pendingRequests.push({ id: doc.id, ...data });
          }
        });
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
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
        console.log('Transaction successfully committed!');
        this.fetchPendingRequests();
      } catch (e) {
        console.error("Transaction failed: ", e);
      }
    },
    async denyRequest(requestId) {
      const requestRef = doc(db, 'pending', requestId);
      await updateDoc(requestRef, {
        status: 'denied',
      });
      this.fetchPendingRequests();
    },
  },
};
</script>

<style scoped>
</style>
