import { LoadingManager } from 'three';
import Environment from './Environment';

const loadingScreen: HTMLElement = document.getElementById('loading-screen')!;
const loadingText: HTMLElement = document.getElementById('loading-text')!;
const enterText: HTMLElement = document.getElementById('enter-text')!;
const canvas: HTMLElement = document.getElementById('three-canvas')!;

export const manager: LoadingManager = new LoadingManager();

manager.onLoad = () => {   
    //Fading out loading screen text
    loadingText.classList.add('hidden');

    //Fading in enter text delay
    setTimeout(() => {
        enterText.classList.remove('hidden');
    }, 1000);

    const Enter = () => {
        window.removeEventListener('click', Enter);
        loadingScreen.classList.add('fade-out');

        setTimeout(() => {
            const env: Environment = new Environment(canvas as HTMLCanvasElement);

            const animate = () => {
                requestAnimationFrame(animate);
                env.update();
            };
            animate();

            canvas.classList.add('show');
        }, 1000);
    };

    window.addEventListener('click', Enter);
};
