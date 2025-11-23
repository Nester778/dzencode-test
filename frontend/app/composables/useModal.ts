import { ref } from 'vue'

export interface ModalState {
    isOpen: boolean
    data?: any
}

export function useModal() {
    const modalState = ref<ModalState>({
        isOpen: false,
        data: null
    })

    const openModal = (data?: any) => {
        modalState.value.isOpen = true
        if (data) {
            modalState.value.data = data
        }
    }

    const closeModal = () => {
        modalState.value.isOpen = false
        modalState.value.data = null
    }

    return {
        modalState,
        openModal,
        closeModal
    }
}