<template>
  <div class="bg-gray-900 flex flex-wrap items-center justify-center p-10 gap-10" style="height: 86vh;">
    <div v-for="house in housesWithTotal" :key="house.id" class="w-1/3 p-5">
      <div class="bg-white rounded-lg shadow-lg p-5 text-gray-600">
        <h2 class="text-xl font-bold mb-4 text-gray-600">{{ house.name }} ({{ house.totalPoints }} pts)</h2>
        <ul>
          <li v-for="member in house.members" :key="member.key" class="group">
            <div class="flex justify-between items-center p-2">
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
        ...house, // copies properties of the current house object using the sprwad operastor
        totalPoints: house.members.reduce((sum, member) => sum + member.points, 0),
      }));
    },
  },
  async created() { //lifecycle
    const houseNames = { a: 'Academic', i: 'Integrity', k: 'Kindness', r: 'Respect' }; //obj w house names
    const membersCollectionRef = collection(db, 'members');
    const membersSnapshot = await getDocs(membersCollectionRef);
    const housesData = {};

    Object.keys(houseNames).forEach(code => {
      housesData[code] = { id: code, name: houseNames[code], members: [], totalPoints: 0 };
    });

    membersSnapshot.forEach((doc, index) => {
      let memberData = doc.data();
      let houseCode = memberData.house;
      let memberName = doc.id;
      let memberPoints = memberData.points;

      if (housesData[houseCode]) { // if house exists
        housesData[houseCode].members.push({ //add new member to array
          key: index,
          name: memberName,
          points: memberPoints,
        });
        housesData[houseCode].totalPoints += memberPoints; // update points
      }
    });

    this.houses = Object.values(housesData);
  },
};
</script>