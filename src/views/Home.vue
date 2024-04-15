<template>
  <div class="bg-gray-900 flex flex-col items-center justify-center p-10 gap-10">
    <!-- Removed button element -->
    <div class="flex flex-row flex-wrap justify-center w-full">
      <div v-for="house in housesWithTotal" :key="house.id" class="w-1/3 p-5">
        <div :class="['rounded-lg shadow-lg p-5', getHouseColor(house.name), 'text-gray-600']">
          <h2 class="text-xl font-bold mb-4">{{ house.name }} ({{ house.totalPoints }} pts)</h2>
          <ul>
            <li v-for="member in house.members" :key="member.key" class="group">
              <div class="flex justify-between items-center p-2">
                <span class="font-medium">{{ member.name }}</span>
                <span class="text-sm font-semibold">{{ member.points }} pts</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <hr class="border-t border-gray-700 w-full">
    <div class="w-full max-w-lg mx-auto">
      <canvas id="pointsGraph" class="w-full h-auto"></canvas>
    </div>
  </div>
</template>

<script>
import { collection, getDocs } from 'firebase/firestore';
import db from '../main.js';
import Chart from 'chart.js/auto';

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
  methods: {
    getHouseColor(houseName) {
      const colors = {
        'Academic': 'bg-blue-300',
        'Kindness': 'bg-red-300',
        'Integrity': 'bg-orange-300',
        'Respect': 'bg-gray-300'
      };
      return colors[houseName] || 'bg-white';
    },
    createGraph() {
      const ctx = document.getElementById('pointsGraph').getContext('2d');
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.housesWithTotal.map(house => house.name),
          datasets: [{
            label: 'Total Points',
            data: this.housesWithTotal.map(house => house.totalPoints),
            backgroundColor: this.housesWithTotal.map(house => {
              switch (house.name) {
                case 'Academic':
                  return '#63b3ed';
                case 'Kindness':
                  return '#fc8181';
                case 'Integrity':
                  return '#f6ad55';
                case 'Respect':
                  return '#e2e8f0';
                default:
                  return '#ffffff';
              }
            }),
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
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
    this.$nextTick(() => {
      this.createGraph();
    });

  },
};
</script>