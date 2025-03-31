import { LoadingManager } from 'three';
import Environment from './Environment';

const loadingScreen: HTMLElement = document.getElementById('loading-screen')!;
const canvas: HTMLElement = document.getElementById('three-canvas')!;

export const manager: LoadingManager = new LoadingManager();

manager.onLoad = () => {
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
