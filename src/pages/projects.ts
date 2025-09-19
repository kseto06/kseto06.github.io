var mainContent: string = '';

(async () => {
    mainContent = await fetch('/pages/projects.html').then(res => res.text());
})();

export async function createProjectPopup(): Promise<HTMLElement> {
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

    attachGifPeek(wrapper);
    return wrapper;
}

async function updatePopupContent(wrapper: HTMLElement, popupContent: HTMLElement, projectId: string | null): Promise<void> {
    //Project HTMLs
    if (projectId === 'aegis') {
        popupContent.innerHTML = await fetch('/pages/popups/aegis.html').then(res => res.text());
    }

    //Gif peek functionality
    attachGifPeek(wrapper);

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

    //Only display back button for projects with content
    if (projectId === 'aegis') {
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

            // reattaching the gif after going back into the projects page
            attachGifPeek(wrapper);
        });
    }

    // Normal attachment for `.project` elements
    attachGifPeek(wrapper);
}

function attachGifPeek(root: HTMLElement): void {
    let overlay = root.querySelector("#gif-peek-overlay") as HTMLDivElement | null;
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = "gif-peek-overlay";
        overlay.setAttribute("aria-hidden", "true");
        overlay.hidden = true;
        overlay.className = "gif-peek-overlay";
        overlay.innerHTML = `<img id="gif-peek-image" alt="">`;
        root.appendChild(overlay);
    }

    const overlayImg = overlay.querySelector("#gif-peek-image") as HTMLImageElement;

    const HOVER_DELAY = 1500; //ms
    const isFinePointer = matchMedia('(pointer:fine)').matches;

    let timer: number | null = null;
    let cleanupActivity: (() => void) | null = null;

    const openOverlay = (src: string, alt = '') => {
        overlayImg.src = src;
        overlayImg.alt = alt;
        overlay.hidden = false;
        overlay.setAttribute('data-open', 'true');
        overlay.setAttribute('aria-hidden', 'false');

        const onActivity = () => closeOverlay();
        const addActivity = () => {
        window.addEventListener('mousemove', onActivity, { once: true, capture: true });
        window.addEventListener('scroll', onActivity, { once: true, capture: true });
        window.addEventListener('click', onActivity, { once: true, capture: true });
        window.addEventListener('keydown', onActivity, { once: true, capture: true });
        overlay!.addEventListener('click', onActivity, { once: true });
        cleanupActivity = () => {
            window.removeEventListener('mousemove', onActivity, { capture: true } as any);
            window.removeEventListener('scroll', onActivity, { capture: true } as any);
            window.removeEventListener('click', onActivity, { capture: true } as any);
            window.removeEventListener('keydown', onActivity, { capture: true } as any);
            overlay!.removeEventListener('click', onActivity);
        };
        };
        addActivity();
    };

    const closeOverlay = () => {
        overlay!.removeAttribute('data-open');
        overlay!.setAttribute('aria-hidden', 'true');
        overlay!.hidden = true;
        overlayImg.src = '';
        if (cleanupActivity) cleanupActivity();
        cleanupActivity = null;
    };

    const cancelTimer = () => {
        if (timer !== null) {
        window.clearTimeout(timer);
        timer = null;
        }
    };

    // mouse hover functionality on `.project` elements for gif activation and deactivation
    if (isFinePointer) {
        root.addEventListener(
            'mouseover',
            (e) => {
                const element = (e.target as HTMLElement).closest('.project');
                if (!element || !root.contains(element)) return;
                cancelTimer();
                timer = window.setTimeout(() => {
                    // src can be the gif or singular image if gif does not exist for that particular project element
                    const src =
                        (element.querySelector('.gif-hover') as HTMLImageElement | null)?.src ||
                        (element.querySelector('.default-img') as HTMLImageElement | null)?.src ||
                        '';
                    if (src) {
                        const alt =
                        (element.querySelector('img[alt]') as HTMLImageElement | null)?.alt ||
                        'Preview';
                        openOverlay(src, alt);
                    }
                }, HOVER_DELAY);
            },
            true
        );

        root.addEventListener(
            'mouseout',
            (e) => {
                const element = (e.target as HTMLElement).closest('.project');
                if (!element || !root.contains(element)) return;
                cancelTimer();
            },
            true
        );
    }
}