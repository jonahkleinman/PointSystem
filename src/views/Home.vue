<template>
  <div class="bg-gray-900 flex flex-wrap items-center justify-center p-10 gap-10" style="height: 86vh;">
    <div v-for="house in housesWithTotal" :key="house.id" class="w-1/3 p-5">
      <div class="bg-white rounded-lg shadow-lg p-5 text-gray-600">
        <h2 class="text-xl font-bold mb-4 text-gray-600">{{ house.name }} ({{ house.totalPoints }} pts)</h2>
        <ul>
          <li v-for="member in house.members" :key="member.id" class="group">
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
export default {
  name: 'Home',
  data() {
    return {
      houses: [
        //TODO: Add db houses logic
      ],
          };
        },
        computed: {
          housesWithTotal() {
            return this.houses.map(house => ({
              ...house,
              totalPoints: house.members.reduce((sum, member) => sum + member.points, 0)
            }));
          }
        },
      };
</script>

<style>
</style>
