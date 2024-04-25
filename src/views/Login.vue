<template>
  <div class="flex items-center justify-center bg-gray-900" style="height: 87vh;">
    <div class="w-full max-w-xs">
      <h1 class="mb-8 text-4xl text-center text-white">Log in</h1>
      <div class="bg-gray-900 shadow-2xl rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Email" v-model="email" />
        </div>
        <div class="mb-6">
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="Password" v-model="password" />
          <p class="text-red-500 text-xs italic" v-if="errMsg">{{ errMsg }}</p>
        </div>
        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" @click="login">
            Log in
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
  import { ref } from 'vue'
  import Swal from 'sweetalert2'
  import { signInWithEmailAndPassword, getAuth} from "firebase/auth";
  import { useRouter } from 'vue-router'
 
  const email = ref('')
  const password = ref('')
  const errMsg = ref('')
  const router = useRouter()
  
  const login = () => {
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
      .then((data) => {
        router.push('/')
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Signed in successfully"
        });
    })
      .catch((error) => {
    switch (error.code) {
      case 'auth/invalid-email':
        errMsg.value = 'Invalid email'
        break;
      case "auth/user-not-found":
        errMsg.value = 'User not found'
        break;
      case "auth/wrong-password":
        errMsg.value = 'Wrong password'
        break;
      default:
        errMsg.value = 'Email or password was incorrect'
        break;
    }
    })
  }
      </script>