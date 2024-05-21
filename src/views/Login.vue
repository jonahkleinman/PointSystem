<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-20 w-auto" src="https://blatantteamstore.com/cdn/shop/collections/2023_Collegiate_School_Logo_1_A1.1.png?v=1679941599&width=1024" alt="Collegiate">
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight indigo-400">Sign in to your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="login">
        <div>
          <label for="email" class="block text-sm font-medium leading-6">Email address</label>
          <div class="mt-2">
            <input id="email" v-model="email" type="email" autocomplete="email" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 ">
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6">Password</label>
          </div>
          <div class="mt-2">
            <input id="password" v-model="password" type="password" autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6">
          </div>
        </div>

        <div>
          <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import Swal from 'sweetalert2'
  import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
  import { useRouter } from 'vue-router'

  const email = ref('')
  const password = ref('')
  const errMsg = ref('')
  const router = useRouter()

  const login = () => {
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
      .then(() => {
        router.push('/')
        showNotification("success", "Signed in successfully");
      })
      .catch((error) => {
        handleAuthError(error.code);
      })
  }

  const showNotification = (icon, title) => {
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
      icon: icon,
      title: title
    });
  }

  const handleAuthError = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-disabled':
        showNotification("error", "Your account has been disabled.");
        break;
      case 'auth/invalid-email':
        showNotification("error", "Invalid email.");
        break;
      case "auth/user-not-found":
        showNotification("error", "User not found.");
        break;
      case "auth/wrong-password":
        showNotification("error", "Wrong password.");
        break;
      default:
        showNotification("error", "Email or password was incorrect.");
        break;
    }
  }
</script>
