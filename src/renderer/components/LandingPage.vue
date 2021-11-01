<template>
  <div class="flex py-3 items-center pt-5 w-4/5 m-auto">
    <input class="w-full px-2 rounded-md focus:outline-none" 
    type="text" v-model="keyword">

    <button class="px-3"
    @click="onSearch">
      Search
    </button>
  </div>

  <div class="w-full my-3 px-5">
    <table class="w-full table-fixed text-left max-w-4xl" v-if="searchResults.length">
      <colgroup>
        <col class="w-1/3">
        <col class="w-1/5">
        <col>
      </colgroup>

      <thead>
        <tr>
          <th>Image Title</th>
          <th>Source</th>
          <th>Description</th>
        </tr>
      </thead>
      
      <tbody>
        <tr v-for="result in searchResults" v-bind:key="result">
          <td class="py-6 align-center">
            <img class="w-4/5 max-w-xs max-h-80 pl-5"
            :src="result.urlToImage" alt="Image Unfound">
            <a class="text-blue-500" :href="result.url">{{ result.title }}</a>
          </td>

          <td class="py-6 px-3 align-center">{{ result.author }} {{ formatFime(result.publishedAt) }}</td>
          
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
        console.log(res)
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

      console.log(res.data.articles)
      console.log(storage.getItem('defaultNews'))
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
      console.log(localData)
      searchResults.value = localData
      console.log(searchResults.value)
    }
  }
  else {
    // Request and store news in local storage if there is null.
    requestData(true)
  }
}

)
</script>