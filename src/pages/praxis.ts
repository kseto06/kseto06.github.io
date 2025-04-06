/*
    Praxis portfolio page
*/

var mainContent: string = '';

(async () => {
    mainContent = await fetch('/pages/praxis.html').then(res => res.text());
})();

export async function createPraxisPopup(): Promise<HTMLElement> {
    const wrapper: HTMLDivElement = document.createElement('div');
    wrapper.id = "projects";
    wrapper.innerHTML = mainContent;

    // Closing the wrapper
    setTimeout(() => {
        window.addEventListener(
        'click',
        (evt) => {
            const target = evt.target as HTMLElement;
            if (!target.closest('.popup-wrapper')) {
                wrapper.remove();
            }
        },
        );

        wrapper.querySelector('.popup-close-wrapper')?.addEventListener('click', () => {
            wrapper.remove();
        });
    });

    wrapper.querySelector('.popup-wrapper')?.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const projectElement = target.closest('.project');
        if (projectElement) {
            event.stopPropagation(); //Pause to allow clicking into project
            const projectId = projectElement.getAttribute('name');
            const popupContent = wrapper.querySelector('.popup-content') as HTMLElement | null;
            if (popupContent) {
                if (popupContent instanceof HTMLElement) {
                    updatePopupContent(wrapper, popupContent, projectId);
                }
            }
        }
    });

    return wrapper;
}

async function updatePopupContent(wrapper: HTMLElement, popupContent: HTMLElement, projectId: string | null): Promise<void> {
    //Project HTMLs
    if (projectId === 'aegis') {
        popupContent.innerHTML = await fetch('/pages/popups/aegis.html').then(res => res.text());
    } else if (projectId === 'civbridge') {
        popupContent.innerHTML = await fetch('/pages/popups/civ.html').then(res => res.text());
    } else if (projectId === 'sleep') {
        popupContent.innerHTML = await fetch('/pages/popups/sleep.html').then(res => res.text());
    }

    //Attach back 'click anywhere to close' wrapper
    window.addEventListener(
        'click',
        (evt) => {
            const target = evt.target as HTMLElement;
            if (!target.closest('.popup-wrapper')) {
                wrapper.remove();
            }
        },
        );

        wrapper.querySelector('.popup-close-wrapper')?.addEventListener('click', () => {
            wrapper.remove();
    });

    const backWrapper = document.createElement('div');
    backWrapper.className = 'popup-back-wrapper';
    backWrapper.innerHTML = `<div class="popup-close">← back</div>`;

    const popupWrapper = wrapper.querySelector('.popup-wrapper');
    popupWrapper?.appendChild(backWrapper);

    // Attach event listener for the back button
    backWrapper.querySelector('.popup-close')?.addEventListener('click', (e) => {
        e.stopPropagation();
        wrapper.innerHTML = mainContent;

        //Attach back 'click anywhere to close' wrapper
        window.addEventListener(
            'click',
            (evt) => {
                const target = evt.target as HTMLElement;
                if (!target.closest('.popup-wrapper')) {
                    wrapper.remove();
                }
            },
            );

            wrapper.querySelector('.popup-close-wrapper')?.addEventListener('click', () => {
                wrapper.remove();
        });

        //Reconstruct the projects
        wrapper.querySelector('.popup-wrapper')?.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const projectElement = target.closest('.project');
            if (projectElement) {
                event.stopPropagation();
                const projectId = projectElement.getAttribute('name');
                const popupContent = wrapper.querySelector('.popup-content') as HTMLElement | null;

                if (popupContent instanceof HTMLElement) {
                    updatePopupContent(wrapper, popupContent, projectId);
                }
            }
        });
    });
}