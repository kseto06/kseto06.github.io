const mainContent: string = `
    <style>
    @font-face {
        font-family: 'MaruMinya';
        src: url('/fonts/MaruMinya.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
    }

    .popup-wrapper {
        font-family: 'MaruMinya';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        padding: 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        background-color: white;
        color: black;
        z-index: 9999;
    }

    .popup-bg {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background-image: url('/images/calligraphy.jpg');
        background-size: cover;
        background-position: center;
        opacity: 0.15;
        border-radius: 0.5rem;
        z-index: 0;
    }

    .popup-content {
        position: relative;
        z-index: 1;
        min-height: 625px; /* Adjust this as needed */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .popup-title {
        font-size: 1.75rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
    }

    .project {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        border-top: 1px solid #ddd;
        padding: 1.2rem 0;
    }

    .project img {
        width: 140px;
        height: 90px;
        object-fit: cover;
        border-radius: 0.5rem;
    }

    .project-content {
        flex-grow: 1;
    }

    .project-title {
        font-family: 'MaruMinya', sans-serif;
        font-size: 1.1rem;
        font-weight: bold;
    }

    .project-desc {
        font-size: 0.9rem;
        color: #444;
        margin-top: 0.25rem;
    }

    .project-date {
        font-size: 0.8rem;
        color: #0066cc;
        white-space: nowrap;
    }

    .popup-close {
        font-size: 0.75rem;
        color: #666;
        margin-top: 1.5rem;
        text-align: center;
        cursor: pointer;
    }
    </style>

    <div class="popup-wrapper">
    <div class="popup-bg"></div>
    <div class="popup-content">
        <h2 class="popup-title">Projects</h2>

        <div class="project" name="aegis">
            <img src="/images/aegis.png" alt="Aegis"/>
            <div class="project-content">
                <div class="project-title">Right-Hook Collision Detection and Prevention Systems (Praxis II)</div>
                <div class="project-desc">Leveraging computer vision and lights to develop a cyclist detection system that mitigates right-hook collisions in Toronto.</div>
            </div>
            <div class="project-date">Jan 2025 - Apr 2025</div>
        </div>

        <div class="project" name="aisquared">
            <img src="/images/aisquared.png" alt="UTMIST AI^2 Tournament" />
            <div class="project-content">
                <div class="project-title">UTMIST AI^2 Tournament</div>
                <div class="project-desc">The official, first-ever tournament launched by UTMIST focused on Reinforcement Learning.</div>
            </div>
            <div class="project-date">Nov 2024 - Mar 2025</div>
        </div>

        <div class="project">
            <img src="/images/innerworlds.png" alt="InnerWorlds" />
            <div class="project-content">
                <div class="project-title">Inner Worlds</div>
                <div class="project-desc">Unity Framework to turn simple text prompts into immersive & explorable 3D environments by leveraging LLMs, Generative AI, and spatial reasoning.</div>
            </div>
            <div class="project-date">Mar 2025</div>
        </div>

        <div class="project">
            <img src="/images/otakunet.png" alt="OtakuNet" />
            <div class="project-content">
                <div class="project-title">OtakuNet</div>
                <div class="project-desc">Anime app that uses content-based filtering trained on a neural network framework made from scratch to recommend different animes based on what genres the user likes.</div>
            </div>
            <div class="project-date">Sep 2024 - Oct 2024</div>
        </div>

        <div class="popup-close">click anywhere to close</div>
    </div>
`;

export function createProjectPopup(): HTMLElement {
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

function updatePopupContent(wrapper: HTMLElement, popupContent: HTMLElement, projectId: string | null): void {
    //Project HTMLs
    if (projectId === 'aisquared') {
        popupContent.innerHTML = `
            <h2 class="popup-title">UTMIST AI^2 Tournament</h2>
                <p>Details about the tournament...</p>
            <div class="popup-close">← back</div>
        `;
    } else if (projectId === 'aegis') {
        popupContent.innerHTML = `
            <h2 class="popup-title">Aegis</h2>
                <p>Details about the cyclist detection system...</p>
            <div class="popup-close">← back</div>
        `;
    }

    // Attach event listener for the back button
    popupContent.querySelector('.popup-close')?.addEventListener('click', (e) => {
        e.stopPropagation();
        wrapper.innerHTML = mainContent;

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