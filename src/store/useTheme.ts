import { ref, onMounted } from 'vue';

const darkTheme = ref(localStorage.getItem('theme') === 'dark-theme');

export function useTheme() {
    const toggleTheme = () => {
        darkTheme.value = !darkTheme.value;
        const themeClass = darkTheme.value ? 'dark-theme' : 'light-theme';
        document.body.classList.toggle('dark-theme', darkTheme.value);
        document.body.classList.toggle('light-theme', !darkTheme.value);
        localStorage.setItem('theme', themeClass);
    };

    onMounted(() => {
        const themeClass = darkTheme.value ? 'dark-theme' : 'light-theme';
        document.body.classList.add(themeClass);
    });

    return {
        darkTheme,
        toggleTheme,
    };
}
