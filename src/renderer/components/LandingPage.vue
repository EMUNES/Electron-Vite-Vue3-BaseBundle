<template>
  <div class="flex py-3 items-center justify-between pt-5 w-4/5 m-auto">
    <div class="flex items-center justify-center ml-10">
      <button @click="requestData(true, false)">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>

    <div class="flex items-center justify-between bg-white rounded-md">
      <input class="focus:outline-none px-3" @keydown.enter="onSearch"
      type="text" v-model="keyword">

      <button @click="onSearch">
        <svg
        xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  </div>

  <div class="w-4/5 m-auto my-3">
    <table class="w-full table-fixed text-center max-w-5xl" v-if="searchResults.length">
      <thead>
        <tr class="text-xl">
          <th>News</th>
          <th>Description</th>
        </tr>
      </thead>
      
      <tbody>
        <tr v-for="result in searchResults" v-bind:key="result">
          <td class="w-1/3 max-w-xs py-6 px-10 align-center">
            <img class="max-h-80"
            :src="result.urlToImage" alt="Image Unfound">
            <a class="text-blue-500" :href="result.url">{{ result.title }} {{ formatFime(result.publishedAt) }}</a>
          </td>
          
          <td class="py-6 align-center">{{ result.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from '@vue/reactivity'
import { onBeforeMount, onMounted } from '@vue/runtime-core'
import axios from 'axios'
import { useStore } from 'vuex'

const store = useStore()

const keyword = ref('') // Search keyword.
const searchResults = ref([]) // Search results: list of objects (each about a news info).
// Values of those keywords can be null or empty.
// author
// content
// description
// publishedAt
// source ({id, name})
// title
// url
// urlToImage

const baseUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${store.state.newsapi}`
// TODO: rewrite local storage system. Use IndexDB for structured data.
const storage = window.localStorage
const localData = JSON.parse(storage.getItem('defaultNews'))

const formatFime = (dateStr) => {
  return dateStr.split('T')[0].replaceAll('-', '.')
}

const onSearch = () => {
  // Get url for API request.
  if (keyword.value) {
    const SearchUrl = `https://newsapi.org/v2/everything?q=${keyword.value}&sortBy=popularity&apiKey=${store.state.newsapi}`
    // Get search results.
    axios.get(SearchUrl)
      .then((res) => {
        searchResults.value = res.data.articles
      })
        .catch((err) => {
          console.log(err)
        })
  }
}

const requestData = (store = false, clear = false) => {
  axios.get(baseUrl)
    .then((res) => {
      searchResults.value = res.data.articles
      
      if (clear) {
        // Clear the data by setting 0 length data.
        storage.setItem('defaultNews', '{}')
      }

      if (store) {
        // Store news in local storage.
        storage.setItem('defaultNews', JSON.stringify(res.data.articles))
      }

    })
      .catch((err) => {
        console.log(err)
        searchResults.value = ['Unable to fetch source data. Please chech your network connection.']
      })
}

onMounted(() => {
  if (localData) {
    if (!localData.length) {
      // Data corruption, clear and request data.
      requestData(true, true)
    } 
    else {
      // Already has, just read.
      searchResults.value = localData
    }
  }
  else {
    // Request and store news in local storage if there is null.
    requestData(true)
  }
}

)
</script>