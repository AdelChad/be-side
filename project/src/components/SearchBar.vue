<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMagnifyingGlass, faCaretDown } from '@fortawesome/free-solid-svg-icons'
library.add(faMagnifyingGlass, faCaretDown)

const router = useRouter()
const searchText = ref('')
type PlaceType = 'activity' | 'restaurant'
const selectedType = ref<PlaceType>('activity')

const types: { label: string, value: PlaceType }[] = [
  { label: 'Activité', value: 'activity' },
  { label: 'Restaurant', value: 'restaurant' }
]

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const placeholderText = computed(() => {
  return selectedType.value === 'activity'
    ? 'Recherchez des activités...'
    : 'Recherchez des restaurants...'
})
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function selectType(type: 'activity' | 'restaurant') {
  selectedType.value = type
  dropdownOpen.value = false

}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as Node
  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    dropdownOpen.value = false
  }
}

function submitSearch() {
  const type = selectedType.value.toLowerCase()


  router.push({
    name: 'search-results',
    query: {
      search: searchText.value || '',
      type: type || '',
    }
  })
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>


<template>
  <div class="search-bar">
    <div class="dropdown" ref="dropdownRef">
      <button class="dropdown-btn" @click="toggleDropdown">
        {{types.find(t => t.value === selectedType)?.label}}
        <span class="arrow" :class="{ open: dropdownOpen }"><font-awesome-icon :icon="['fas', 'caret-down']" class="fa-plus-icon" /></span>
      </button>
      <ul v-if="dropdownOpen" class="dropdown-menu">
        <li v-for="typeOption in types" :key="typeOption.value" @click="selectType(typeOption.value)">
          {{ typeOption.label }}
        </li>
      </ul>
    </div>
    <input type="text" v-model="searchText" class="search-input" :placeholder="placeholderText"
      @keyup.enter="submitSearch" />
    <button class="search-btn" @click="submitSearch">
      <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="fa-plus-icon" />
    </button>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 999px;
  padding: 0.2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  gap: 0.5rem;
  width: 100%;
  max-width: 600px;
}

.dropdown {
  position: relative;
}

.dropdown-btn {
  background: transparent;
  border: none;
  font-weight: 500;
  cursor: pointer;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  transition: background 0.2s ease;
}

.dropdown-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.dropdown-menu {
  position: absolute;
  top: 110%;
  left: 0;
  background: white;
  color: black;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.dropdown-menu li {
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.dropdown-menu li:hover {
  background: #f0f0f0;
}

.arrow {
  margin-left: 0.5rem;
  transition: transform 0.2s;
}

.arrow.open {
  transform: rotate(180deg);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  padding: 0.5rem;
  font-size: 1rem;
  color: #333;
}

.search-btn {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.4rem;
  color: #333;
  margin-right:1rem;
}
</style>
