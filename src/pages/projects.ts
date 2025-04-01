const mainContent: string = `
    <link rel="stylesheet" href="/styles/projects.css" />
    <div class="popup-wrapper">
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

        <div class="popup-close-wrapper">
            <div class="popup-close">click anywhere to close</div>
        </div>

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

function updatePopupContent(wrapper: HTMLElement, popupContent: HTMLElement, projectId: string | null): void {
    //Project HTMLs
    if (projectId === 'aisquared') {
        popupContent.innerHTML = `
            <h2 class="popup-title">UTMIST AI^2 Tournament</h2>
                <p>Details about the tournament...</p>
        `;
    } else if (projectId === 'aegis') {
        popupContent.innerHTML = `
            <h2 class="popup-title">Aegis</h2>
                <p>
                    In recent years, cycling injuries have increased despite the presence of various safety measures in Toronto. Many of these accidents go unnoticed outside the cycling community. Thus, our team aims to enhance safety by improving driver awareness. 
                    <br>
                    <br>
                    To better understand the challenges cyclists face, we spoke to Jun Nogami, a lead organizer from Advocacy for Respect for Cyclists (ARC). For context, ARC is a Toronto-based advocacy group dedicated to promoting the safety, rights and respect of cyclists. Through initiatives such as ghost bike memorials, driver awareness campaigns, and collaborations with other cycling coalitions, ARC works to reduce cycling accidents in Toronto. 
                    <br>
                    <br>
                    The primary stakeholders are cyclists and motorized vehicles who are directly impacted by right-hook collisions. Secondary stakeholders include cycling coalitions, families of cyclists, pedestrians, government officials, and our team. Discussions with ARC and research on the cycling data and experiences in Toronto and the Greater Toronto Area helped us define the key requirements for the ideal solution. 
                    <br>
                    <br>
                    The need is to keep cyclists safe by increasing driver awareness in hopes of preventing right-hook collisions. The implementation of the solution is not restricted strictly to motorized vehicles or bikes. An effective solution must adhere to the three high-level objectives: safety, legality, and accessibility. 
                    <br>
                    <br>
                    Current existing solutions range from bike accessories (namely rearview mirrors on bike handlebars, tail lights with cameras attached, and pool noodle attachments) and car features (such as blind spot detectors and Tesla’s computer vision), to infrastructure (like Dutch-style intersections). These designs enhance cycling safety by increasing cyclists' awareness, which opposes the goal of raising driver's attention as cyclists are the most vulnerable in the shared road space. The existing solutions lack the focus on increasing driver awareness, hence alternative solutions framed by the requirements included in the RFP are required. 
                </p>
        `;
    }

    const backWrapper = document.createElement('div');
    backWrapper.className = 'popup-back-wrapper';
    backWrapper.innerHTML = `<div class="popup-close">← back</div>`;

    const popupWrapper = wrapper.querySelector('.popup-wrapper');
    popupWrapper?.appendChild(backWrapper);

    // Attach event listener for the back button
    backWrapper.querySelector('.popup-close')?.addEventListener('click', (e) => {
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