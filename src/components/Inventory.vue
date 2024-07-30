<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { useInventoryStore } from '../store/inventory';
import '../style/main.scss'

const inventoryStore = useInventoryStore();
const items = inventoryStore.items;
const selectedItem = ref<number | null>(null);
const confirmDelete = ref(false);
const draggedItemIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);

const itemDetails = reactive({
  name: '',
  description: '',
  color: '',
  quantity: 1,
});

function selectItem(index: number) {
  selectedItem.value = index;
  confirmDelete.value = false;
  const item = items[index];
  if (item) {
    Object.assign(itemDetails, item);
    itemDetails.quantity = items.filter(i => i?.id === item.id).length;
  } else {
    itemDetails.name = '';
    itemDetails.description = '';
    itemDetails.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    itemDetails.quantity = 1;
  }
}

function addItem() {
  if (selectedItem.value !== null) {
    const item = items[selectedItem.value];
    if (item) {
      item.quantity += itemDetails.quantity;
    } else {
      const newItem = {
        ...itemDetails,
        id: selectedItem.value,
        quantity: itemDetails.quantity,
      };
      inventoryStore.addItem(newItem);
    }
    updateItemQuantity(selectedItem.value);
    selectedItem.value = null;
  }
}

function deleteItem() {
  if (selectedItem.value !== null) {
    const itemIndex = selectedItem.value;
    const quantityToRemove = itemDetails.quantity;
    const item = items[itemIndex];

    if (item && item.quantity > quantityToRemove) {
      item.quantity -= quantityToRemove;
      updateItemQuantity(item.id);
    } else {
      const itemIndexes = items
          .map((item, index) => (item?.id === itemIndex ? index : -1))
          .filter(index => index !== -1)
          .slice(0, quantityToRemove);

      itemIndexes.reverse().forEach(itemIndex => {
        inventoryStore.removeItem(itemIndex);
      });

      updateItemQuantity(itemIndex);
    }

    selectedItem.value = null;
    confirmDelete.value = false;
  }
}

function updateItemQuantity(id: number) {
  const itemCount = items.filter(i => i?.id === id).reduce((acc, item) => {
    if (item) {
      return acc + item.quantity;
    }
    return acc;
  }, 0);

  items.forEach(i => {
    if (i?.id === id && i) {
      i.quantity = itemCount;
    }
  });
}

function closeSidebar() {
  selectedItem.value = null;
  confirmDelete.value = false;
}

function toggleConfirmDelete() {
  confirmDelete.value = !confirmDelete.value;
}

function handleDragStart(index: number) {
  draggedItemIndex.value = index;
}

function handleDragEnd() {
  draggedItemIndex.value = null;
  dragOverIndex.value = null;
}

function handleDrop(index: number) {
  if (draggedItemIndex.value !== null && draggedItemIndex.value !== index) {
    const draggedItem = items[draggedItemIndex.value];
    items[draggedItemIndex.value] = items[index];
    items[index] = draggedItem;
  }
  handleDragEnd();
}

watch(items, (newItems, oldItems) => {
  if (newItems.length > oldItems.length) {
    const sidebarContent = document.querySelector('.input-scroll');
    if (sidebarContent) {
      setTimeout(() => {
        sidebarContent.scrollTop = sidebarContent.scrollHeight;
      }, 0);
    }
  }
}, { deep: true });
</script>

<template>
  <div class="inventory-wrapper">
    <div class="inventory">
      <div v-for="(item, index) in items" :key="index"
           class="inventory-slot"
           @click="selectItem(index)"
           @dragover.prevent
           @drop="handleDrop(index)"
           :class="{ 'drag-over': dragOverIndex === index }">
        <div v-if="item"
             class="inventory-item"
             :draggable="true"
             @dragstart="handleDragStart(index)"
             @dragend="handleDragEnd">
          <div class="color-box-wrapper">
            <div class="color-box" :style="{ backgroundColor: item.color }"></div>
            <div class="color-box blurred" :style="{ backgroundColor: item.color }"></div>
          </div>
          <span class="quantity">{{ item.quantity }}</span>
        </div>
      </div>
    </div>
    <div v-if="selectedItem !== null" class="sidebar">
      <div class="wrapper">
        <button @click="closeSidebar" class="close">
          <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303Z" fill="#ffffff"></path>
            </g>
          </svg>
        </button>
        <div class="content">
          <div class="color-box-wrapper">
            <div class="color-box" :style="{ backgroundColor: itemDetails.color }"></div>
            <div class="color-box blurred" :style="{ backgroundColor: itemDetails.color }"></div>
          </div>
          <div class="divider"></div>
          <div class="input-scroll">
            <input v-if="!items[selectedItem]?.id" v-model="itemDetails.name" placeholder="Название" required />
            <textarea v-if="!items[selectedItem]?.id" v-model="itemDetails.description" placeholder="Описание" required></textarea>
            <div class="text-scroll" v-else>
              <p class="scrollable-text">{{ itemDetails.name || 'Текст' }}</p>
              <p class="scrollable-text">{{ itemDetails.description || 'текст текст текст' }}</p>
            </div>
          </div>
        </div>
        <div class="bottom">
          <input v-model="itemDetails.quantity" type="number" placeholder="Введите количество" required />
          <button v-if="!confirmDelete && items[selectedItem]?.id" @click="toggleConfirmDelete">Удалить предмет</button>
          <div v-else-if="confirmDelete" class="confirm-buttons">
            <button @click="toggleConfirmDelete">Отмена</button>
            <button @click="deleteItem" class="default">Подтвердить</button>
          </div>
          <button v-if="!items[selectedItem]?.id" @click="addItem">Добавить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.inventory-wrapper {
  display: flex;
  flex: 1;
  position: relative;
}

.inventory {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  width: 100%;
  height: 100%;
}

.inventory-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.inventory-item {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
}

.color-box-wrapper {
  position: relative;
  width: 40px;
  height: 40px;

  .color-box {
    width: 100%;
    height: 100%;
    z-index: 1;
    position: relative;
  }

  .color-box.blurred {
    position: absolute;
    top: -5px;
    right: -5px;
    filter: blur(3px);
    opacity: 0.7;
    z-index: 2;
  }
}

.quantity {
  font-size: 12px;
  position: absolute;
  bottom: -1px;
  right: -1px;
  border-top-left-radius: 6px;
  background-color: transparent;
  padding: 2px 4px;
}

.sidebar {
  width: 250px;
  backdrop-filter: blur(10px);
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  z-index: 10;
  display: flex;
  flex-direction: column;

  .wrapper {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  .close {
    background: transparent;
    border: none;
    width: 100%;
    text-align: right;
    padding: 10px;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    width: 100%;
    overflow-y: auto;

    .color-box-wrapper {
      position: relative;
      width: 130px;
      height: 130px;
      margin: 20px 0;

      .color-box {
        width: 100%;
        height: 100%;
        z-index: 1;
        position: relative;
      }

      .color-box.blurred {
        position: absolute;
        top: -10px;
        right: -10px;
        filter: blur(5px);
        opacity: 0.7;
        z-index: 2;
      }
    }
  }

  .divider {
    width: 220px;
    margin-bottom: 16px;
  }

  .input-scroll {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
  }

  .input-scroll input,
  .input-scroll textarea {
    padding: 5px;
    width: 80%;
    border-radius: 8px;
    margin-bottom: 10px;
    background-color: transparent;
  }

  .input-scroll textarea {
    resize: none;
    height: 100px;
    overflow-y: auto;
  }

  .text-scroll {
    overflow-y: auto;
    max-height: 200px;
    width: 80%;
  }

  .scrollable-text {
    white-space: pre-wrap;
    word-wrap: break-word;
    width: 100%;
  }

  .bottom {
    position: sticky;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 10px;
    padding-top: 10px;

    input {
      width: 80%;
      padding: 12px;
      margin: 20px 0;
      background-color: transparent;
      border-radius: 8px;
    }

    button {
      margin-bottom: 20px;
      padding: 8px;
      text-align: center;
      background-color: #FA7272;
      color: white;
      border-radius: 8px;
      border: none;
    }

    .confirm-buttons {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      padding: 8px;

      button {
        flex: 1;
        margin: 0 5px;
        padding: 8px;
        background-color: white;
        color: black;
        border-radius: 8px;
        border: none;
        box-shadow: 0px -1px 12px 1px rgba(250, 114, 114, 1);
      }

      .default{
        background-color: #FA7272;
        color: white;
      }
    }
  }
}
</style>