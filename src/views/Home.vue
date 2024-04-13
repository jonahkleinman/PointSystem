<template>
  <div class="bg-gray-900 flex flex-wrap items-center justify-center p-10 gap-10" style="height: 86vh;">
    <div v-for="house in housesWithTotal" :key="house.id" class="w-1/3 p-5">
      <div class="bg-white rounded-lg shadow-lg p-5 text-gray-600">
        <h2 class="text-xl font-bold mb-4 text-gray-600">{{ house.name }} ({{ house.totalPoints }} pts)</h2>
        <ul>
          <li v-for="member in house.members" :key="member.key" class="group">
            <div v-bind:class="{'flex justify-between items-center p-2': true, 'bg-blue-100': member.name === 'Challenges'}">
              <span class="font-medium">{{ member.name }}</span>
              <span class="text-sm font-semibold text-gray-600">{{ member.points }} pts</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs } from 'firebase/firestore';
import db from '../main.js';

export default {
  name: 'Home',
  data() {
    return {
      houses: [],
    };
  },
  computed: {
    housesWithTotal() {
      return this.houses.map(house => ({
        ...house,
        totalPoints: house.members.reduce((sum, member) => {
          return member.name === 'Challenges' ? sum : sum + member.points;
        }, 0) + house.challengePoints,
      }));
    },
  },
  async created() {
    const houseNames = { a: 'Academic', i: 'Integrity', k: 'Kindness', r: 'Respect' };
    const challengePoints = { a: 10, i: 3, k: 5, r: 1 };
    const membersCollectionRef = collection(db, 'members');
    const membersSnapshot = await getDocs(membersCollectionRef);
    const housesData = {};

    Object.keys(houseNames).forEach(code => {
      housesData[code] = {
        id: code,
        name: houseNames[code],
        members: [],
        totalPoints: 0,
        challengePoints: challengePoints[code] || 0,
      };

      housesData[code].members.push({
        key: `challenge-${code}`,
        name: 'Challenges',
        points: challengePoints[code] || 0,
      });
    });

    membersSnapshot.forEach((doc, index) => {
      let memberData = doc.data();
      let houseCode = memberData.house;
      let memberName = doc.id;
      let memberPoints = memberData.points;

      if (housesData[houseCode]) {
        housesData[houseCode].members.push({
          key: index,
          name: memberName,
          points: memberPoints,
        });
      }
    });

    this.houses = Object.values(housesData);
  },
};
</script>


