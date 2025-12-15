<script setup lang="ts">
defineProps<{
  modelValue: string
  placeholder?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <input 
    type="text" 
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    :placeholder="placeholder || 'Type a new message'" 
    class="border border-[#828282] rounded-[5px] py-2.5 px-4 text-xs outline-none h-[40px]" 
  />
</template>
