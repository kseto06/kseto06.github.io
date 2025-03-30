import { LoadingManager } from 'three';
import Environment from './Environment';

const loadingScreen = document.getElementById('loading-screen')!;
const canvas = document.getElementById('three-canvas')!;

export const manager = new LoadingManager();

manager.onLoad = () => {
    loadingScreen.classList.add('fade-out');

    setTimeout(() => {
        const env = new Environment(canvas as HTMLCanvasElement);

        const animate = () => {
            requestAnimationFrame(animate);
            env.update();
        };
        animate();

        canvas.classList.add('show');
    }, 1000);
};
